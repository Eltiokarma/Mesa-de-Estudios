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
// 6. Medidores (0.2.0): ideales y bien puestos no se notan; mal puestos, hacen lo que dice
//    el diagnóstico; el real tiende al ideal; conectarlos no toca el circuito original.

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
// Un valor esperado puede ser un número o, en las lecturas, "indeterminada" (NaN) o "infinita" (Infinity).
function valor(real, v, que) {
  if (v === 'indeterminada') return assert.ok(Number.isNaN(real), `${que}: se esperaba una lectura indeterminada y dio ${real}`);
  if (v === 'infinita') return assert.equal(real, Infinity, `${que}: se esperaba una lectura infinita`);
  cerca(real, v, que);
}
function comparar(sol, x, circuito, que) {
  if (x.corto) {
    assert.equal(sol.corto, true, `${que}: se esperaba un cortocircuito`);
    assert.equal(sol.ok, false);
    if (x.pilas) assert.deepEqual(sol.pilas, x.pilas, `${que}: pila en corto`);
    for (const id of x.lazoIncluye || []) assert.ok(sol.lazo.includes(id), `${que}: el lazo del corto debía pasar por ${id}`);
    return;
  }
  assert.ok(sol.ok, `${que}: el motor no resolvió el circuito`);
  for (const [id, campos] of Object.entries(x.ramas || {})) {
    assert.ok(sol.ramas[id], `${que}: falta la rama ${id}`);
    for (const [k, v] of Object.entries(campos)) valor(sol.ramas[id][k], v, `${que} · ${id}.${k}`);
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
    if ((r.tipo === 'amperimetro' || r.tipo === 'voltimetro') && Number.isFinite(x.Rint) && x.Rint > 0) {
      cerca(x.P, x.I * x.I * x.Rint, `${que}: P = I²·Rint en ${r.id}`);
      assert.ok(x.P >= 0, `${que}: un medidor real recibe energía, no la entrega`);
    }
  }
  cerca(total, 0, `${que}: la suma de potencias es cero`, 1e-9);
  cerca(entrega, reciben, `${que}: lo que entregan las pilas = lo que reciben las resistencias`);
}

// Efecto de cada medidor: lectura, diagnóstico, ramas que se apagan y error relativo.
function compararEfecto(efecto, x, que) {
  for (const [id, e] of Object.entries(x || {})) {
    assert.ok(efecto[id], `${que}: falta el efecto del medidor ${id}`);
    if (e.lectura !== undefined) valor(efecto[id].lectura, e.lectura, `${que} · lectura de ${id}`);
    if (e.diagnostico) assert.equal(efecto[id].diagnostico, e.diagnostico, `${que} · diagnóstico de ${id}`);
    if (e.apaga) assert.deepEqual(efecto[id].apaga.slice().sort(), e.apaga.slice().sort(), `${que} · se apagan (${id})`);
    if (e.errorRel !== undefined) cerca(efecto[id].errorRel, e.errorRel, `${que} · error relativo de ${id}`);
  }
}
// Casos con medidores: medidoresMixto(colocados, op) o conectarMedidores(circuito, medidores).
function casoMedidores(caso, args, x, que) {
  let circuito, sol, efecto;
  if (caso.helper === 'medidoresMixto') {
    const r = motor.medidoresMixto(args.colocados, args.op);
    circuito = r.circuito; sol = r.sol; efecto = r.efecto;
  } else {
    const base = caso.helper ? motor[caso.helper](args) : caso.circuito;
    circuito = motor.conectarMedidores(base, caso.medidores);
    sol = motor.resolver(circuito);
    efecto = {};
    for (const m of caso.medidores) efecto[m.id] = motor.efectoMedidor(base, circuito, m.id);
  }
  comparar(sol, x, circuito, que);
  compararEfecto(efecto, x.efecto, que);
  if (sol.ok) conserva(circuito, sol, que);
}

// 1. Casos
for (const caso of datos.casos) {
  test(`casos.json: ${caso.nombre}`, () => {
    if (caso.variantes) { caso.variantes.forEach((v, j) => casoMedidores(caso, v.args, v.esperado, `${caso.nombre} [${j + 1}]`)); return; }
    if (caso.helper === 'medidoresMixto' || caso.medidores) return casoMedidores(caso, caso.args, caso.esperado, caso.nombre);
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

// 6. Medidores
// Circuitos de prueba: el mixto en varias versiones, los tres de McDermott y las pilas con r.
function circuitosDePrueba() {
  const out = [];
  for (const fem of [1.5, 6, 9])
    for (const Rv of [0, 12])
      for (const [b1, b2, b3] of [[1, 1, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]])
        out.push([`mixto fem=${fem} Rv=${Rv} ${b1}${b2}${b3}`, motor.mixto({ fem, Rv, b1: !!b1, b2: !!b2, b3: !!b3, R2: 8 })]);
  const m = motor.mcdermott();
  for (const k of ['sola', 'serie', 'paralelo']) out.push([`McDermott ${k}`, m[k]]);
  for (const modo of ['una', 'serie', 'paralelo', 'oposicion']) out.push([`pilas ${modo}`, motor.pilas({ modo, fem1: 9, fem2: 3, r1: 0.5, r2: 1, R: 6 })]);
  return out;
}
const conductoras = c => c.ramas.filter(r => (r.tipo === 'resistencia' || r.tipo === 'pila') && !r.abierta);

test('medidores 1: ideales y bien puestos no se notan (serie en cada rama y lado; paralelo en cada rama)', () => {
  for (const [que, base] of circuitosDePrueba()) {
    const s0 = motor.resolver(base);
    assert.ok(s0.ok, que);
    for (const r of conductoras(base)) {
      const puestos = [['A', { tipo: 'amperimetro', modo: 'serie', rama: r.id, lado: 'a' }, s0.ramas[r.id].I],
        ['A', { tipo: 'amperimetro', modo: 'serie', rama: r.id, lado: 'b' }, s0.ramas[r.id].I],
        ['V', { tipo: 'voltimetro', modo: 'paralelo', rama: r.id }, s0.ramas[r.id].V]];
      for (const [id, m, esperado] of puestos) {
        const con = motor.conectarMedidor(base, Object.assign({ id: 'M' + id }, m)), s = motor.resolver(con);
        const q = `${que}: ${m.tipo} ${m.modo} ${m.lado || ''} en ${r.id}`;
        assert.ok(s.ok, q);
        for (const x of base.ramas) {
          cerca(s.ramas[x.id].I, s0.ramas[x.id].I, `${q} · I de ${x.id}`, 1e-12);
          cerca(s.ramas[x.id].P, s0.ramas[x.id].P, `${q} · P de ${x.id}`, 1e-12);
        }
        cerca(s.ramas['M' + id].lectura, esperado, `${q} · lectura`, 1e-12);
        const ef = motor.efectoMedidor(base, con, 'M' + id);
        assert.equal(ef.diagnostico, 'bien', q);
        conserva(con, s, q);
      }
    }
  }
});

test('medidores 2: amperímetro ideal en paralelo con una resistencia que tenía corriente la pone en corto', () => {
  for (const [que, base] of circuitosDePrueba()) {
    const s0 = motor.resolver(base), pila0 = base.ramas.filter(r => r.tipo === 'pila');
    for (const r of base.ramas.filter(x => x.tipo === 'resistencia' && !x.abierta && x.R > 0 && Math.abs(s0.ramas[x.id].I) > 1e-9)) {
      const con = motor.conectarMedidor(base, { id: 'Am', tipo: 'amperimetro', modo: 'paralelo', rama: r.id }), s = motor.resolver(con);
      const q = `${que}: A en paralelo con ${r.id}`;
      if (s.corto) {
        assert.ok(s.lazo.includes('Am'), q);
        assert.equal(motor.efectoMedidor(base, con, 'Am').diagnostico, 'corto-pila', q);
        continue;
      }
      assert.equal(s.ramas[r.id].I, 0, `${q}: sin corriente`); assert.equal(s.ramas[r.id].V, 0, `${q}: sin voltaje`);
      const entrega = x => pila0.reduce((a, p) => a + x.ramas[p.id].entrega, 0);
      assert.ok(entrega(s) >= entrega(s0) - 1e-12, `${q}: la pila entrega igual o más (la resistencia equivalente no sube)`);
      const ef = motor.efectoMedidor(base, con, 'Am');
      assert.equal(ef.diagnostico, 'corto-elemento', q);
      assert.ok(ef.apaga.includes(r.id), q);
      conserva(con, s, q);
    }
  }
  // Si no queda ninguna resistencia en el lazo de la pila: cortocircuito.
  const s = motor.resolver(motor.conectarMedidor(motor.mcdermott().sola, { id: 'Am', tipo: 'amperimetro', modo: 'paralelo', rama: 'A' }));
  assert.equal(s.corto, true);
});

test('medidores 3: voltímetro ideal en serie deja la rama sin corriente; en la línea principal marca la fem neta', () => {
  for (const [que, base] of circuitosDePrueba()) {
    for (const r of conductoras(base)) {
      const con = motor.conectarMedidor(base, { id: 'V', tipo: 'voltimetro', modo: 'serie', rama: r.id, lado: 'a' }), s = motor.resolver(con);
      assert.equal(s.ramas[r.id].I, 0, `${que}: V en serie con ${r.id}`);
      conserva(con, s, que);
    }
  }
  const lect = (base, rama) => motor.resolver(motor.conectarMedidor(base, { id: 'V', tipo: 'voltimetro', modo: 'serie', rama, lado: 'a' }));
  const sm = lect(motor.mixto({ fem: 6 }), 'B1');
  for (const x of Object.values(sm.ramas)) assert.equal(x.I, 0);
  cerca(sm.ramas.V.lectura, 6, 'mixto: la fem');
  const so = lect(motor.pilas({ modo: 'oposicion', fem1: 9, fem2: 3, R: 12 }), 'B');
  for (const x of Object.values(so.ramas)) assert.equal(x.I, 0);
  cerca(Math.abs(so.ramas.V.lectura), 6, 'pilas en oposición: 9 − 3');
});

test('medidores 4: el ideal es el límite del real (voltímetro con R_V → ∞, amperímetro con r_A → 0)', () => {
  const lec = (id, puesto, Rint) => motor.medidoresMixto({ [id]: Rint === undefined ? { puesto } : { puesto, Rint } }).efecto[id].lectura;
  for (const [puesto, Rvista] of [['B1-p', 9], ['B1-a', 18]]) {
    const ideal = lec('V', puesto);
    let ant = -Infinity;
    for (let k = 1; k <= 8; k++) {
      const RV = 6 * Math.pow(10, k), l = lec('V', puesto, RV);
      assert.ok(l > ant, `${puesto}: crece con R_V = ${RV}`); ant = l;
      assert.ok(l < ideal + 1e-12 && ideal - l <= ideal * Rvista / RV * (1 + 1e-9), `${puesto}: error acotado con R_V = ${RV}`);
    }
    assert.ok(Math.abs(lec('V', puesto, 1e9) - ideal) < 1e-6, `${puesto}: con 1e9 Ω, casi el ideal`);
  }
  const ideal = lec('A', 'B1-a');
  let ant = -Infinity;
  for (let k = 1; k <= 8; k++) {
    const rA = 6 * Math.pow(10, -k), l = lec('A', 'B1-a', rA);
    assert.ok(l > ant, `crece al bajar r_A a ${rA}`); ant = l;
    // Cota de la física (ideal·r_A/R_eq) más el redondeo de I = ΔV/r_A con potenciales de unos 6 V (≈ 1e-15·6/r_A).
    assert.ok(l < ideal && ideal - l <= ideal * rA / 18 + 1e-15 * 6 / rA, `error acotado con r_A = ${rA}`);
  }
  assert.ok(Math.abs(lec('A', 'B1-a', 1e-9) - ideal) < 1e-6);
});

test('medidores 5: conservación y P = I²·Rint en todos los puestos de la escena, ideales y reales', () => {
  for (const puesto of Object.keys(motor.PUESTOS_MIXTO))
    for (const [id, Rint] of [['A', undefined], ['A', 2], ['V', undefined], ['V', 60]]) {
      const r = motor.medidoresMixto({ [id]: Rint === undefined ? { puesto } : { puesto, Rint } });
      if (r.sol.corto) continue;
      conserva(r.circuito, r.sol, `${id} (${Rint}) en ${puesto}`);
    }
});

test('medidores 6: conectar no cambia el circuito recibido, y el orden de la lista no importa', () => {
  const base = motor.mixto(), copia = JSON.parse(JSON.stringify(base));
  const lista = [{ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1', lado: 'a' }, { id: 'V', tipo: 'voltimetro', modo: 'paralelo', rama: 'B1' },
    { id: 'A2', tipo: 'amperimetro', modo: 'serie', rama: 'B1', lado: 'b', Rint: 1 }, { id: 'V2', tipo: 'voltimetro', modo: 'paralelo', entre: ['y', 'z'], Rint: 100 }];
  const c1 = motor.conectarMedidores(base, lista);
  assert.deepEqual(base, copia, 'el circuito original no cambia');
  motor.conectarMedidor(base, lista[0]);
  assert.deepEqual(base, copia);
  for (const orden of [[3, 2, 1, 0], [1, 3, 0, 2], [2, 0, 3, 1]]) assert.deepEqual(motor.conectarMedidores(base, orden.map(i => lista[i])), c1);
  // El voltímetro «en paralelo con B1» queda en los bornes de B1, dentro de los amperímetros en serie.
  const s = motor.resolver(c1);
  cerca(s.ramas.V.lectura, s.ramas.B1.V, 'en los bornes de B1');
});

test('medidores 7: cada puesto de la escena se resuelve con cada medidor; ninguno da lectura indeterminada', () => {
  const puestos = Object.keys(motor.PUESTOS_MIXTO);
  assert.equal(puestos.length, 10);
  for (const puesto of puestos)
    for (const id of ['A', 'V']) {
      const r = motor.medidoresMixto({ [id]: { puesto } });
      if (r.sol.corto) { assert.ok(id === 'A' && puesto === 'pila-p', `solo el amperímetro ideal en paralelo con la pila da corto (${id} en ${puesto})`); continue; }
      assert.ok(!r.sol.avisos.some(a => a.tipo === 'lectura-indeterminada' || a.tipo === 'nodo-flotante'), `${id} en ${puesto}`);
      assert.ok(Number.isFinite(r.efecto[id].lectura), `${id} en ${puesto}`);
    }
  // Y con los dos medidores a la vez, en todos los pares de puestos distintos.
  for (const pa of puestos) for (const pv of puestos) {
    if (pa === pv) continue;
    const r = motor.medidoresMixto({ A: { puesto: pa }, V: { puesto: pv } });
    if (r.sol.corto) { assert.equal(pa, 'pila-p'); continue; }
    assert.ok(!r.sol.avisos.some(a => a.tipo === 'lectura-indeterminada'), `${pa} y ${pv}`);
  }
});

test('medidores 8: bien puestos en la escena, todas las lecturas son positivas (puestos orientados)', () => {
  const bien = { A: ['B1-a', 'B1-b', 'B2-a', 'B2-b', 'B3-a', 'B3-b', 'ret'], V: ['B1-p', 'G-p', 'pila-p'] };
  for (const [id, ps] of Object.entries(bien))
    for (const puesto of ps)
      for (const Rint of id === 'A' ? [undefined, 2] : [undefined, 60]) {
        const e = motor.medidoresMixto({ [id]: Rint === undefined ? { puesto } : { puesto, Rint } }).efecto[id];
        assert.ok(e.lectura > 0, `${id} en ${puesto}: ${e.lectura}`);
        if (Rint === undefined) assert.equal(e.diagnostico, 'bien', `${id} en ${puesto}`);
      }
  // Y los mal puestos también marcan en positivo.
  for (const [id, puesto] of [['A', 'B1-p'], ['A', 'G-p'], ['V', 'B1-a'], ['V', 'B2-a'], ['V', 'ret']])
    assert.ok(motor.medidoresMixto({ [id]: { puesto } }).efecto[id].lectura > 0, `${id} en ${puesto}`);
});

test('medidores 9: prediccionesMedidores coincide con los casos y trae los números de cada error', () => {
  const p = motor.prediccionesMedidores();
  const caso = n => datos.casos.find(c => c.nombre.startsWith(n + '.')).esperado;
  cerca(p.M0.correcta.lectura, caso(10).efecto.A.lectura * 2, 'M0 = 1/3 A');
  cerca(p.M1.correcta.lectura, caso(10).efecto.A.lectura, 'M1 = 1/6 A');
  cerca(p.M2.correcta.lectura, caso(11).efecto.A.lectura, 'M2 = 1 A');
  cerca(p.M2.correcta.P2, caso(11).ramas.B2.P, 'M2: B2 con 3 W');
  cerca(p.M2.correcta.P1, 0, 'M2: B1 apagada');
  cerca(p.M1.errores.b.lectura, caso(12).efecto.A.lectura, 'M1 b = 0,5 A');
  assert.equal(p.M2.pilaEnCorto, true);
  cerca(p.M3.correcta.lectura, caso(15).efecto.V.lectura, 'M3 = 6 V');
  cerca(p.M3.enB2, caso(16).efecto.V.lectura, 'M3, pista: 3 V en B2');
  cerca(p.M4.correcta.lectura, caso(17).efecto.V.lectura, 'M4 = 15/4 V');
  cerca(p.M4.correcta.errorRel, caso(17).efecto.V.errorRel, 'M4: −1/16');
  cerca(p.M0.errores.b.lectura, 0.2, 'M0 b: con un amperímetro que consume como una bombilla de 12 Ω, 0,2 A');
  cerca(p.M4.errores.c.lectura, 72 / 13, 'M4 c: 12 + 60 Ω en serie');
  cerca(p.M4.errores.d.lectura, 2, 'M4 d: mitades');
  cerca(p.M4.tablaRV[1].lectura, datos.casos.find(c => c.nombre.startsWith('19.')).variantes[0].esperado.ramas.V.lectura, 'M4: tabla con 600 Ω');
  for (const [k, m] of Object.entries(p)) {
    assert.ok(m.problema && m.ok && m.correcta, k);
    const letras = ['a', 'b', 'c', 'd'].filter(l => l !== m.ok);
    assert.deepEqual(Object.keys(m.errores).sort(), letras, `${k}: cada opción incorrecta trae su número`);
    for (const e of Object.values(m.errores)) assert.ok(Object.values(e).some(v => typeof v === 'number'), `${k}: errores con número`);
  }
});

test('medidores 10: errores de entrada', () => {
  const base = motor.mixto();
  const mal = m => assert.throws(() => motor.conectarMedidor(base, m), undefined, JSON.stringify(m));
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B9', lado: 'a' });          // rama que no existe
  mal({ id: 'V', tipo: 'voltimetro', modo: 'paralelo', entre: ['y', 'q'] });            // nodo que no existe
  mal({ id: 'X', tipo: 'resistencia', modo: 'serie', rama: 'B1' });                      // no es un medidor
  mal({ id: 'A', tipo: 'amperimetro', modo: 'cruzado', rama: 'B1' });                    // modo inválido
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1', lado: 'c' });           // lado inválido
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie' });                                  // serie sin rama
  mal({ id: 'V', tipo: 'voltimetro', modo: 'paralelo' });                                // paralelo sin rama ni entre
  mal({ id: 'B1', tipo: 'amperimetro', modo: 'serie', rama: 'B2' });                     // id repetido
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1', Rint: -1 });            // Rint negativa
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1', Rint: NaN });           // Rint NaN
  mal({ id: 'V', tipo: 'voltimetro', modo: 'paralelo', rama: 'B1', Rint: 0 });           // voltímetro con 0
  mal({ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1', Rint: Infinity });      // amperímetro con ∞
  assert.throws(() => motor.conectarMedidores(base, [{ id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'B1' }, { id: 'A', tipo: 'voltimetro', modo: 'paralelo', rama: 'B2' }]));
  assert.throws(() => motor.medidoresMixto({ A: { puesto: 'B7-z' } }));                  // puesto desconocido
  assert.throws(() => motor.medidoresMixto({ A: { puesto: 'B1-p' }, V: { puesto: 'B1-p' } }));  // dos en el mismo puesto
  assert.throws(() => motor.medidoresMixto({ W: { puesto: 'B1-p' } }));                  // medidor desconocido
  // Y en resolver, directamente:
  assert.throws(() => motor.resolver({ ramas: [{ id: 'V', tipo: 'voltimetro', a: 'a', b: 'b', Rint: 0 }] }));
  assert.throws(() => motor.resolver({ ramas: [{ id: 'A', tipo: 'amperimetro', a: 'a', b: 'b', Rint: Infinity }] }));
  // Un medidor sobre una rama abierta sí se permite: el voltímetro en el portalámparas vacío marca 6 V (C8).
  const r = motor.resolver(motor.conectarMedidor(motor.mixto({ b1: false }), { id: 'V', tipo: 'voltimetro', modo: 'paralelo', rama: 'B1' }));
  cerca(r.ramas.V.lectura, 6, 'portalámparas vacío');
});

test('avisos nuevos: amperímetro ideal en paralelo con un cable y nodo entre dos voltímetros', () => {
  // El error de 0.1.0: marcaba 1/6 A (la mitad de 1/3, por el reparto en partes iguales) sin avisar.
  const c = motor.conectarMedidor(motor.mixto(), { id: 'A', tipo: 'amperimetro', modo: 'paralelo', rama: 'retorno' });
  const s = motor.resolver(c);
  assert.ok(s.avisos.some(a => a.tipo === 'lectura-indeterminada' && a.rama === 'A'));
  assert.ok(Number.isNaN(s.ramas.A.lectura));
  // Dos voltímetros ideales en serie entre los bornes de una bombilla: el nodo del medio flota.
  const d = { tierra: 'n', ramas: [{ id: 'p', tipo: 'pila', a: 'n', b: 'q', fem: 6 }, { id: 'R', tipo: 'resistencia', a: 'q', b: 'n', R: 3 },
    { id: 'V1', tipo: 'voltimetro', a: 'q', b: 'm' }, { id: 'V2', tipo: 'voltimetro', a: 'm', b: 'n' }] };
  const sd = motor.resolver(d);
  assert.ok(sd.avisos.some(a => a.tipo === 'nodo-flotante' && a.nodo === 'm'));
  assert.ok(Number.isNaN(sd.ramas.V1.lectura) && Number.isNaN(sd.ramas.V2.lectura));
  cerca(sd.ramas.R.V, 6, 'el resto del circuito sí se resuelve');
  // Un amperímetro ideal en serie con un cable no tiene problema: no hay otro camino.
  const e = motor.resolver(motor.conectarMedidor(motor.mixto(), { id: 'A', tipo: 'amperimetro', modo: 'serie', rama: 'retorno', lado: 'a' }));
  assert.ok(!e.avisos.some(a => a.tipo === 'lectura-indeterminada'));
  cerca(e.ramas.A.lectura, 1 / 3, 'en el cable de regreso');
});

// 5. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
const tambienDe = v => (v.tambien ? [].concat(v.tambien) : []);
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
    for (const v of [p.verificar].concat(tambienDe(p.verificar))) {
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
        const antes = motor.resolver(tambienDe(p.verificar)[0].circuito).ramas[ch.rama].P;
        cerca(antes, ch.antes, `${p.id}: potencia antes`);
        cerca((sol.ramas[ch.rama].P - antes) / antes * 100, ch.porcentaje, `${p.id}: cambio en %`);
      }
    }
  });
}
