// Pruebas del motor de Circuitos de corriente continua. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método,
//    debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Conservación: en cada nodo la suma de corrientes es cero, y la potencia que
//    entregan las pilas es la que reciben las resistencias.
// 3. Lo que la escena enseña también vale en el motor: quitar B3 cambia la corriente
//    en B1 (la idea C4 es falsa), un cable ideal no tiene caída (C9), la corriente
//    es la misma antes y después de cada bombilla en serie (C2).
// 4. Cortocircuito y circuito abierto: se avisan, no se divide entre cero.
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
const armar = c => (c.helper ? motor[c.helper](c.args) : c.circuito);

// Compara una solución con lo esperado: ramas (I, V, P, entrega, interna, bornes, lectura), V de nodos y Req.
function comparar(sol, x, circuito, que) {
  if (x.corto) {
    assert.equal(sol.corto, true, `${que}: se esperaba un cortocircuito`);
    assert.equal(sol.ok, false);
    if (x.pilas) assert.deepEqual(sol.pilas, x.pilas, `${que}: pila en corto`);
    return;
  }
  assert.ok(sol.ok, `${que}: el motor no resolvió el circuito`);
  for (const [id, campos] of Object.entries(x.ramas || {})) {
    assert.ok(sol.ramas[id], `${que}: falta la rama ${id}`);
    for (const [k, v] of Object.entries(campos)) cerca(sol.ramas[id][k], v, `${que} · ${id}.${k}`);
  }
  for (const [n, v] of Object.entries(x.V || {})) cerca(sol.V[n], v, `${que} · potencial de ${n}`);
  if (x.Req !== undefined) {
    const pila = circuito.ramas.find(r => r.tipo === 'pila');
    cerca(motor.resistenciaVista(sol, pila.id), x.Req, `${que} · Req`);
  }
  for (const tipo of x.avisos || []) assert.ok(sol.avisos.some(a => a.tipo === tipo), `${que}: falta el aviso ${tipo}`);
}

// Conservación: ley de nodos y balance de potencia.
function conserva(circuito, sol, que) {
  for (const [n, s] of Object.entries(motor.balanceNodos(circuito, sol))) cerca(s, 0, `${que}: suma de corrientes en el nodo ${n}`, 1e-9);
  let entrega = 0, reciben = 0, total = 0;
  for (const r of circuito.ramas) {
    const x = sol.ramas[r.id];
    total += x.P;
    if (r.tipo === 'pila') { entrega += x.entrega; reciben += x.interna; }
    else reciben += x.P;
    if (r.tipo === 'resistencia' && !r.abierta) cerca(x.P, x.I * x.I * r.R, `${que}: P = I²R en ${r.id}`);
  }
  cerca(total, 0, `${que}: la suma de potencias es cero`, 1e-9);
  cerca(entrega, reciben, `${que}: lo que entregan las pilas = lo que reciben las resistencias`);
}

// 1. Casos
for (const caso of datos.casos) {
  test(`casos.json: ${caso.nombre}`, () => {
    const c = armar(caso);
    if (caso.helper === 'mcdermott') {
      for (const [k, x] of Object.entries(caso.esperado)) {
        const sol = motor.resolver(c[k]);
        comparar(sol, x, c[k], `${caso.nombre} (${k})`);
        conserva(c[k], sol, k);
      }
      return;
    }
    const sol = motor.resolver(c);
    comparar(sol, caso.esperado, c, caso.nombre);
    if (sol.ok) conserva(c, sol, caso.nombre);
  });
}

// 2. Conservación en muchos circuitos
test('conservación: corrientes y potencias en el explorador del circuito mixto', () => {
  for (const fem of [1.5, 6, 9])
    for (const Rv of [0, 3, 12, 36])
      for (const [b1, b2, b3] of [[1, 1, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 0, 0]]) {
        const c = motor.mixto({ fem, Rv, b1: !!b1, b2: !!b2, b3: !!b3, R2: 8, r: 0.5 });
        const sol = motor.resolver(c);
        assert.ok(sol.ok);
        conserva(c, sol, `mixto fem=${fem} Rv=${Rv} ${b1}${b2}${b3}`);
      }
});

test('conservación: pilas en serie, paralelo y oposición (con resistencia interna)', () => {
  for (const modo of ['una', 'serie', 'paralelo', 'oposicion'])
    for (const [r1, r2] of [[0, 0], [0.5, 0.5], [1, 0.25]]) {
      const c = motor.pilas({ modo, fem1: 9, fem2: 3, r1, r2, R: 6 });
      const sol = motor.resolver(c);
      // Dos pilas ideales distintas en paralelo forman un lazo sin resistencia con fem neta: corto.
      if (modo === 'paralelo' && !r1 && !r2) { assert.equal(sol.corto, true); continue; }
      assert.ok(sol.ok, modo);
      conserva(c, sol, `${modo} r=${r1},${r2}`);
    }
});

test('pilas: en serie se suman, en paralelo (iguales) dan el voltaje de una, en oposición se restan', () => {
  const B = m => motor.resolver(motor.pilas({ modo: m, fem1: 6, fem2: 6, R: 12 })).ramas.B;
  cerca(B('una').V, 6, 'una pila');
  cerca(B('serie').V, 12, 'serie');
  cerca(B('paralelo').V, 6, 'paralelo');
  cerca(B('paralelo').P, B('una').P, 'en paralelo brilla igual que con una');
  cerca(B('oposicion').I, 0, 'iguales en oposición: no pasa corriente');
  const op = motor.resolver(motor.pilas({ modo: 'oposicion', fem1: 9, fem2: 3, R: 12 }));
  cerca(op.ramas.B.V, 6, 'distintas en oposición: fem neta 9 − 3');
  cerca(op.ramas.B.I, 0.5, 'y sí pasa corriente');
});

test('pilas ideales iguales en paralelo: cada una da la mitad (reparto supuesto, con aviso)', () => {
  const sol = motor.resolver(motor.pilas({ modo: 'paralelo', fem1: 6, fem2: 6, R: 12 }));
  cerca(sol.ramas.P1.I, 0.25, 'P1'); cerca(sol.ramas.P2.I, 0.25, 'P2');
  assert.ok(sol.avisos.some(a => a.tipo === 'reparto-supuesto'));
});

// 3. Lo que enseña la escena
test('C4 es falsa: quitar B3 cambia también la corriente en B1, que está "antes"', () => {
  const con = motor.resolver(motor.mixto()), sin = motor.resolver(motor.mixto({ b3: false }));
  assert.ok(sin.ramas.B1.I < con.ramas.B1.I - 0.05, 'la corriente en B1 baja');
  cerca(sin.ramas.B1.P / con.ramas.B1.P, 9 / 16, 'B1 baja a 9/16 de su potencia');
  cerca(sin.ramas.B2.P / con.ramas.B2.P, 9 / 4, 'B2 sube a 9/4');
  cerca(sin.ramas.pila.I, 0.25, 'la pila no da corriente fija (C1): baja de 1/3 A a 1/4 A');
});

test('reóstato entre B1 y el paralelo: al subirlo bajan juntas las bombillas de los dos lados', () => {
  let ant = motor.resolver(motor.mixto({ Rv: 0 }));
  for (const Rv of [2, 6, 12, 24, 36]) {
    const s = motor.resolver(motor.mixto({ Rv }));
    assert.ok(s.ramas.B1.P < ant.ramas.B1.P, `B1 baja con Rv=${Rv}`);
    assert.ok(s.ramas.B2.P < ant.ramas.B2.P, `B2 baja con Rv=${Rv}`);
    ant = s;
  }
});

test('C9: un cable ideal tiene caída cero, y un reóstato en 0 Ω es un cable', () => {
  for (const op of [{}, { b3: false }, { Rv: 0, fem: 9 }, { r: 1 }]) {
    const s = motor.resolver(motor.mixto(op));
    assert.equal(s.ramas.retorno.V, 0, 'retorno');
    assert.equal(s.ramas.Rv.V, 0, 'reóstato en 0 Ω');
    assert.equal(s.V.z, s.V.n);
  }
});

test('C2: la corriente es la misma a la entrada y a la salida de cada bombilla en serie', () => {
  const c = motor.mcdermott().serie, s = motor.resolver(c);
  cerca(s.ramas.B.I, s.ramas.C.I, 'B y C');
  cerca(s.ramas.pila.I, s.ramas.B.I, 'pila y B');
  cerca(s.ramas.B.P, s.ramas.C.P, 'brillan igual');
});

test('McDermott: la sola brilla igual que las de paralelo y más que las de serie', () => {
  const m = motor.mcdermott({ fem: 6, R: 12 });
  const P = k => motor.resolver(m[k]).ramas;
  cerca(P('sola').A.P, P('paralelo').D.P, 'sola = paralelo');
  assert.ok(P('serie').B.P < P('sola').A.P);
  cerca(P('serie').B.P * 4, P('sola').A.P, 'cada una en serie, la cuarta parte');
});

test('C8: el portalámparas vacío tiene voltaje aunque no pase corriente', () => {
  const s = motor.resolver(motor.mixto({ b1: false }));
  cerca(s.ramas.pila.I, 0, 'circuito abierto: no pasa corriente');
  for (const id of ['B2', 'B3', 'retorno']) assert.equal(s.ramas[id].I, 0, id);
  cerca(s.ramas.B1.V, 6, 'entre los extremos de B1 quitada hay 6 V');
  cerca(s.ramas.pila.bornes, 6, 'la pila sigue teniendo 6 V (C7)');
});

// 4. Cortos
test('cortocircuito: la pila ideal en corto se avisa sin dividir entre cero', () => {
  const c = { ramas: [
    { id: 'pila', tipo: 'pila', a: 'n', b: 'p', fem: 6 },
    { id: 'B1', tipo: 'resistencia', a: 'p', b: 'm', R: 12 },
    { id: 'B2', tipo: 'resistencia', a: 'm', b: 'n', R: 12 },
    { id: 'k', tipo: 'interruptor', a: 'p', b: 'n', cerrado: true } ] };
  const s = motor.resolver(c);
  assert.equal(s.corto, true);
  assert.deepEqual(s.pilas, ['pila']);
  assert.ok(s.lazo.includes('k') && s.lazo.includes('pila'));
  c.ramas[3].cerrado = false;
  const s2 = motor.resolver(c);
  assert.ok(s2.ok && !s2.corto);
  cerca(s2.ramas.pila.I, 0.25, 'con el interruptor abierto, circuito normal');
});

test('pila con resistencia interna en corto: corriente finita ε/r, con aviso', () => {
  const s = motor.resolver({ ramas: [{ id: 'p', tipo: 'pila', a: 'n', b: 'm', fem: 6, r: 2 }, { id: 'c', tipo: 'cable', a: 'm', b: 'n' }] });
  assert.ok(s.ok);
  cerca(s.ramas.p.I, 3, 'I = ε/r');
  cerca(s.ramas.p.bornes, 0, 'sin voltaje en los bornes');
  assert.ok(s.avisos.some(a => a.tipo === 'pila-en-corto'));
});

test('dos pilas ideales distintas en paralelo también son un corto', () => {
  const s = motor.resolver(motor.pilas({ modo: 'paralelo', fem1: 6, fem2: 3, R: 12 }));
  assert.equal(s.corto, true);
  assert.deepEqual(s.pilas.sort(), ['P1', 'P2']);
});

test('dos cables en paralelo no son un corto: reparten la corriente', () => {
  const c = { ramas: [
    { id: 'p', tipo: 'pila', a: 'n', b: 'q', fem: 6 }, { id: 'B', tipo: 'resistencia', a: 'q', b: 'm', R: 3 },
    { id: 'c1', tipo: 'cable', a: 'm', b: 'n' }, { id: 'c2', tipo: 'cable', a: 'm', b: 'n' } ] };
  const s = motor.resolver(c);
  assert.ok(s.ok);
  cerca(s.ramas.c1.I + s.ramas.c2.I, 2, 'entre los dos llevan los 2 A');
  conserva(c, s, 'cables en paralelo');
});

test('voltímetro ideal: no deja pasar corriente; amperímetro ideal: no cambia el circuito', () => {
  const base = { ramas: [{ id: 'p', tipo: 'pila', a: 'n', b: 'q', fem: 6 }, { id: 'R', tipo: 'resistencia', a: 'q', b: 'n', R: 3 }] };
  const conV = { ramas: base.ramas.concat([{ id: 'V', tipo: 'voltimetro', a: 'q', b: 'n' }]) };
  const s = motor.resolver(conV);
  cerca(s.ramas.V.lectura, 6, 'lectura'); assert.equal(s.ramas.V.I, 0);
  const conA = { ramas: [{ id: 'p', tipo: 'pila', a: 'n', b: 'q', fem: 6 }, { id: 'A', tipo: 'amperimetro', a: 'q', b: 'w' }, { id: 'R', tipo: 'resistencia', a: 'w', b: 'n', R: 3 }] };
  cerca(motor.resolver(conA).ramas.A.lectura, 2, 'amperímetro en serie');
  // Amperímetro en paralelo con la pila: corto (C15).
  const mal = { ramas: base.ramas.concat([{ id: 'A', tipo: 'amperimetro', a: 'q', b: 'n' }]) };
  assert.equal(motor.resolver(mal).corto, true, 'amperímetro en paralelo con la pila');
});

test('errores de entrada: tipo desconocido, resistencia negativa, id repetido', () => {
  assert.throws(() => motor.resolver({ ramas: [{ id: 'x', tipo: 'diodo', a: 'a', b: 'b' }] }));
  assert.throws(() => motor.resolver({ ramas: [{ id: 'x', tipo: 'resistencia', a: 'a', b: 'b', R: -1 }] }));
  assert.throws(() => motor.resolver({ ramas: [{ id: 'x', tipo: 'cable', a: 'a', b: 'b' }, { id: 'x', tipo: 'cable', a: 'a', b: 'b' }] }));
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
    assert.ok(p.verificar && p.verificar.circuito && p.verificar.espera, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
    for (const v of [p.verificar, p.verificar.tambien].filter(Boolean)) {
      const sol = motor.resolver(v.circuito);
      comparar(sol, v.espera, v.circuito, p.id);
      conserva(v.circuito, sol, p.id);
      const e = v.espera.energia;
      if (e) {
        const kWh = sol.ramas[e.rama].P / 1000 * e.horas * e.dias;
        cerca(kWh, e.kWh, `${p.id}: energía en kWh`);
        cerca(kWh * e.tarifa, e.costo, `${p.id}: costo en soles`);
      }
      const ch = v.espera.cambio;
      if (ch) {
        const antes = motor.resolver(p.verificar.tambien.circuito).ramas[ch.rama].P;
        cerca(antes, ch.antes, `${p.id}: potencia antes`);
        cerca((sol.ramas[ch.rama].P - antes) / antes * 100, ch.porcentaje, `${p.id}: cambio en %`);
      }
    }
  });
}
