// Pruebas de la pieza «quim-molecula-3d»: el respaldo plano (lo que se ve sin WebGL 2, en las miniaturas y en Node)
// conserva enlaces, pares libres y dipolos; girar no cambia los largos; la parte viva solo existe en el navegador.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-molecula-3d.js');

const AGUA = {
  atomos: [{ id: 'O', t: 'O', pos: [0, 0, 0] }, { id: 'H1', t: 'H', pos: [0.8, -0.6, 0] }, { id: 'H2', t: 'H', pos: [-0.8, -0.6, 0] }],
  enlaces: [{ a: 'O', b: 'H1', orden: 1, dipolo: 'a' }, { a: 'O', b: 'H2', orden: 1, dipolo: 'a' }],
  pares: [{ en: 'O', dir: [0.6, 0.6, 0.53] }, { en: 'O', dir: [-0.6, 0.6, -0.53] }],
  total: [0, 1.2, 0],
  vista: { giro: 0, inclinacion: 0 },
};

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['quim-molecula-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el respaldo plano es un SVG con un alt que avisa la proyección', () => {
  const s = P.dibujar(AGUA, { dipolos: true, pares: true });
  assert.match(s, /^<svg/);
  assert.match(P.alt(AGUA), /proyección plana/);
  assert.match(P.alt(AGUA), /O–H, O–H/);
});

test('pares libres y dipolos se muestran solo si el estado los pide', () => {
  const con = P.plano(AGUA, { dipolos: true, pares: true }), sin = P.plano(AGUA, { dipolos: false, pares: false });
  assert.equal(con.pares.length, 2);
  assert.equal(sin.pares.length, 0);
  assert.equal(con.flechas.length, 1);                     // el dipolo total
  assert.equal(sin.flechas.length, 0);
  assert.deepEqual(con.enlaces.map(e => e.dipolo), ['a', 'a']);
  assert.deepEqual(sin.enlaces.map(e => e.dipolo), [undefined, undefined]);
});

test('sin dipolo total (molécula apolar) no hay flecha gruesa', () => {
  const co2 = { atomos: [{ id: 'C', t: 'C', pos: [0, 0, 0] }, { id: 'O1', t: 'O', pos: [1, 0, 0] }, { id: 'O2', t: 'O', pos: [-1, 0, 0] }],
    enlaces: [{ a: 'C', b: 'O1', orden: 2, dipolo: 'b' }, { a: 'C', b: 'O2', orden: 2, dipolo: 'b' }], pares: [], total: [0, 0, 0] };
  assert.equal(P.plano(co2, { dipolos: true }).flechas.length, 0);
});

test('girar conserva el largo y la vista mueve la proyección', () => {
  const v = [0.3, -0.5, 0.81];
  const g = P.girar(v, 37, -22);
  assert.ok(Math.abs(Math.hypot(...g) - Math.hypot(...v)) < 1e-12);
  const a = P.plano(AGUA, {}).atomos.find(x => x.id === 'H1');
  const b = P.plano(Object.assign({}, AGUA, { vista: { giro: 90, inclinacion: 0 } }), {}).atomos.find(x => x.id === 'H1');
  assert.notEqual(a.x.toFixed(6), b.x.toFixed(6));
});

test('escala opcional: achica el respaldo plano sin cambiar la molécula', () => {
  const d = { atomos: [{ id: 'c', t: 'C', pos: [0, 0, 0] }, { id: 'h', t: 'H', pos: [1, 0, 0] }], enlaces: [{ a: 'c', b: 'h', orden: 1 }], pares: [], total: null, vista: { giro: 0, inclinacion: 0 } };
  const P = require('./quim-molecula-3d.js');
  assert.equal(P.plano(d, {}).escala, 40);
  assert.equal(P.plano(Object.assign({}, d, { escala: 0.6 }), {}).escala, 24);
  assert.deepEqual(P.plano(Object.assign({}, d, { escala: 0.6 }), {}).atomos, P.plano(d, {}).atomos);
});
