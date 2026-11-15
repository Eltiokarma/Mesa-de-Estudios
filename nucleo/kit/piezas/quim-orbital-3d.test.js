// Pruebas de la pieza «quim-orbital-3d»: el respaldo plano y el alt muestran la nube y los nodos que calcula el motor de
// plantillas/atomo-y-tabla; girar no cambia la nube.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-orbital-3d.js');
const M = require('../../../plantillas/atomo-y-tabla/motor.js');

const datos = (id, o = {}) => {
  const orb = M.orbital(id), nb = M.nube(id, { corte: !!o.corte });
  return { puntos: nb.puntos, escala: 2.6 / orb.r90, nombre: orb.nombre, corte: nb.corte, lobulos: M.lobulos(id),
    nodos: o.nodos ? { radiales: orb.radiales, planos: orb.planos, conos: orb.conos } : null };
};

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['quim-orbital-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el respaldo dibuja una muestra de la nube con los dos signos en sus colores, sin NaN', () => {
  const s = P.dibujar(datos('2pz'));
  assert.match(s, /^<svg/);
  assert.doesNotMatch(s, /NaN|undefined|null/);
  assert.match(s, /kit-mas" fill="var\(--c-i/);
  assert.match(s, /kit-menos" fill="var\(--c-f/);
  const n = (s.match(/<circle /g) || []).length;
  assert.ok(n > 400 && n < 720, `${n} círculos`);
});

test('el alt nombra el orbital, el corte y los nodos que da el motor', () => {
  assert.match(P.alt(datos('1s')), /orbital 1s del hidrógeno: 1600 puntos/);
  assert.doesNotMatch(P.alt(datos('1s')), /positiva y negativa/);
  assert.match(P.alt(datos('2s', { corte: true, nodos: true })), /cortada por el plano xz.*un nodo esférico/);
  assert.match(P.alt(datos('3dxy', { nodos: true })), /3dxy.*positiva y negativa; 2 planos nodales/);
  assert.match(P.alt(datos('3dz2', { nodos: true })), /3dz².*dos conos nodales/);
});

test('los nodos esféricos del respaldo son círculos del radio que da el motor', () => {
  const pl = P.plano(datos('3s', { nodos: true }));
  const o = M.orbital('3s');
  assert.deepEqual(pl.circulos.map(r => +r.toFixed(6)), o.radiales.map(r => +(r * 2.6 / o.r90 * 38).toFixed(6)));
});

test('los rótulos «ψ +» y «ψ −» caen donde ψ tiene su signo, en su color; el 2pz pone «ψ +» arriba', () => {
  for (const id of M.ORBITALES) {
    const r = P.rotulos(datos(id));
    for (const x of r) {
      assert.equal(Math.sign(M.psi(id, ...x.pos)), x.signo, id);
      assert.equal(x.color, x.signo > 0 ? 'c-i' : 'c-f');
    }
    if (r.length === 2) assert.ok(Math.hypot(...r[0].pos.map((v, k) => v - r[1].pos[k])) > 0.5 * M.orbital(id).r90 * 0.3, `${id}: rótulos encimados`);
  }
  const r = P.rotulos(datos('2pz'));
  assert.equal(r.find(x => x.signo === 1).texto, 'ψ +');
  assert.ok(r.find(x => x.signo === 1).pos[2] > 0);
  assert.equal(P.rotulos(datos('1s')).length, 1);
});

test('girar y pasar a la escena conservan las distancias (la vista no cambia la nube)', () => {
  const v = [0.7, -0.2, 1.1];
  assert.ok(Math.abs(Math.hypot(...P.girar(v, 40, -25)) - Math.hypot(...v)) < 1e-12);
  assert.ok(Math.abs(Math.hypot(...P.aEscena(v)) - Math.hypot(...v)) < 1e-12);
  assert.deepEqual(P.aEscena([0, 0, 1]), [0, 1, -0]);                // el eje z de química queda hacia arriba
});

test('animación: con medidas se ven solo los primeros puntos de la muestra y la forma no cambia (ronda 5)', () => {
  const d = datos('2pz'), total = d.puntos.length;
  assert.equal(P.vistos(d), total);                                    // sin medidas, todos (como antes)
  assert.equal(P.dibujar(d), P.dibujar(Object.assign({}, d, { medidas: undefined })));
  const poco = Object.assign({}, d, { medidas: 100 }), mucho = Object.assign({}, d, { medidas: 800 });
  assert.equal(P.vistos(poco), 100);
  assert.match(P.alt(poco), /: 100 puntos/);
  const circulos = s => (s.match(/r="1.6"/g) || []).length;
  assert.ok(circulos(P.dibujar(poco)) < circulos(P.dibujar(mucho)));
  assert.equal(P.forma(poco), P.forma(mucho));                         // mover, no rearmar
  assert.notEqual(P.forma(poco), P.forma(datos('3pz', { medidas: 100 })));
  // contar: cuántos índices crecientes quedan por debajo de n.
  assert.equal(P.contar([0, 3, 5, 9], 5), 2);
  assert.equal(P.contar([0, 3, 5, 9], 100), 4);
  assert.equal(P.contar([], 10), 0);
});
