// Pruebas de la pieza «quim-red-3d»: el respaldo plano y el alt muestran la celda y el bloque que calcula el motor de
// plantillas/liquidos-y-solidos; los trozos de esfera caen dentro del cubo; girar no cambia la figura.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./quim-red-3d.js');
const M = require('../../../plantillas/liquidos-y-solidos/motor.js');

const celda = (k, radio) => { const c = M.celda(k); return { modo: 'celda', sitios: c.sitios, radio: radio || c.radio, nombre: c.nombre }; };
const bloque = k => { const c = M.celda(k); return { modo: 'bloque', bloque: M.bloqueRed(k, 2), radio: 0.12, nombre: c.nombre }; };

test('se registra en el kit con su parte viva', () => {
  assert.equal(Kit.piezas['quim-red-3d'], P);
  assert.equal(typeof P.montar, 'function');
});

test('el alt de la celda cuenta los trozos y suma los átomos que da el motor', () => {
  assert.match(P.alt(celda('cs')), /8 octavos dentro del cubo, 1 átomo en total/);
  assert.match(P.alt(celda('bcc')), /8 octavos y 1 átomo entero dentro del cubo, 2 átomos/);
  assert.match(P.alt(celda('fcc')), /8 octavos y 6 mitades dentro del cubo, 4 átomos/);
  assert.match(P.alt(bloque('fcc')), /8 celdas.*63 átomos; el del centro toca a 12 vecinos/);
});

test('el respaldo: 12 aristas y una esfera por sitio en la celda; en el bloque, vecinos en naranja con enlaces', () => {
  const s = P.dibujar(celda('fcc'));
  assert.match(s, /^<svg/);
  assert.doesNotMatch(s, /NaN|undefined|null/);
  assert.equal((s.match(/<circle /g) || []).length, 14);
  assert.match(s, />⅛</); assert.match(s, />½</);
  const b = P.dibujar(bloque('bcc'));
  assert.equal((b.match(/class="kit-vecino"/g) || []).length, 8);
  assert.equal((b.match(/class="kit-centro"/g) || []).length, 1);
  assert.equal((b.match(/stroke="var\(--c-o/g) || []).length, 8);
});

// Un punto del trozo de esfera en sus ángulos (fórmula de SphereGeometry de three.js).
const punto = (phi, th) => [-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th)];
test('cada trozo de esfera y cada tapa quedan del lado de adentro del cubo', () => {
  for (const k of M.REDES_ORDEN) for (const s of M.celda(k).sitios) {
    const g = P.gajo(...s.dentro);
    const vol = (g.phiLength / (2 * Math.PI)) * ((Math.cos(g.thetaStart) - Math.cos(g.thetaStart + g.thetaLength)) / 2);
    assert.ok(Math.abs(vol - s.fraccion) < 1e-12, `${k} ${s.p}: el trozo es ${vol}`);
    for (const a of [0.1, 0.5, 0.9]) for (const b of [0.1, 0.5, 0.9]) {
      const q = punto(g.phiStart + a * g.phiLength, g.thetaStart + b * g.thetaLength);
      s.dentro.forEach((d, i) => { if (d) assert.ok(q[i] * d > 0, `${k} ${s.p} eje ${i}`); });
    }
    for (const t of P.tapas(s.dentro)) {
      const m = t.sector[0] + t.sector[1] / 2, u = Math.cos(m), v = Math.sin(m);
      if (s.dentro[t.u]) assert.ok(u * s.dentro[t.u] > 0); if (s.dentro[t.v]) assert.ok(v * s.dentro[t.v] > 0);
    }
    assert.equal(P.tapas(s.dentro).length, s.dentro.filter(Boolean).length);
  }
});

test('los rótulos: uno por fracción, afuera del cubo junto a su trozo; el del centro, en el centro', () => {
  assert.deepEqual(P.rotulos(celda('fcc')).map(r => r.texto), ['⅛', '½']);
  const bcc = P.rotulos(celda('bcc'));
  assert.deepEqual(bcc.map(r => r.texto), ['⅛', '1']);
  assert.ok(bcc[0].p.every(x => x < 0 || x > 1), 'el del vértice, afuera');
  assert.deepEqual(bcc[1].p, [0.5, 0.5, 0.5]);
});

test('girar conserva el largo (la vista no cambia la figura)', () => {
  const v = [0.7, -0.2, 1.1];
  assert.ok(Math.abs(Math.hypot(...P.girar(v, 40, -25)) - Math.hypot(...v)) < 1e-12);
});
