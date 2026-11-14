// Pruebas de los datos de la tabla viva (nucleo/kit/tabla/datos.js, generado por herramientas/tabla-datos.js).
// Lo que se puede comprobar sin la fuente: forma, conteos, coincidencias con el motor de atomo-y-tabla y valores
// conocidos de la CIAAW 2024 copiados aparte (los que deciden las inversiones de la fila por masa).
const test = require('node:test');
const assert = require('node:assert/strict');
const { ELEMENTOS, FUENTES } = require('./datos.js');
const Motor = require('../../../plantillas/atomo-y-tabla/motor.js');

test('118 elementos, Z seguido y símbolos sin repetir', () => {
  assert.equal(ELEMENTOS.length, 118);
  ELEMENTOS.forEach((e, i) => assert.equal(e.Z, i + 1));
  assert.equal(new Set(ELEMENTOS.map(e => e.simbolo)).size, 118);
  for (const e of ELEMENTOS) assert.match(e.simbolo, /^[A-Z][a-z]?$/);
  for (const e of ELEMENTOS) assert.ok(e.nombre && e.nombre === e.nombre.toLowerCase(), `nombre de ${e.simbolo}`);
});

test('cada elemento tiene peso atómico estándar o número másico, nunca los dos', () => {
  const conPeso = ELEMENTOS.filter(e => e.peso !== undefined);
  const conMasico = ELEMENTOS.filter(e => e.masico !== undefined);
  assert.equal(conPeso.length, 84);   // CIAAW 2024: 84 elementos con peso atómico estándar
  assert.equal(conMasico.length, 34);
  for (const e of ELEMENTOS) assert.ok((e.peso === undefined) !== (e.masico === undefined), e.simbolo);
  for (const e of conPeso) {
    assert.ok(Number.isFinite(e.peso) && e.peso > 0 && Number.isFinite(e.incertidumbre) && e.incertidumbre > 0, e.simbolo);
    assert.equal(Number(e.pesoTexto), e.peso);
    assert.ok(typeof e.estandar === 'string' && e.estandar.length > 0);
  }
  for (const e of conMasico) assert.ok(e.masico.length >= 1 && e.masico.every(Number.isInteger), e.simbolo);
});

test('los que no tienen peso estándar son los radiactivos sin isótopo estable de la CIAAW', () => {
  const sin = ELEMENTOS.filter(e => e.masico).map(e => e.Z);
  const esperado = [43, 61, 84, 85, 86, 87, 88, 89];
  for (let z = 93; z <= 118; z++) esperado.push(z);
  assert.deepEqual(sin, esperado);
});

test('símbolos y nombres iguales a los del motor de atomo-y-tabla', () => {
  for (let z = 1; z < Motor.SIMBOLOS.length; z++) assert.equal(ELEMENTOS[z - 1].simbolo, Motor.SIMBOLOS[z], `Z = ${z}`);
  for (let z = 1; z < Motor.NOMBRES.length; z++) assert.equal(ELEMENTOS[z - 1].nombre, Motor.NOMBRES[z], `Z = ${z}`);
});

test('valores de control de la CIAAW 2024 (abreviados), copiados aparte', () => {
  const control = { H: 1.008, C: 12.011, O: 15.999, Ar: 39.95, K: 39.098, Fe: 55.845, Co: 58.933, Ni: 58.693,
    Ge: 72.63, Te: 127.6, I: 126.9, Pb: 207.2, Th: 232.04, Pa: 231.04, U: 238.03 };
  for (const [s, v] of Object.entries(control)) assert.equal(ELEMENTOS.find(e => e.simbolo === s).peso, v, s);
  const masicos = { Tc: [97, 98], Pm: [145], Ra: [226], Og: [294] };
  for (const [s, v] of Object.entries(masicos)) assert.deepEqual(ELEMENTOS.find(e => e.simbolo === s).masico, v, s);
});

test('las fuentes están escritas', () => {
  assert.match(FUENTES.peso, /CIAAW/);
  assert.match(FUENTES.masico, /NUBASE2020/);
  assert.match(FUENTES.nombre, /modelo/);
});

test('energía de ionización (NIST): 108 valores, cada uno con su tipo, y nada del 109 al 118', () => {
  const con = ELEMENTOS.filter(e => e.ei);
  assert.equal(con.length, 108);
  for (const e of con) {
    assert.ok(['medido', 'calculado', 'extrapolado'].includes(e.ei.tipo), e.simbolo);
    assert.equal(e.ei.kj, Math.round(e.ei.ev * 96.48533212));
  }
  for (let z = 109; z <= 118; z++) assert.equal(ELEMENTOS[z - 1].ei, undefined);
  const noMedidos = con.filter(e => e.ei.tipo !== 'medido').map(e => e.simbolo);
  assert.deepEqual(noMedidos, ['H', 'Pr', 'Pa', 'Fm', 'Md', 'Rf', 'Db', 'Sg', 'Bh', 'Hs']);
  assert.equal(ELEMENTOS[102].ei.tipo, 'medido');   // el lawrencio, el último medido (Sato y otros 2015)
});

test('energía de ionización y electronegatividad iguales a las de atomo-y-tabla (Z = 1 a 36)', () => {
  for (let z = 1; z <= 36; z++) {
    const e = ELEMENTOS[z - 1];
    assert.equal(e.ei.kj, Motor.EI[z], `EI de ${e.simbolo}`);
    // Única diferencia: PubChem le da 3,0 al Kr en la escala de Pauling; atomo-y-tabla no le ponía valor.
    if (z !== 36) assert.equal(e.en ?? null, Motor.EN[z] ?? null, `EN de ${e.simbolo}`);
  }
  assert.equal(ELEMENTOS[35].en, 3);
});

test('PubChem: sin las electronegatividades estimadas ni lo predicho de Z = 104 a 118', () => {
  for (const s of ['Fr', 'Po', 'At', 'Am', 'Lr', 'He', 'Ne', 'Ar']) assert.equal(ELEMENTOS.find(e => e.simbolo === s).en, undefined, s);
  for (let z = 104; z <= 118; z++) { assert.equal(ELEMENTOS[z - 1].estado, undefined); assert.equal(ELEMENTOS[z - 1].clase, undefined); }
  const clases = new Set(ELEMENTOS.filter(e => e.clase).map(e => e.clase));
  assert.equal(clases.size, 10);
  assert.deepEqual(ELEMENTOS.filter(e => e.clase === 'semimetal').map(e => e.simbolo), ['B', 'Si', 'Ge', 'As', 'Sb', 'Te', 'Po']);
  assert.deepEqual(ELEMENTOS.filter(e => e.estado === 'líquido').map(e => e.simbolo), ['Br', 'Hg']);
  assert.equal(ELEMENTOS.filter(e => e.radio !== undefined).length, 99);
  assert.match(FUENTES.en, /Pauling/);
  assert.match(FUENTES.radio, /van der Waals/);
});
