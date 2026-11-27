// Oscilaciones: laboratorio. RK4 independiente, grillas completas, misiones y geometría.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./oscilaciones.js');
const T = require('../../../nucleo/teoria.js');
const E = require('../../../nucleo/ecuacion.js');
const P = require('../../../nucleo/kit/piezas/fis-estatica.js');
require('../../../nucleo/kit/piezas/ejes.js');
test('oscilaciones: cuatro mesas, 400 movimientos independientes y geometría de todas las grillas', () => {
assert.equal(def.laboratorio.length, 4);
const errores = [], count = { figuras: 0, dinamica: 0, misiones: 0 };
function check(sitio, f) { try { f(); } catch (e) { errores.push({ sitio, error: e.message }); } }
function near(a, b, tol = 1e-5) { assert.ok(Math.abs(a - b) < tol, `${a} frente a ${b}`); }
// Integramos fuerza proporcional a la posición mediante RK4, sin usar coseno ni seno.
function integra(x, v, razon, fin) {
  const n = Math.max(20, Math.ceil(fin / 0.002)), h = fin / n;
  for (let j = 0; j < n; j++) {
    const a = v, b = -razon * x, c = v + h * b / 2, d = -razon * (x + h * a / 2), e = v + h * d / 2, f = -razon * (x + h * c / 2), g = v + h * f, z = -razon * (x + h * e);
    x += h * (a + 2 * c + 2 * e + g) / 6; v += h * (b + 2 * d + 2 * f + z) / 6;
  }
  return { x, v };
}
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
for (const lab of def.laboratorio) {
  const grid = T.grilla(lab.controles), base = T.inicio(lab);
  lab.invitaciones.forEach((inv, j) => check(lab.id + ' misión ' + j, () => { assert.ok(!inv.logrado(base, []), 'Cumplida al abrir'); assert.ok(grid.some(v => inv.logrado(v, [])), 'Sin testigo'); count.misiones++; }));
  // Barrido completo de grilla; los 400 casos adicionales de movimiento usan tiempos intermedios del animador.
  for (const val of grid) check(lab.id + ' figura ' + JSON.stringify(val), () => {
    const dib = lab.dibujo(val);
    if (lab.pieza === 'fis-estatica') {
      const geo = P.geometria(dib.datos, dib.estado || {});
      for (const r of [...geo.rotulos, ...geo.objetos]) assert.ok(r.x0 >= 4 && r.x1 <= 316 && r.y0 >= 4 && r.y1 <= geo.H - 4, `Margen: ${JSON.stringify(r)}`);
      for (let j = 0; j < geo.rotulos.length; j++) {
        for (const q of geo.rotulos.slice(j + 1)) assert.ok(!pisa(geo.rotulos[j], q), `Rótulos: ${geo.rotulos[j].texto} / ${q.texto}`);
        for (const q of geo.objetos) assert.ok(!pisa(geo.rotulos[j], q), `Rótulo sobre objeto: ${geo.rotulos[j].texto}`);
      }
    }
    const txt = E.texto(lab.lectura(val)); assert.ok(!/_|NaN|undefined|Infinity/.test(txt)); count.figuras++;
  });
}
for (let s = 0; s < 400; s++) check('dinámica ' + s, () => {
  const vivo = def.laboratorio[0], val = { A: 5 * (1 + s % 4), k: 20 * (1 + Math.floor(s / 4) % 4), m: (1 + Math.floor(s / 16) % 4) / 2, t: (s * 0.01739) % 6 };
  const ti = Number(val.t.toFixed(2)), pred = integra(val.A, 0, val.k / val.m, ti);
  const bloque = vivo.dibujo(val).datos.objetos.find(o => o.tipo === 'caja'); near((bloque.x - 178) / 4, pred.x, 1e-5);
  const pen = def.laboratorio[2], v = { L: (1 + s % 4) / 4, g: [2.5, 5, 10][s % 3], t: val.t };
  const bola = pen.dibujo(v).datos.objetos.find(o => o.tipo === 'pelota'); near(Math.hypot(bola.x - 160, bola.y - 32), 180 * v.L);
  const ang = integra(8 * Math.PI / 180, 0, v.g / v.L, ti).x; near(Math.atan2(bola.x - 160, bola.y - 32), ang, 1e-7);
  const li = def.laboratorio[1], fval = { x: (s % 9 - 4) * 5, k: val.k, m: val.m }, dat = li.dibujo(fval).datos;
  const esperado = -(fval.k * fval.x / 100) / fval.m, texto = E.texto(li.lectura(fval));
  const leido = Number(texto.match(/([−-]?\d+(?:,\d+)?)\s*m\/s/)[1].replace('−', '-').replace(',', '.')); near(leido, esperado, 0.005001);
  const flecha = dat.flechas[0]; if (Math.abs(esperado) > 1e-9) { near(flecha.largo, 2 * Math.abs(esperado)); assert.equal(flecha.ang, esperado > 0 ? 0 : 180); } else assert.equal(dat.flechas.length, 0);
  count.dinamica++;
});
check('formato y reglas del laboratorio', () => { const problemas = T.problemas(def, { semillas: 4 }); assert.deepEqual(problemas, []); });

assert.deepEqual(errores, []);
assert.equal(count.dinamica, 400);
assert.equal(count.misiones, 12);
});
