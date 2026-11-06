// Pruebas del motor de Calorimetría y cambios de fase. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Conservación: en toda mezcla, la suma de los calores es cero y la masa de agua no cambia.
// 3. Lo que la escena enseña también vale en el motor: durante la fusión entra calor y la
//    temperatura no cambia (Q7); la temperatura de ebullición no depende de la cantidad (Q4);
//    el metal saca más calor de la mano que la madera, aunque estén a la misma temperatura (Q1).
// 4. Errores de entrada: fase imposible, fase que falta en 0 °C, id repetido.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = 1e-9;

function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)),
    `${que}: el motor da ${real}, se esperaba ${esperado}`);
}

// Compara un equilibrio con lo esperado (T, fases totales, meseta, intercambiado y datos por cuerpo).
function comparar(sol, x, que) {
  for (const k of ['T', 'hielo', 'liquido', 'vapor', 'intercambiado']) if (x[k] !== undefined) cerca(sol[k], x[k], `${que} · ${k}`);
  if (x.meseta !== undefined) assert.equal(sol.meseta, x.meseta, `${que} · meseta`);
  for (const [id, campos] of Object.entries(x.cuerpos || {})) {
    assert.ok(sol.cuerpos[id], `${que}: falta el cuerpo ${id}`);
    for (const [k, v] of Object.entries(campos)) cerca(sol.cuerpos[id][k], v, `${que} · ${id}.${k}`);
  }
}

// Conservación: los calores suman cero y la masa de agua se mantiene.
function conserva(cuerpos, sol, que) {
  const Q = Object.values(sol.cuerpos).reduce((s, c) => s + c.Q, 0);
  cerca(Q, 0, `${que}: suma de calores`, 1e-9);
  const M = cuerpos.filter(b => b.sustancia === 'agua').reduce((s, b) => s + b.m, 0);
  cerca(sol.hielo + sol.liquido + sol.vapor, M, `${que}: masa de agua`);
  for (const b of cuerpos) if (b.sustancia === 'agua') {
    const c = sol.cuerpos[b.id];
    for (const f of ['hielo', 'liquido', 'vapor']) assert.ok(c[f] >= -1e-9, `${que}: ${b.id}.${f} negativo`);
  }
}

// 1. casos.json
for (const caso of datos.casos) {
  test(caso.nombre, () => {
    if (caso.cuerpos) {
      const sol = motor.equilibrio(caso.cuerpos, caso.k);
      comparar(sol, caso.esperado, caso.nombre);
      conserva(caso.cuerpos, sol, caso.nombre);
      if (caso.calorHasta0) {
        const h = caso.cuerpos.find(b => b.id === caso.calorHasta0.cuerpo);
        cerca(motor.calorNecesario(h, caso.calorHasta0.T, caso.calorHasta0.fase), caso.calorHasta0.Q, 'calor para llegar a agua a 0 °C');
      }
      return;
    }
    const tol = caso.tolerancia;
    switch (caso.helper) {
      case 'agregarCalor': comparar(motor.agregarCalor(...caso.args), caso.esperado, caso.nombre); break;
      case 'calorNecesario': cerca(motor.calorNecesario(...caso.args), caso.esperado, caso.nombre); break;
      case 'tramos': {
        const t = motor.tramos(...caso.args);
        assert.equal(t.length, caso.esperado.length, 'número de tramos');
        caso.esperado.forEach((e, j) => {
          assert.equal(t[j].tipo, e.tipo); assert.equal(t[j].fase, e.fase);
          cerca(t[j].desde, e.desde, `tramo ${j} desde`); cerca(t[j].hasta, e.hasta, `tramo ${j} hasta`); cerca(t[j].Q, e.Q, `tramo ${j} Q`);
        });
        break;
      }
      case 'ebullicion':
        for (const p of caso.puntos) {
          const r = motor.ebullicion(p.altitud);
          cerca(r.T, p.T, `ebullición a ${p.altitud} m`, tol); cerca(r.P, p.P, `presión a ${p.altitud} m`, tol);
        }
        break;
      case 'contacto':
        for (const p of caso.puntos)
          cerca(motor.contacto(34, motor.EFUSIVIDAD.piel, p.T, motor.EFUSIVIDAD[p.material]), p.contacto, `${p.material} a ${p.T} °C`);
        break;
      default: assert.fail(`helper desconocido ${caso.helper}`);
    }
  });
}

// 2 y 3. Lo que enseña la escena
test('Q7: durante la fusión entra calor y la temperatura no cambia', () => {
  const h = { id: 'h', sustancia: 'agua', m: 100, T: -20 };
  // Calentar el hielo a 0 °C cuesta 1000 cal; fundirlo, 8000 más.
  for (const Q of [1000, 3000, 5000, 9000]) cerca(motor.agregarCalor(h, Q).T, 0, `T con ${Q} cal`);
  cerca(motor.agregarCalor(h, 5000).liquido, 50, 'a mitad de la fusión hay 50 g de agua');
  assert.ok(motor.agregarCalor(h, 9100).T > 0, 'pasada la meseta, la temperatura sube');
  // Curva: rampa, meseta, rampa.
  const c = motor.curva(h, 12000);
  assert.deepEqual(c.map(p => p[0]), [0, 1000, 9000, 12000]);
  assert.deepEqual(c.map(p => p[1]), [-20, 0, 0, 30]);
});

test('Q9: mientras hierve, la temperatura no sube', () => {
  const a = { id: 'a', sustancia: 'agua', m: 100, T: 20 };
  for (const Q of [8000, 20000, 50000, 62000]) cerca(motor.agregarCalor(a, Q).T, 100, `T con ${Q} cal`);
  cerca(motor.agregarCalor(a, 35000).vapor, 50, 'a mitad de la ebullición hay 50 g de vapor');
});

test('Q4: la temperatura de equilibrio no depende de la cantidad cuando todo está igual de caliente', () => {
  for (const m of [100, 200, 1000]) {
    const s = motor.equilibrio([{ id: 'a', sustancia: 'agua', m, T: 60 }, { id: 'b', sustancia: 'agua', m: 2 * m, T: 60 }]);
    cerca(s.T, 60, `con ${m} g`);
  }
  // La cantidad sí cambia el calor: el doble de agua pide el doble para llegar a hervir.
  const q1 = motor.calorNecesario({ id: 'a', sustancia: 'agua', m: 100, T: 20 }, 100, 'liquido');
  const q2 = motor.calorNecesario({ id: 'a', sustancia: 'agua', m: 200, T: 20 }, 100, 'liquido');
  cerca(q2, 2 * q1, 'doble de agua, doble de calor');
});

test('Q1 y Q2: a la misma temperatura, el aluminio saca más calor de la mano que la madera; a 43 °C, da más', () => {
  const E = motor.EFUSIVIDAD;
  const fAl = motor.flujoDesdeMano(34, 20, E.aluminio), fMa = motor.flujoDesdeMano(34, 20, E.madera), fLa = motor.flujoDesdeMano(34, 20, E.lana);
  assert.ok(fAl > fMa && fMa > fLa && fLa > 0, 'a 20 °C el calor sale de la mano, más hacia el aluminio');
  assert.ok(motor.flujoDesdeMano(34, 43, E.aluminio) < motor.flujoDesdeMano(34, 43, E.madera), 'a 43 °C el aluminio da más calor a la mano');
  assert.ok(motor.contacto(34, E.piel, 43, E.aluminio) > motor.contacto(34, E.piel, 43, E.madera), 'y se siente más caliente');
});

test('la ebullición baja con la altura y no depende de la masa', () => {
  let prev = Infinity;
  for (const h of [0, 1000, 2335, 3400, 3825, 4500]) { const T = motor.ebullicion(h).T; assert.ok(T < prev); prev = T; }
});

test('tramos al revés: enfriar vapor hasta hielo', () => {
  const v = { id: 'v', sustancia: 'agua', m: 10, T: 120 };
  const t = motor.tramos(v, { T: -10 });
  assert.deepEqual(t.map(x => x.nombre), ['enfriar el vapor', 'condensar', 'enfriar el agua', 'congelar', 'enfriar el hielo']);
  cerca(t.reduce((s, x) => s + x.Q, 0), motor.calorNecesario(v, -10), 'la suma de tramos es el calor total');
  assert.ok(t.every(x => x.Q < 0), 'todos ceden calor');
});

test('mezclas al azar: el calor se conserva y la temperatura final queda entre la menor y la mayor', () => {
  let s = 7;
  const azar = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let n = 0; n < 300; n++) {
    const cuerpos = [];
    const q = 1 + Math.floor(azar() * 4);
    for (let j = 0; j < q; j++) {
      const T = Math.round(azar() * 300 - 100);
      if (azar() < 0.75) cuerpos.push({ id: 'b' + j, sustancia: 'agua', m: 1 + Math.round(azar() * 300), T, fase: T === 0 ? 'hielo' : T === 100 ? 'vapor' : undefined });
      else cuerpos.push({ id: 'b' + j, m: 1 + Math.round(azar() * 500), c: 0.05 + azar(), T });
    }
    const sol = motor.equilibrio(cuerpos);
    conserva(cuerpos, sol, `mezcla ${n}`);
    const Ts = cuerpos.map(b => b.T);
    assert.ok(sol.T >= Math.min(...Ts) - 1e-9 && sol.T <= Math.max(...Ts) + 1e-9, `mezcla ${n}: T fuera de rango`);
  }
});

test('errores de entrada', () => {
  assert.throws(() => motor.equilibrio([{ id: 'h', sustancia: 'agua', m: 10, T: 0 }]), /fase/);
  assert.throws(() => motor.equilibrio([{ id: 'h', sustancia: 'agua', m: 10, T: 20, fase: 'hielo' }]), /líquida/);
  assert.throws(() => motor.equilibrio([{ id: 'h', sustancia: 'agua', m: 10, T: -5, fase: 'liquido' }]), /hielo/);
  assert.throws(() => motor.equilibrio([{ id: 'a', sustancia: 'agua', m: 10, T: 5 }, { id: 'a', sustancia: 'agua', m: 10, T: 5 }]), /repetido/);
  assert.throws(() => motor.equilibrio([{ id: 'x', m: -1, c: 1, T: 5 }]), /inválid/);
  assert.throws(() => motor.equilibrio([]));
});

// 5. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta y pasos', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
    for (const v of p.verificar) {
      if (v.cuerpos) { const sol = motor.equilibrio(v.cuerpos, v.k); comparar(sol, v.espera, p.id); conserva(v.cuerpos, sol, p.id); }
      else if (v.calor) cerca(motor.calorNecesario(v.calor.cuerpo, v.calor.T, v.calor.fase), v.espera, `${p.id}: calor`);
      else if (v.ebullicion !== undefined) assert.ok(Math.abs(motor.ebullicion(v.ebullicion).T - v.espera) <= v.tolerancia, `${p.id}: ebullición`);
      else assert.fail(`${p.id}: verificación sin tipo`);
    }
  });
}
