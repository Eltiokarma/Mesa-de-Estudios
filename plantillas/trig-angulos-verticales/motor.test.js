// Pruebas del motor del campo con la torre (motor.js). Se corren desde la raíz con: node --test
// Los casos de CASOS se calcularon aparte, en Python, con coordenadas y producto punto (sin la ley de cosenos), el
// 15 nov 2026; las propiedades comparan las dos vías del motor (coordenadas y ley de cosenos) en un barrido.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

const cerca = (x, y, que, tol = 1e-9) => assert.ok(Math.abs(x - y) < tol, `${que}: ${x} contra ${y}`);

const CASOS = [
  { h: 12, ojo: 0, obs: [{ az: 180, d: 16 }, { az: 90, d: 9 }], elev: [36.86989764584402, 53.13010235415598], angulo: 90, AB: 18.35755975068582 },
  { h: 10, ojo: 1.5, obs: [{ az: 30, d: 10 }, { az: 240, d: 8 }], elev: [40.36453657309736, 46.73570458892839], angulo: 150, AB: 17.394368761340846 },
  { h: 20, ojo: 0, obs: [{ az: 315, d: 20 }, { az: 135, d: 5 }], elev: [45, 75.96375653207353], angulo: 180, AB: 25 },
  { h: 8, ojo: 0, obs: [{ az: 0, d: 6 }, { az: 60, d: 6 }], elev: [53.13010235415598, 53.13010235415598], angulo: 60, AB: 6 },
];

test('casos verificados aparte: elevaciones, ángulo en el pie y distancia entre observadores', () => {
  for (const c of CASOS) {
    const r = M.campo(c);
    c.elev.forEach((e, k) => cerca(r.obs[k].elev, e, `elevación ${k}`));
    cerca(r.pares[0].angulo, c.angulo, 'ángulo en el pie');
    cerca(r.pares[0].distancia, c.AB, 'AB por coordenadas');
    cerca(r.pares[0].cosenos, c.AB, 'AB por ley de cosenos');
  }
});

test('rumbos como en el examen', () => {
  const t = az => M.rumbo(az).texto;
  assert.equal(t(0), 'N'); assert.equal(t(90), 'E'); assert.equal(t(180), 'S'); assert.equal(t(270), 'O'); assert.equal(t(360), 'N');
  assert.equal(t(30), 'N 30° E'); assert.equal(t(150), 'S 30° E'); assert.equal(t(240), 'S 60° O'); assert.equal(t(315), 'N 45° O');
  assert.equal(t(-45), 'N 45° O');
  for (let az = 0; az < 360; az += 5) {
    const r = M.rumbo(az);
    assert.ok(r.angulo >= 0 && r.angulo < 90, `${az}: ángulo agudo`);
  }
});

test('barrido: las dos vías dan la misma AB y la elevación cumple tan = (h − ojo)/d', () => {
  for (let az1 = 0; az1 < 360; az1 += 15) for (let az2 = 0; az2 < 360; az2 += 45) for (const d of [2, 7, 13]) {
    const r = M.campo({ h: 9, ojo: 1, obs: [{ az: az1, d }, { az: az2, d: 5 }] });
    cerca(r.pares[0].distancia, r.pares[0].cosenos, `AB ${az1} ${az2} ${d}`, 1e-7);
    cerca(Math.tan(r.obs[0].elev * Math.PI / 180), 8 / d, 'tan elevación');
    cerca(r.obs[0].visual, Math.hypot(d, 8), 'visual');
    assert.ok(r.pares[0].angulo >= 0 && r.pares[0].angulo <= 180);
  }
});

test('el rumbo no cambia la elevación; el doble de todo, tampoco', () => {
  const a = M.campo({ h: 6, obs: [{ az: 10, d: 8 }, { az: 200, d: 8 }] });
  cerca(a.obs[0].elev, a.obs[1].elev, 'mismo d, misma elevación');
  const b = M.campo({ h: 12, obs: [{ az: 10, d: 16 }, { az: 200, d: 16 }] });
  cerca(a.obs[0].elev, b.obs[0].elev, 'semejanza');
});

test('datos imposibles se rechazan', () => {
  assert.throws(() => M.campo({ h: 0, obs: [] }));
  assert.throws(() => M.campo({ h: 5, ojo: 6, obs: [] }));
  assert.throws(() => M.elevacion(5, 0));
});
