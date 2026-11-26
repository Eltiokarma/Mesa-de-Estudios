'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const def = require(process.env.GR_LAB_MODULE ? path.resolve(process.env.GR_LAB_MODULE) : './gravitacion.js');
const mesa = def.laboratorio.find(m => m.id === 'orbita-plano-3d');
const modulo = v => Math.hypot(...v);
const punto = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const cerca = (a, b, rel = 1e-10) => assert.ok(Math.abs(a - b) <= rel * Math.max(1e-20, Math.abs(b)), `${a} difiere de ${b}`);

test('Laboratorio orbital: 400 estados obedecen a gravedad, tangencia y escala común', () => {
  for (let i = 0; i < 400; i++) {
    const a = { r: [2, 3, 4, 6][i % 4], inc: (i * 17) % 91, t: ((i * 7919) % 1200000) / 100000 };
    const q = mesa.verificacion(a), d = mesa.dibujo(a).datos;
    const radio = a.r * 4000000, grav = 400000000000000 / (radio * radio);
    cerca(modulo(q.posicion), radio); cerca(modulo(q.velocidad) ** 2 / radio, grav);
    assert.ok(Math.abs(punto(q.posicion, q.velocidad)) < radio * q.v * 1e-12);
    cerca(q.T * q.v, 2 * Math.PI * radio); cerca(q.vueltas, a.t * 3600 / q.T);
    // Diferencias centrales: la aceleración de la posición dibujada debe ser
    // la atracción newtoniana, también al girar el plano.
    const dt = 2, menos = mesa.verificacion({ ...a, t: a.t - dt / 3600 }).posicion;
    const mas = mesa.verificacion({ ...a, t: a.t + dt / 3600 }).posicion;
    const derivada2 = mas.map((x, k) => (x - 2 * q.posicion[k] + menos[k]) / (dt * dt));
    const objetivo = q.posicion.map(x => -grav * x / radio);
    assert.ok(modulo(derivada2.map((x, k) => x - objetivo[k])) < grav * 2e-6);
    const [vf, gf] = d.flechas;
    const dv = vf.a.map((x, k) => x - vf.de[k]), dg = gf.a.map((x, k) => x - gf.de[k]);
    cerca(modulo(dv) / q.v, 0.00009); cerca(modulo(dg) / grav, 0.06); // auditoría (26 nov)
    assert.ok(modulo(d.flechas[1].a) > 0.42, 'la flecha de g no entra al planeta');
    assert.ok(punto(dg, q.posicion) < 0); assert.ok(Math.abs(punto(dv, q.posicion)) < radio * modulo(dv) * 1e-12);
    assert.equal(vf.color, 'c-o'); assert.equal(gf.color, 'tinta');
    assert.equal(vf.rotulo, 'v⃗'); assert.equal(gf.rotulo, 'g⃗');
    const normal = cruz(q.posicion, q.velocidad);
    cerca(normal[2] / modulo(normal), Math.cos(a.inc * Math.PI / 180), 2e-10);
    const vuelta = mesa.verificacion({ ...a, t: a.t + q.T / 3600 }).posicion;
    assert.ok(modulo(vuelta.map((x, k) => x - q.posicion[k])) < radio * 2e-12);
    assert.doesNotMatch(JSON.stringify(d), /NaN|undefined|Infinity/);
  }
});

test('Laboratorio orbital: integración independiente de Newton durante una vuelta', () => {
  // RK4 en coordenadas cartesianas, sin usar omega, seno ni el período de producción.
  const GM = 4e14, r = 12e6, v = Math.sqrt(GM / r), periodo = Math.sqrt(4 * Math.PI ** 2 * r ** 3 / GM);
  const h = periodo / 3000, f = z => {
    const d = Math.hypot(z[0], z[1]);
    return [z[2], z[3], -GM * z[0] / d ** 3, -GM * z[1] / d ** 3];
  };
  const suma = (a, b, k) => a.map((x, i) => x + k * b[i]);
  let z = [r, 0, 0, v];
  for (let j = 0; j < 3000; j++) {
    const k1 = f(z), k2 = f(suma(z, k1, h / 2)), k3 = f(suma(z, k2, h / 2)), k4 = f(suma(z, k3, h));
    z = z.map((x, i) => x + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6);
    if ((j + 1) % 150 === 0) {
      const q = mesa.verificacion({ r: 3, inc: 0, t: (j + 1) * h / 3600 });
      assert.ok(Math.hypot(z[0] - q.posicion[0], z[1] - q.posicion[1]) < 0.01);
    }
  }
});

test('Laboratorio orbital: retos alcanzables y lecturas sin igualdades redondeadas', () => {
  const inicios = { r: 3, inc: 30, t: 0 };
  for (const reto of mesa.invitaciones) assert.equal(Boolean(reto.logrado(inicios, [])), false);
  const encontrados = new Set();
  for (const r of [2, 3, 4, 6]) for (const inc of [0, 15, 30, 45, 60, 75, 90]) for (let t = 0; t <= 12; t += 0.25) {
    const a = { r, inc, t };
    mesa.invitaciones.forEach((reto, i) => { if (reto.logrado(a, [{ r, inc: inc === 0 ? 90 : 0, t: 0 }])) encontrados.add(i); });
  }
  assert.equal(encontrados.size, mesa.invitaciones.length);
  assert.match(JSON.stringify(mesa.lectura(inicios)), /T ≈/);
  assert.match(JSON.stringify(mesa.lectura(inicios)), /v ≈/);
});
