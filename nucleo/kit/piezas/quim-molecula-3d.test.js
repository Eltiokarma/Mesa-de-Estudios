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

test('animación: el giro propio gira la proyección como la vista, sin cambiar la forma (ronda 5)', () => {
  const v = AGUA.vista;
  const con = g => P.plano(Object.assign({}, AGUA, { giro: g }), { dipolos: true, pares: true });
  assert.deepEqual(con(0), P.plano(AGUA, { dipolos: true, pares: true }));          // sin giro, como antes
  const visto = P.plano(Object.assign({}, AGUA, { vista: { giro: v.giro + 90, inclinacion: v.inclinacion } }), { dipolos: true, pares: true });
  assert.deepEqual(con(90).atomos, visto.atomos);
  assert.equal(P.forma(Object.assign({}, AGUA, { giro: 0 }), {}), P.forma(Object.assign({}, AGUA, { giro: 120 }), {}));
  assert.notEqual(P.forma(AGUA, { dipolos: true }), P.forma(AGUA, { dipolos: false }));
  // Girar no cambia la molécula: las distancias entre átomos de la proyección cambian, las 3D no (las da la unidad).
  assert.notDeepEqual(con(0).atomos, con(90).atomos);
});

// Ampliación (sesión quimica-b, hidrocarburos): un enlace que gira cambia posiciones, no la forma; mover deja la escena
// igual que rearmarla. Con pares libres o dipolos a la vista, si las posiciones cambian, pide rearmar.
test('forma y mover: la conformación que gira se mueve sin rearmar y queda como armada de nuevo', () => {
  const fs = require('fs'), vm = require('vm'), path = require('path');
  const T = vm.runInNewContext(`${fs.readFileSync(path.join(__dirname, '../../../app/vendor/three/three-mesa.min.js'), 'utf8')};THREE`, {});
  const MH = require('../../../plantillas/hidrocarburos/motor.js');
  const mol = phi => { const c = MH.conformacion('butano', phi); return { atomos: c.atomos, enlaces: c.enlaces, pares: [], total: null }; };
  const E = { dipolos: false, pares: false };
  assert.equal(P.forma(mol(0), E), P.forma(mol(137.4), E));
  assert.notEqual(P.forma(mol(0), E), P.forma({ ...mol(0), enlaces: mol(0).enlaces.slice(1) }, E));
  const h = {
    SEG: 8, material: () => new T.MeshBasicMaterial(), etiqueta: p => ({ p: p.clone() }), moverEtiqueta: (el, p) => { el.p.copy(p); },
    barra: (de, a, r) => { const v = new T.Vector3().subVectors(a, de), m = new T.Mesh(new T.CylinderGeometry(r, r, v.length(), 8));
      m.position.copy(de).addScaledVector(v, 0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.clone().normalize()); return m; },
    flecha: () => new T.Group(), oscuro: () => false, varCss: (n, x) => x,
  };
  const armar = (d, e = E) => { const g = new T.Group(); P.spec.construir(T, g, d, e, h); return g; };
  const g = armar(mol(60));
  assert.equal(P.spec.mover(T, g, mol(137.4), E, h), true);
  const ref = armar(mol(137.4)), hijos = x => x.children[0].children;      // todo va dentro del pivote
  assert.equal(hijos(g).length, hijos(ref).length);
  // Cada barra: mismos extremos (el eje y del cilindro, escalado, cae sobre el de la barra armada de nuevo).
  const punta = x => new T.Vector3(0, 0.5 * x.geometry.parameters.height, 0).multiply(x.scale).applyQuaternion(x.quaternion).add(x.position);
  hijos(g).forEach((o, i) => {
    const r = hijos(ref)[i];
    assert.ok(o.position.distanceTo(r.position) < 1e-9);
    if (o.geometry.type === 'CylinderGeometry') assert.ok(punta(o).distanceTo(punta(r)) < 1e-9);
  });
  assert.equal(P.spec.mover(T, new T.Group(), mol(0), E, h), false);           // sin escena armada: pide rearmar
  // Con pares a la vista: girar todo (giro) sigue por la ruta rápida; mover átomos pide rearmar.
  const agua = armar(AGUA, { pares: true });
  assert.equal(P.spec.mover(T, agua, Object.assign({}, AGUA, { giro: 40 }), { pares: true }, h), true);
  const otra = Object.assign({}, AGUA, { atomos: AGUA.atomos.map(a => (a.id === 'H1' ? Object.assign({}, a, { pos: [0.9, -0.5, 0] }) : a)) });
  assert.equal(P.spec.mover(T, agua, otra, { pares: true }, h), false);
});
