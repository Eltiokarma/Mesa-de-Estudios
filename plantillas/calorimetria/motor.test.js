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
// 6. (0.2.0) Dilatación y transferencia: casos 16 a 39 con 'fn', propiedades de cada función nueva y
//    distractores de cada predicción, que salen de `errores` y son distintos de la correcta.

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

// Casos con 'fn' (0.2.0): compara cada campo de 'espera' (con punto para lo anidado) o el valor suelto.
function campo(obj, ruta) { return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
function igual(real, esperado, que, tol) {
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => igual(real[k], e, `${que}[${k}]`, tol)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  cerca(real, esperado, que, tol);
}
function comprobar(fn, args, espera, que, tol) {
  assert.equal(typeof motor[fn], 'function', `${que}: el motor no tiene ${fn}`);
  const r = motor[fn](...args);
  if (espera === null || typeof espera !== 'object' || Array.isArray(espera)) { igual(r, espera, `${que} · ${fn}`, tol); return; }
  for (const [k, v] of Object.entries(espera)) igual(campo(r, k), v, `${que} · ${fn} · ${k}`, tol);
}

// 1. casos.json
for (const caso of datos.casos) {
  if (caso.fn) {
    test(caso.nombre, () => {
      comprobar(caso.fn, caso.args, caso.espera, caso.nombre, caso.tolerancia);
      for (const t of caso.tambien || []) comprobar(t.fn || caso.fn, t.args, t.espera, caso.nombre, t.tolerancia !== undefined ? t.tolerancia : caso.tolerancia);
    });
    continue;
  }
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
      else if (v.fn) comprobar(v.fn, v.args, v.espera, p.id, v.tolerancia);
      else assert.fail(`${p.id}: verificación sin tipo`);
    }
  });
}

// ================= 6. Propiedades de lo nuevo (0.2.0) =================
function azarCon(semilla) { let s = semilla; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const MAT = motor.MATERIALES;

test('dilatación: Δ proporcional al inicial y a ΔT; área 2α, volumen 3α; la aproximación está cerca de la exacta', () => {
  const azar = azarCon(7);
  for (let n = 0; n < 300; n++) {
    const inicial = 0.1 + azar() * 100, alfa = 1e-7 + azar() * 3e-5, dT = Math.round(azar() * 400 - 150);
    const [l, a, v] = ['lineal', 'superficial', 'volumetrica'].map(tipo => motor.dilatacion({ tipo, inicial, alfa, dT }));
    cerca(motor.dilatacion({ tipo: 'lineal', inicial: 2 * inicial, alfa, dT }).delta, 2 * l.delta, 'doble de largo, doble de Δ');
    cerca(motor.dilatacion({ tipo: 'lineal', inicial, alfa, dT: 3 * dT }).delta, 3 * l.delta, 'triple de ΔT, triple de Δ');
    cerca(a.delta / inicial, 2 * l.delta / inicial, 'el área, el doble en términos relativos');
    cerca(v.delta / inicial, 3 * l.delta / inicial, 'el volumen, el triple');
    for (const r of [l, a, v]) assert.ok(Math.abs(r.deltaExacta - r.delta) <= inicial * Math.pow(r.n * alfa * dT, 2) + 1e-15, 'exacta y aproximada');
    // El agujero crece igual que un disco del mismo metal, y un anillo crece en área por (1 + αΔT)².
    const h = motor.agujero({ D0: inicial, alfa, dT });
    cerca(h.D, h.disco, 'agujero = disco');
    if (dT > 0) assert.ok(h.D > inicial, 'al calentar, el agujero crece');
    const Dext = inicial * 1.5, anillo = r => Math.PI / 4 * (Math.pow(Dext * r, 2) - Math.pow(inicial * r, 2));
    const f = 1 + alfa * dT;
    cerca(Math.PI / 4 * (Math.pow(Dext * f, 2) - Math.pow(h.D, 2)), anillo(1) * f * f, 'área del anillo por (1 + αΔT)²');
    cerca(anillo(f), anillo(1) * f * f, 'el anillo es la foto ampliada');
  }
});

test('ajuste de la arandela: a la temperatura pedida, el agujero mide justo lo del eje', () => {
  const r = motor.ajusteAnillo({ D0: 5, Dobjetivo: 5.006, alfa: MAT.aluminio.alfa, T0: 20 });
  cerca(r.Dagujero(r.T), 5.006, 'agujero a T');
  cerca(r.Dagujero(20), 5, 'agujero a T0');
});

test('tira bimetálica: el signo, la tira pareja y la que más se estira por fuera', () => {
  const azar = azarCon(11);
  for (let n = 0; n < 200; n++) {
    const alfaA = azar() * 3e-5, alfaB = azar() * 3e-5, ell = 0.02 + azar() * 0.2, espesor = 1e-4 + azar() * 2e-3;
    const dT = Math.round(azar() * 300 - 150) || 1;
    const r = motor.bimetalica({ alfaA, alfaB, ell, espesor, dT }), r2 = motor.bimetalica({ alfaA, alfaB, ell, espesor, dT: -dT });
    cerca(r2.kappa, -r.kappa, 'κ cambia de signo con ΔT');
    cerca(r.kappa, 1.5 * (alfaA - alfaB) * dT / espesor, 'κ ∝ Δα·ΔT/espesor');
    if (r.kappa !== 0) {
      const masLarga = (alfaA - alfaB) * dT > 0 ? 'A' : 'B';
      assert.equal(r.convexa, masLarga, 'por fuera queda la que más se estira');
      assert.notEqual(r.haciaLado, r.convexa);
      assert.equal(r.errores['DL4-hacia-mayor-alfa'], r.convexa, 'el error es curvarse hacia la que más se estira');
    }
    const p = r.punto(ell, 1);
    cerca(p.y, r.flecha, 'la punta de la tira está a la flecha');
    cerca(Math.hypot(p.x, p.y), Math.abs(2 * Math.sin(r.theta / 2) / (r.kappa || 1)) || ell, 'la cuerda de un arco');
  }
  const pareja = motor.bimetalica({ alfaA: 1.2e-5, alfaB: 1.2e-5, ell: 0.1, espesor: 0.001, dT: 100 });
  assert.equal(pareja.kappa, 0); assert.equal(pareja.flecha, 0); assert.equal(pareja.convexa, null);
});

test('agua: la densidad sube hasta unos 4 °C y después baja; el hielo flota; el frasco de cuarzo baja y luego sube', () => {
  for (let j = 0; j < 398; j++) assert.ok(motor.densidadAgua((j + 1) / 100) > motor.densidadAgua(j / 100), `sube en ${j / 100}`);
  for (let j = 399; j < 10000; j++) assert.ok(motor.densidadAgua((j + 1) / 100) < motor.densidadAgua(j / 100), `baja en ${j / 100}`);
  assert.ok(Math.abs(motor.TEMPERATURA_MAXIMA_DENSIDAD - 3.983) < 0.01);
  assert.ok(motor.DENSIDAD_HIELO < motor.densidadAgua(0), 'el hielo es menos denso que el agua a 0 °C');
  assert.throws(() => motor.densidadAgua(-1)); assert.throws(() => motor.densidadAgua(101));
  const o = { m: 1000, liquido: 'agua', alfaFrasco: MAT.cuarzo.alfa, T0: 0 };
  const nivel = T => motor.nivelFrasco(Object.assign({ T }, o)).nivel;
  for (let T = 0; T < 3.9; T += 0.1) assert.ok(nivel(T + 0.1) < nivel(T), `el nivel baja en ${T}`);
  for (let T = 4.1; T < 10; T += 0.1) assert.ok(nivel(T + 0.1) > nivel(T), `el nivel sube en ${T}`);
  cerca(nivel(0), 0, 'a 0 °C, en la marca');
  cerca(motor.volumenAgua(1000, motor.densidadIgual(0)), motor.volumenAgua(1000, 0), 'mismo volumen', 1e-12);
});

test('derrame: con γ = 3α no se derrama nada; con γ < 3α el nivel baja', () => {
  const azar = azarCon(13);
  for (let n = 0; n < 100; n++) {
    const V0 = 10 + azar() * 1000, a = 1e-6 + azar() * 3e-5, dT = 1 + azar() * 80;
    cerca(motor.derrame({ V0, gamma: 3 * a, alfaRecipiente: a, dT }).derrame, 0, 'γ = 3α', 1e-12);
    assert.ok(motor.derrame({ V0, gamma: 2 * a, alfaRecipiente: a, dT }).derrame < 0, 'γ < 3α: baja');
    assert.ok(motor.nivelFrasco({ V0, liquido: 'mercurio', alfaFrasco: a, T0: 0, T: dT }).nivel > 0 || 3 * a > motor.LIQUIDOS.mercurio.gamma);
  }
});

test('conducción y capas en serie: proporciones, el mismo flujo en cada capa, caídas y uniones', () => {
  const azar = azarCon(17);
  for (let n = 0; n < 300; n++) {
    const k = 0.02 + azar() * 400, A = 1e-5 + azar() * 2, ell = 0.001 + azar(), T1 = azar() * 200 - 50, T2 = azar() * 200 - 50;
    const c = motor.conduccion({ k, A, ell, T1, T2 });
    cerca(motor.conduccion({ k, A: 2 * A, ell, T1, T2 }).flujo, 2 * c.flujo, 'doble área, doble flujo');
    cerca(motor.conduccion({ k, A, ell: 2 * ell, T1, T2 }).flujo, c.flujo / 2, 'doble largo, mitad');
    cerca(motor.conduccion({ k, A, ell, T1: T2 + 2 * (T1 - T2), T2 }).flujo, 2 * c.flujo, 'doble ΔT, doble flujo');
    const q = 1 + Math.floor(azar() * 4), capas = [];
    for (let j = 0; j < q; j++) capas.push({ k: 0.02 + azar() * 400, ell: 0.001 + azar() * 0.5 });
    const s = motor.serie({ capas, A, T1, T2 });
    capas.forEach((cp, j) => cerca(cp.k * A * s.caidas[j] / cp.ell, s.flujo, `capa ${j}: el mismo flujo`));
    cerca(s.caidas.reduce((x, y) => x + y, 0), T1 - T2, 'las caídas suman ΔT');
    cerca(s.R, s.resistencias.reduce((x, y) => x + y, 0), 'R total = Σ R');
    const temps = [T1, ...s.uniones, T2];
    for (let j = 1; j < temps.length; j++) assert.ok((temps[j] - temps[j - 1]) * (T2 - T1) >= -1e-9, 'uniones en orden, entre T1 y T2');
    cerca(motor.serie({ capas: capas.slice().reverse(), A, T1, T2 }).flujo, s.flujo, 'el orden de las capas no cambia el flujo');
    cerca(s.perfil(0), T1, 'perfil en 0'); cerca(s.perfil(s.bordes[s.bordes.length - 1]), T2, 'perfil al final');
    s.uniones.forEach((u, j) => cerca(s.perfil(s.bordes[j + 1]), u, 'perfil en la unión'));
  }
  // Con la misma k, la unión cae donde dicen los largos.
  const s = motor.serie({ capas: [{ k: 50, ell: 0.1 }, { k: 50, ell: 0.3 }], A: 1e-4, T1: 100, T2: 0 });
  cerca(s.uniones[0], 75, 'k iguales: la temperatura baja parejo');
});

test('enfriamiento de Newton: se acerca al aula sin cruzarla, y la más caliente baja más rápido', () => {
  const azar = azarCon(19);
  for (let n = 0; n < 200; n++) {
    const Tamb = azar() * 30, T0 = Tamb + 1 + azar() * 80, otra = Tamb + 1 + azar() * 80, tau = 1 + azar() * 20;
    let prev = T0;
    for (let j = 1; j <= 40; j++) {
      const t = j * tau / 4;
      const r = motor.enfriamiento({ T0, Tamb, tau, t }), r2 = motor.enfriamiento({ T0: otra, Tamb, tau, t });
      assert.ok(r.T < prev && r.T > Tamb, 'baja sin cruzar el aula'); prev = r.T;
      cerca(r.ritmo, (r.T - Tamb) / tau, 'ritmo ∝ T − Tamb');
      if (T0 > otra) assert.ok(r.ritmo > r2.ritmo, 'la más caliente, más rápido');
    }
    const r0 = motor.enfriamiento({ T0, Tamb, tau, t: 0, otra });
    cerca(r0.errores['Q10-mismo-ritmo'], (otra - Tamb) / tau, 'el error es tomar el ritmo de la otra');
    cerca(motor.enfriamiento({ T0, Tamb, tau, t: motor.tiempoHasta({ T0, Tamb, tau, T: (T0 + Tamb) / 2 }) }).T, (T0 + Tamb) / 2, 'tiempoHasta');
  }
});

test('convección: sin divergencia, sube por el centro, baja por las paredes y no atraviesa los bordes', () => {
  const W = 3, H = 2, h = 1e-5;
  for (let i = 1; i < 20; i++) for (let j = 1; j < 20; j++) {
    const x = W * i / 20, y = H * j / 20;
    const div = (motor.conveccion(x + h, y, W, H).vx - motor.conveccion(x - h, y, W, H).vx) / (2 * h)
      + (motor.conveccion(x, y + h, W, H).vy - motor.conveccion(x, y - h, W, H).vy) / (2 * h);
    assert.ok(Math.abs(div) < 1e-6, `divergencia en (${x}, ${y})`);
  }
  assert.ok(motor.conveccion(W / 2, H / 2, W, H).vy > 0, 'sube por el centro');
  assert.ok(motor.conveccion(0.05 * W, H / 2, W, H).vy < 0 && motor.conveccion(0.95 * W, H / 2, W, H).vy < 0, 'baja junto a las paredes');
  for (let t = 0; t <= 1; t += 0.05) {
    assert.ok(Math.abs(motor.conveccion(0, t * H, W, H).vx) < 1e-12 && Math.abs(motor.conveccion(W, t * H, W, H).vx) < 1e-12, 'paredes');
    assert.ok(Math.abs(motor.conveccion(t * W, 0, W, H).vy) < 1e-12 && Math.abs(motor.conveccion(t * W, H, W, H).vy) < 1e-12, 'fondo y superficie');
  }
});

test('radiación: P ∝ T⁴ en kelvin; el doble de kelvin da 16; la noche nublada pierde menos', () => {
  for (const Tc of [-40, 0, 27, 100, 327, 1000]) {
    const P = motor.radiacion({ e: 0.9, A: 2, Tc }).P;
    cerca(P, 0.9 * motor.SIGMA * 2 * Math.pow(Tc + 273.15, 4), `P a ${Tc} °C`);
  }
  for (const T1 of [27, 50, 100]) cerca(motor.razonRadiacion(T1, 2 * (T1 + 273) - 273).razon, 16, 'doble de kelvin');
  const desp = motor.perdidaNocturna({ Tsuelo: 283, Tcielo: 233 }).perdida, nub = motor.perdidaNocturna({ Tsuelo: 283, Tcielo: 263 }).perdida;
  assert.ok(desp > 0 && nub > 0 && nub < desp, 'pierde menos con nubes');
});

test('hielo sobre placas: aluminio > acero > vidrio > madera > lana; con el aula a 0 °C no pasa calor', () => {
  const orden = ['aluminio', 'acero', 'vidrio', 'madera', 'lana'].map(m => motor.hieloSobre(m, 20).flujo);
  for (let j = 1; j < orden.length; j++) assert.ok(orden[j] < orden[j - 1]);
  for (const m of ['aluminio', 'madera']) assert.equal(motor.hieloSobre(m, 0).flujo, 0);
  assert.ok(motor.hieloSobre('aluminio', 20).Tcontacto > motor.hieloSobre('madera', 20).Tcontacto);
});

// Cada predicción: sus distractores salen de `errores` del motor y no coinciden con la correcta.
test('predicciones: los distractores salen del motor y son distintos de la correcta', () => {
  const dist = (correcta, valores, que) => {
    const vistos = new Set([JSON.stringify(correcta)]);
    for (const v of valores) {
      assert.ok(v !== undefined, `${que}: falta un error en el motor`);
      const k = JSON.stringify(typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);
      assert.ok(!vistos.has(k), `${que}: ${k} repetido o igual a la correcta`); vistos.add(k);
    }
  };
  const h = { id: 'hielo', sustancia: 'agua', m: 50, T: -10 }, a = { id: 'agua', sustancia: 'agua', m: 200, T: 50 };
  const p3 = motor.prediccionMezcla(h, a);
  dist(p3.T, [p3.errores['Q7-olvida-calor-latente'], p3.errores['Q4-promedio-simple'], p3.errores['Q8-no-revisa-si-alcanza']], 'paso 3');
  const mh = motor.prediccionMezcla(Object.assign({}, h, { m: 160 }), a);
  assert.equal(mh.meseta, 'fusion'); assert.ok(mh.hielo > 0);
  dist('0 con hielo', [mh.errores['Q8-no-revisa-si-alcanza'], 'funde-todo-justo', 'sobre-0'], 'echo más hielo');
  assert.ok(mh.errores['Q8-no-revisa-si-alcanza'] < 0, 'la ecuación de siempre da bajo cero');
  const d1 = motor.dilatacion({ inicial: 24, alfa: MAT.acero.alfa, dT: 35, ref: 12 });
  dist(d1.delta, [d1.errores['DL1-no-depende-de-l0'], d1.errores['DL1-cuadrado']], 'D1');
  const d2 = motor.dilatacion({ tipo: 'superficial', inicial: 2000, alfa: MAT.aluminio.alfa, dT: 100, lados: [50, 40] });
  dist(d2.delta, [d2.errores['D2-alfa-para-area'], d2.errores['D2-tres-alfa-para-area'], d2.errores['D2-producto-de-estiramientos']], 'D2');
  const d3 = motor.agujero({ D0: 5, alfa: MAT.aluminio.alfa, dT: 50 });
  dist(d3.D, [d3.errores['Q11-agujero-se-achica'], d3.errores['DL3-no-cambia']], 'D3');
  const d4 = motor.bimetalica({ alfaA: MAT.laton.alfa, alfaB: MAT.acero.alfa, ell: 0.1, espesor: 0.001, dT: 100 });
  dist(d4.haciaLado, [d4.errores['DL4-hacia-mayor-alfa'], 'recta', d4.errores['DL4-depende-del-fuego']], 'D4');
  const fr = o => motor.nivelFrasco(Object.assign({ m: 1000, liquido: 'agua', alfaFrasco: MAT.cuarzo.alfa, T0: 0 }, o));
  assert.ok(fr({ T: 4 }).nivel < 0 && fr({ T: 10 }).nivel > fr({ T: 4 }).nivel, 'D5: baja y luego sube');
  assert.ok(fr({ T: 4 }).errores['DL5-sube-siempre'] > 0 && fr({ T: 4 }).errores['DL5-no-cambia'] === 0, 'D5: los errores dicen otra cosa');
  const t2 = motor.conduccion({ k: 400, A: 2e-4, ell: 1, T1: 100, T2: 0, ref: { ell: 0.5 } });
  dist(t2.flujo, [t2.errores['TC2-mas-largo-mas-calor'], t2.errores['TC2-no-depende-de-l'], t2.errores['TC2-cuadrado']], 'T2');
  const t3 = motor.serie({ capas: [{ k: 400, ell: 0.2 }, { k: 200, ell: 0.2 }], A: 2e-4, T1: 90, T2: 0 });
  dist(t3.uniones[0], [t3.errores['TC3-union-en-el-promedio'], t3.errores['TC3-al-reves'], t3.errores['TC3-toda-la-caida-en-el-peor']], 'T3');
  const t6 = motor.razonRadiacion(27, 327);
  dist(t6.razon, [t6.errores['TR7-lineal-kelvin'], t6.errores['TR7-lineal-celsius'], t6.errores['TR7-cuarta-celsius']], 'T6');
  const tz = motor.enfriamiento({ T0: 90, Tamb: 20, tau: 10, t: 0, otra: 50 });
  dist(90, [tz.errores['TC4-la-tibia-primero'], 'igual', 'ninguna'], 'dos tazas');
  assert.ok(tz.ritmo > tz.errores['Q10-mismo-ritmo'], 'dos tazas: la de 90 °C baja más rápido');
  const hs = motor.hieloSobre('aluminio', 20);
  dist('aluminio', [hs.errores['Q2-madera-primero'], hs.errores['TC1-al-mismo-tiempo']], 'T1');
});
