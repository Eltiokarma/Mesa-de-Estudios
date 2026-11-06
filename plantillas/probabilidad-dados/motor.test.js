// Pruebas del motor de «La tabla de los dos dados». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: cada fórmula de conteo coincide con la enumeración (variaciones, combinaciones,
//    permutaciones circulares y con repetición, comités con restricciones); las fracciones son exactas;
//    la distribución de la suma suma 1 y es simétrica; inclusión-exclusión, complemento, condicional
//    y su relación con la independencia; 'errores' de AR17 y AR20; la simulación con semilla es
//    reproducible y su frecuencia relativa se acerca a la probabilidad con muchos lanzamientos; la
//    animación de la tirada termina en el valor sorteado y plana; después de una racha, el dado no
//    tiene memoria (AR22).
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');
const Azar = require('../../nucleo/azar.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && typeof r === 'number' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`);
  const r = M[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'probabilidad-dados');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = Azar.crear('pruebas-dados');
const fac = n => (n <= 1 ? 1 : n * fac(n - 1));

test('fracciones exactas: se simplifican, el signo va arriba y las cuentas no pasan por decimales', () => {
  assert.deepEqual([M.fraccion(6, 36).num, M.fraccion(6, 36).den], [1, 6]);
  assert.equal(M.fraccion(3, -9).texto, '-1/3');
  assert.equal(M.fraccion(0, 5).texto, '0');
  assert.equal(M.sumar(M.fraccion(1, 6), M.fraccion(1, 6)).texto, '1/3');
  assert.equal(M.restar(1, M.fraccion(25, 36)).texto, '11/36');
  assert.equal(M.multiplicar(M.fraccion(5, 6), M.fraccion(5, 6)).texto, '25/36');
  assert.equal(M.dividir(M.fraccion(1, 18), M.fraccion(5, 36)).texto, '2/5');
  assert.equal(M.comparar(M.fraccion(25, 216), M.fraccion(1, 8)), -1);
  // 0,1 + 0,2 no da 0,3 en coma flotante; con fracciones, sí
  assert.equal(M.sumar(M.fraccion(1, 10), M.fraccion(2, 10)).texto, '3/10');
  for (let k = 0; k < 300; k++) {
    const a = M.fraccion(rnd.entero(-50, 50), rnd.entero(1, 60)), b = M.fraccion(rnd.entero(-50, 50), rnd.entero(1, 60));
    cerca(M.sumar(a, b).valor, a.valor + b.valor, 'suma'); cerca(M.multiplicar(a, b).valor, a.valor * b.valor, 'producto');
    assert.equal(M.restar(M.sumar(a, b), b).texto, a.texto);
  }
});

test('fórmulas = enumeración: V(n, k), nᵏ, C(n, k), n!, (n − 1)! y n!/(a!·b!…)', () => {
  for (let n = 1; n <= 7; n++) {
    const L = 'abcdefg'.slice(0, n).split('');
    for (let k = 0; k <= n; k++) {
      const V = M.enumerarVariaciones(L, k, false), R = M.enumerarVariaciones(L, k, true), C = M.enumerarCombinaciones(L, k);
      assert.equal(V.length, M.variaciones(n, k), `V(${n}, ${k})`);
      assert.equal(new Set(V.map(x => x.join(''))).size, V.length, 'sin repetir listas');
      assert.ok(V.every(x => new Set(x).size === x.length), 'sin repetir elementos');
      assert.equal(R.length, M.variacionesConRepeticion(n, k), `${n}^${k}`);
      assert.equal(C.length, M.combinaciones(n, k), `C(${n}, ${k})`);
      // cada combinación aparece k! veces entre las variaciones (AR17: el orden multiplica por k!)
      assert.equal(M.variaciones(n, k), M.combinaciones(n, k) * fac(k));
      // simetría y Pascal
      assert.equal(M.combinaciones(n, k), M.combinaciones(n, n - k));
      if (k >= 1) assert.equal(M.combinaciones(n, k), M.combinaciones(n - 1, k - 1) + M.combinaciones(n - 1, k));
    }
    assert.equal(M.enumerarPermutaciones(L).length, M.permutaciones(n));
    assert.equal(M.enumerarCirculares(L).length, M.permutacionesCirculares(n), `circular ${n}`);
    // combinaciones con repetición = multiconjuntos de k con n tipos
    for (let k = 1; k <= 3; k++) {
      const multi = new Set(M.enumerarVariaciones(L, k, true).map(x => x.slice().sort().join('')));
      assert.equal(multi.size, M.combinacionesConRepeticion(n, k));
    }
  }
  for (const p of ['PAPAYA', 'CASACA', 'ARROZ', 'MANZANA', 'OSO', 'AAAB']) assert.equal(M.anagramas(p).porEnumeracion, M.anagramas(p).valor, p);
  // fórmula de academia para n!/(a!b!) sin enumerar
  assert.equal(M.permutacionesConRepeticion([3, 2, 1, 1]), fac(7) / (fac(3) * fac(2)));
});

test('principios de multiplicación y de adición; claves y placas', () => {
  assert.equal(M.multiplicacion([3, 4, 2]), 24);
  assert.equal(M.adicion([3, 4, 2]), 9);
  for (let k = 0; k < 50; k++) {
    const n = rnd.entero(2, 10), l = rnd.entero(1, 5);
    const c = M.clave({ simbolos: n, largo: l });
    assert.equal(c.valor, n ** l); assert.equal(c.errores.sinRepeticion, M.variaciones(n, l));
    assert.equal(M.clave({ simbolos: n, largo: l, repetir: false }).valor, M.variaciones(n, l));
  }
  // la placa con un alfabeto chico se puede listar
  const p = M.placa({ letras: 2, digitos: 1, alfabeto: 3 });
  assert.equal(p.valor, M.enumerarVariaciones(['x', 'y', 'z'], 2, true).length * 10);
  assert.equal(p.parciales[p.parciales.length - 1], p.valor);
});

test('comités: fórmula = enumeración, con y sin restricciones; cada comité aparece k! veces entre los órdenes', () => {
  for (let n = 1; n <= 8; n++) for (let k = 1; k <= n; k++) {
    const c = M.comite({ n, k });
    assert.equal(c.valor, c.porEnumeracion); assert.equal(c.ordenes, c.valor * fac(k));
    const por = Array(c.valor).fill(0); for (const o of c.listaOrdenes) { assert.ok(o.comite >= 0); por[o.comite]++; }
    assert.ok(por.every(x => x === fac(k)), 'k! órdenes por comité');
  }
  for (let t = 0; t < 60; t++) {
    const m = rnd.entero(0, 7), h = rnd.entero(0, 7); if (m + h < 1) continue;
    const k = rnd.entero(1, Math.min(5, m + h)), x = rnd.entero(0, k);
    const g = [{ nombre: 'mujeres', n: m }, { nombre: 'hombres', n: h }];
    for (const condicion of [{ grupo: 'mujeres', exactos: x }, { grupo: 'mujeres', alMenos: x }, { grupo: 'hombres', alMas: x }, undefined]) {
      const r = M.comiteConGrupos({ grupos: g, k, condicion });
      assert.equal(r.valor, r.porEnumeracion, JSON.stringify({ m, h, k, condicion }));
      if (m >= 2) { const s = M.comiteConGrupos({ grupos: g, k, condicion, separados: true }); assert.equal(s.valor, s.porEnumeracion, 'separados'); }
    }
    // al menos una = total − ninguna
    if (m >= 1) assert.equal(M.comiteConGrupos({ grupos: g, k, condicion: { grupo: 'mujeres', alMenos: 1 } }).valor, M.combinaciones(m + h, k) - M.combinaciones(h, k));
  }
});

test('dos dados: 36 casillas igual de probables; la suma va de 2 a 12 con 1, 2, …, 6, …, 2, 1 maneras (AR20)', () => {
  const d = M.distribucionSuma({ dados: 2 });
  assert.deepEqual(Object.values(d.maneras), [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
  for (let s = 2; s <= 12; s++) assert.equal(d.maneras[s], 6 - Math.abs(s - 7));
  let total = M.fraccion(0); for (const s in d.p) total = M.sumar(total, d.p[s]); assert.equal(total.texto, '1');
  for (let dados = 1; dados <= 4; dados++) {
    const x = M.distribucionSuma({ dados });
    assert.equal(Object.values(x.maneras).reduce((a, b) => a + b, 0), 6 ** dados);
    for (let s = x.min; s <= x.max; s++) assert.equal(x.maneras[s], x.maneras[x.min + x.max - s], 'simetría');
  }
  // con dos dados, el 7 es la suma más probable, y ninguna suma vale 1/11
  for (let s = 2; s <= 12; s++) {
    const p = M.probabilidad({ dados: 2 }, { tipo: 'suma', valor: s });
    assert.notEqual(p.texto, '1/11'); assert.equal(p.errores.sumasEquiprobables.texto, '1/11');
    if (s !== 7) assert.equal(M.comparar(p.p, M.fraccion(1, 6)), -1);
  }
});

const EVENTOS = [
  { tipo: 'suma', valor: 7 }, { tipo: 'suma', op: '>=', valor: 10 }, { tipo: 'suma', op: 'primo' }, { tipo: 'suma', op: 'multiplo', valor: 3 },
  { tipo: 'producto', op: 'par' }, { tipo: 'producto', valor: 12 }, { tipo: 'diferencia', valor: 1 }, { tipo: 'iguales' }, { tipo: 'distintos' },
  { tipo: 'alMenosUno', valor: 6 }, { tipo: 'ninguno', valor: 6 }, { tipo: 'todos', op: 'par' }, { tipo: 'exactamente', cuantos: 1, valor: 5 },
  { tipo: 'dado', i: 0, valor: 2 }, { tipo: 'dado', i: 1, op: '>', valor: 4 }, { tipo: 'valores', valores: [5, 6] },
];
const azarEv = () => EVENTOS[rnd.entero(0, EVENTOS.length - 1)];
test('álgebra de eventos: inclusión-exclusión, complemento, condicional y producto; independencia', () => {
  const cfg = { dados: 2 };
  for (let k = 0; k < 200; k++) {
    const A = azarEv(), B = azarEv(), u = M.union(cfg, A, B);
    assert.equal(u.p.texto, M.restar(M.sumar(u.pA, u.pB), u.pAyB).texto, 'P(A∪B) = P(A) + P(B) − P(A∩B)');
    assert.equal(u.excluyentes, u.pAyB.num === 0);
    if (u.excluyentes) assert.equal(u.p.texto, u.errores.sumaDirecta.texto);
    const c = M.complemento(cfg, A); assert.equal(M.sumar(c.p, c.pA).texto, '1');
    const pB = M.probabilidad(cfg, B).p;
    if (pB.num) {
      const cd = M.condicional(cfg, A, B);
      assert.equal(M.multiplicar(cd.p, pB).texto, u.pAyB.texto, 'P(A∩B) = P(A|B)·P(B)');
      const ind = M.independientes(cfg, A, B);
      assert.equal(ind.independientes, cd.p.texto === M.probabilidad(cfg, A).texto, 'independientes ⇔ P(A|B) = P(A)');
    }
  }
  // lo que dice cada dado por separado es independiente del otro
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) assert.ok(M.independientes(cfg, { tipo: 'dado', i: 0, valor: a }, { tipo: 'dado', i: 1, valor: b }).independientes);
  // la suma 7 es independiente de lo que salga en el rojo; la suma 8, no
  for (let a = 1; a <= 6; a++) {
    assert.ok(M.independientes(cfg, { tipo: 'dado', i: 0, valor: a }, { tipo: 'suma', valor: 7 }).independientes);
    assert.ok(!M.independientes(cfg, { tipo: 'dado', i: 0, valor: a }, { tipo: 'suma', valor: 8 }).independientes);
  }
});

test('AR17: los grupos sin orden son 21; cada grupo de dos valores distintos ocupa dos casillas y un doble, una', () => {
  const todo = M.probabilidad({ dados: 2 }, { tipo: 'suma', op: '>=', valor: 2 });
  assert.equal(todo.favorables, 36); assert.equal(todo.grupos.length, 21); assert.equal(todo.gruposTotal, 21);
  for (const g of todo.grupos) assert.equal(g.ordenes, g.valores[0] === g.valores[1] ? 2 - 1 : 2);
  const tres = M.probabilidad({ dados: 3 }, { tipo: 'suma', op: '>=', valor: 3 });
  assert.equal(tres.grupos.length, M.combinacionesConRepeticion(6, 3));
  for (const g of tres.grupos) assert.equal(g.ordenes, M.permutacionesConRepeticion(Object.values(g.valores.reduce((o, v) => ((o[v] = (o[v] || 0) + 1), o), {}))));
  // Galileo: 9 y 10 tienen 6 grupos cada uno, pero 25 y 27 órdenes
  const s9 = M.probabilidad({ dados: 3 }, { tipo: 'suma', valor: 9 }), s10 = M.probabilidad({ dados: 3 }, { tipo: 'suma', valor: 10 });
  assert.equal(s9.grupos.length, 6); assert.equal(s10.grupos.length, 6);
  assert.equal(s9.errores.sinOrden.texto, s10.errores.sinOrden.texto);
});

test('al menos uno = 1 − ninguno, por fórmula y contando; sumar probabilidades se pasa (y con 7 dados pasa de 1)', () => {
  for (let n = 1; n <= 5; n++) for (let v = 1; v <= 6; v++) {
    const a = M.alMenosUno({ dados: n, valor: v }), c = M.probabilidad({ dados: n }, { tipo: 'alMenosUno', valor: v });
    assert.equal(a.texto, c.texto); assert.equal(c.errores.sumaProbabilidades.texto, M.fraccion(n, 6).texto);
    if (n >= 2) assert.equal(M.comparar(a.p, a.errores.sumaProbabilidades), -1);
  }
  assert.equal(M.comparar(M.alMenosUno({ dados: 7, valor: 6 }).errores.sumaProbabilidades, 1), 1);
});

test('monedas: cada secuencia de n lanzamientos vale 1/2ⁿ, se parezca o no al azar (AR21)', () => {
  for (let n = 1; n <= 8; n++) {
    const E = M.espacio({ dados: 0, monedas: n });
    assert.equal(E.total, 2 ** n);
    for (let t = 0; t < 5; t++) {
      const s = Array.from({ length: n }, () => (rnd.moneda() ? 'cara' : 'sello'));
      const a = M.secuenciaMoneda(s), b = M.probabilidad({ dados: 0, monedas: n }, { tipo: 'secuencia', valores: s });
      assert.equal(a.texto, `1/${2 ** n}`); assert.equal(b.favorables, 1);
      const caras = s.filter(x => x === 'cara').length;
      assert.equal(M.probabilidad({ dados: 0, monedas: n }, { tipo: 'caras', valor: caras }).favorables, M.combinaciones(n, caras));
    }
  }
});

test('simulación con semilla: reproducible y la frecuencia relativa se acerca a la probabilidad', () => {
  const a = M.simular({ lanzamientos: 500, semilla: 'x' }), b = M.simular({ lanzamientos: 500, semilla: 'x' }), c = M.simular({ lanzamientos: 500, semilla: 'y' });
  assert.deepEqual(a.veces, b.veces); assert.notDeepEqual(a.veces, c.veces);
  assert.equal(Object.values(a.veces).reduce((x, y) => x + y, 0), 500);
  for (const r of a.resultados) assert.ok(r.every(v => v >= 1 && v <= 6 && Number.isInteger(v)));
  // con muchos lanzamientos, cada frecuencia queda cerca de su probabilidad exacta (ley de los grandes números)
  const chico = M.simular({ lanzamientos: 100, semilla: 'ley' }), grande = M.simular({ lanzamientos: 200000, semilla: 'ley' });
  assert.ok(grande.desvioMax < 0.005, `desvío ${grande.desvioMax}`);
  assert.ok(grande.desvioMax < chico.desvioMax);
  const ev = M.simularEvento({ cfg: { dados: 2 }, evento: { tipo: 'alMenosUno', valor: 6 }, lanzamientos: 100000, semilla: 'ev' });
  assert.ok(ev.desvio < 0.006, `al menos un 6: ${ev.frecuencia}`);
  assert.equal(ev.serie[ev.serie.length - 1].n, 100000);
  const mon = M.simularEvento({ cfg: { dados: 0, monedas: 3 }, evento: { tipo: 'caras', valor: 2 }, lanzamientos: 50000, semilla: 'mon' });
  assert.ok(Math.abs(mon.frecuencia - 3 / 8) < 0.01);
  const cu = M.simularCumpleanos({ n: 23, salones: 20000, semilla: 'cumple' });
  assert.ok(Math.abs(cu.frecuencia - cu.p) < 0.015, `cumpleaños ${cu.frecuencia}`);
});

test('AR22: después de una racha de 6, el dado no tiene memoria', () => {
  const r = M.despuesDeRacha({ largo: 3, valor: 6, lanzamientos: 2000000, semilla: 'racha' });
  assert.ok(r.veces > 7000);
  assert.equal(r.siguiente.reduce((a, b) => a + b, 0), r.veces);
  for (const f of r.frecuencias) assert.ok(Math.abs(f - 1 / 6) < 0.015, `frecuencia ${f}`);
  const s = M.siguiente({ historia: [6, 6, 6, 6, 6], valor: 6 });
  assert.equal(s.texto, '1/6'); assert.equal(s.racha, 5);
  assert.equal(M.siguiente({ historia: [1, 2, 3], valor: 6 }).texto, '1/6');
});

test('cumpleaños: la probabilidad crece con n, pasa de 1/2 en 23 y es 1 con 366', () => {
  const c = M.curvaCumpleanos(80).puntos;
  for (let i = 1; i < c.length; i++) assert.ok(c[i].p >= c[i - 1].p);
  assert.ok(M.cumpleanos({ n: 22 }).p < 0.5 && M.cumpleanos({ n: 23 }).p > 0.5);
  assert.equal(M.cumpleanos({ n: 366 }).p, 1);
  assert.equal(M.cumpleanos({ n: 1 }).p, 0);
  // contra el producto de fracciones exactas con pocos días
  let q = M.fraccion(1); for (let i = 0; i < 5; i++) q = M.multiplicar(q, M.fraccion(12 - i, 12));
  cerca(M.cumpleanos({ n: 5, dias: 12 }).p, 1 - q.valor, 'n = 5, 12 días');
});

test('la tirada: es reproducible, termina en el valor sorteado, plana (giro múltiplo de 360°) y en el piso', () => {
  const vistos = Array(7).fill(0);
  for (let k = 0; k < 600; k++) {
    const t = M.tirada({ semilla: 'tirada-' + k, dados: 2 }), u = M.tirada({ semilla: 'tirada-' + k, dados: 2 });
    assert.deepEqual(t, u);
    const f = t.cuadros[t.cuadros.length - 1];
    assert.deepEqual(f.caras, t.valores);
    for (const g of f.giro) assert.equal(Math.abs(g) % 360, 0);
    for (const h of f.alto) assert.equal(h, 0);
    assert.equal(t.cuadros[0].t, 0); assert.equal(f.t, 1);
    for (const c of t.cuadros) for (const h of c.alto) assert.ok(h >= 0 && h <= 1);
    t.valores.forEach(v => vistos[v]++);
    // la cara cambia durante la tirada
    assert.ok(new Set(t.cuadros.map(c => c.caras[0])).size >= 3);
  }
  for (let v = 1; v <= 6; v++) assert.ok(Math.abs(vistos[v] / 1200 - 1 / 6) < 0.04, `cara ${v}: ${vistos[v]}`);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.fraccion(1, 0));
  assert.throws(() => M.espacio({ dados: 0, monedas: 0 }));
  assert.throws(() => M.espacio({ dados: 8 }));
  assert.throws(() => M.probabilidad({ dados: 2 }, { tipo: 'nada' }));
  assert.throws(() => M.probabilidad({ dados: 2 }, { tipo: 'dado', i: 2, valor: 1 }));
  assert.throws(() => M.probabilidad({ dados: 2 }, { tipo: 'suma', op: '≈', valor: 1 }));
  assert.throws(() => M.condicional({ dados: 2 }, { tipo: 'suma', valor: 7 }, { tipo: 'suma', valor: 13 }));
  assert.throws(() => M.factorial(19));
  assert.throws(() => M.factorial(-1));
  assert.throws(() => M.combinaciones(2.5, 1));
  assert.throws(() => M.comite({ n: 3, k: 4 }));
  assert.throws(() => M.secuenciaMoneda(['cara', 'canto']));
  assert.throws(() => M.comiteConGrupos({ grupos: [{ nombre: 'a', n: 2 }], k: 1, condicion: { grupo: 'b', exactos: 1 } }));
  assert.equal(M.variaciones(3, 5), 0); assert.equal(M.combinaciones(3, 5), 0);
});

// 4. papel.json
test('papel.json: entre 5 y 10 problemas, cada uno con pasos y verificación', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}…`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});

test('serie de la simulación y placa sorteada: la serie termina en el conteo final; la placa queda quieta al final', () => {
  const s = M.simular({ lanzamientos: 1000, semilla: 'serie', pasos: 50 });
  assert.equal(s.serie.length, 50); assert.equal(s.serie[49].n, 1000); assert.deepEqual(s.serie[49].veces, s.veces);
  for (let i = 1; i < s.serie.length; i++) for (const k in s.veces) assert.ok(s.serie[i].veces[k] >= s.serie[i - 1].veces[k]);
  const p = M.sortearPlaca({ semilla: 'placa' }), f = p.cuadros[p.cuadros.length - 1];
  assert.match(p.texto, /^[A-Z]{3}-[0-9]{3}$/); assert.deepEqual(f.casillas, p.casillas); assert.equal(f.quietas, 6);
  assert.deepEqual(M.sortearPlaca({ semilla: 'placa' }), p);
});

test('la racha precalculada (RACHA_CINCO_SEIS) es la que da la simulación con su semilla', () => {
  const R = M.RACHA_CINCO_SEIS, r = M.despuesDeRacha({ largo:R.largo, valor:R.valor, lanzamientos:R.lanzamientos, semilla:R.semilla });
  assert.equal(r.veces, R.veces); assert.deepEqual(r.siguiente, R.siguiente);
  cerca(R.frecuenciaValor, r.frecuenciaValor, 'frecuencia del 6'); assert.equal(R.p.texto, '1/6');
});
