const test = require('node:test');
const assert = require('node:assert');
const C = require('./celular.js');

test('chico: menos de 900 px es celular', () => {
  assert.equal(C.chico(390), true);
  assert.equal(C.chico(899), true);
  assert.equal(C.chico(900), false);
  assert.equal(C.chico(1366), false);
});

test('alto: tope de 240 px solo con predicción pendiente en el celular', () => {
  assert.equal(C.alto(380, true, { ancho: 390 }), 240);
  assert.equal(C.alto(200, true, { ancho: 390 }), 200);
  assert.equal(C.alto(380, false, { ancho: 390 }), 380);
  assert.equal(C.alto(380, true, { ancho: 1366 }), 380);
  assert.equal(C.alto(500, true, { ancho: 390, tope: 340 }), 340);
});

test('alResponder: en el celular sube el lienzo, espera 380 ms y respeta si el paso cambió', () => {
  const subidas = [], esperas = [];
  const lienzo = { scrollIntoView: o => subidas.push(o.block) };
  const espera = (ms, fn) => { esperas.push(ms); fn(); };
  let animo = 0, vigente = true;
  assert.equal(C.alResponder(lienzo, () => animo++, () => vigente, { ancho: 390, espera }), true);
  assert.deepEqual(subidas, ['start']); assert.deepEqual(esperas, [C.ESPERA]); assert.equal(animo, 1);
  vigente = false; let siNo = 0;
  C.alResponder(lienzo, () => animo++, () => vigente, { ancho: 390, espera, siNo: () => siNo++ });
  assert.equal(animo, 1); assert.equal(siNo, 1);
});

test('alResponder: en pantalla grande anima de inmediato y no mueve la página', () => {
  const subidas = []; let animo = 0;
  const r = C.alResponder({ scrollIntoView: () => subidas.push(1) }, () => animo++, null, { ancho: 1366, espera: () => assert.fail('no espera') });
  assert.equal(r, false); assert.equal(animo, 1); assert.equal(subidas.length, 0);
});

test('el CSS compacto solo aplica bajo 900 px', () => {
  assert.match(C.CSS, /max-width:899px/);
  assert.match(C.CSS, /\.mode\.pendiente \.bench\{position:sticky/);
});
