// Pruebas del motor de «El armador de triángulos». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): LLL, LAL, ALA y LAA dan un triángulo que cumple los tres
//    datos; LLA da 0, 1 o 2 según la altura y el lado adyacente, y cada triángulo cumple los datos; el ángulo
//    frente al lado mayor (o recto u obtuso) siempre determina; AAA nunca determina; el armador solo cierra donde
//    construir pone los triángulos; superponer lleva un triángulo sobre otro congruente; la correspondencia
//    encuentra la de verdad aunque se desordenen los nombres; mediatriz, bisectriz, base media y mediana a la
//    hipotenusa cumplen su teorema en cualquier posición.
// 3. Ningún error típico coincide con la respuesta (sobre muchos datos).
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) {
    assert.ok(Array.isArray(real), `${que}: se esperaba una lista`);
    assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'congruencia');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const N = 400;
const d = motor.distancia;
// Mide un triángulo construido: lados y ángulos (por la ley de cosenos, cálculo aparte del motor)
function medir(t) {
  const { A, B, C } = t.vertices;
  const a = d(B, C), b = d(C, A), c = d(A, B);
  const ang = (x, y, z) => Math.acos((y * y + z * z - x * x) / (2 * y * z)) * 180 / Math.PI;
  return { a, b, c, A: ang(a, b, c), B: ang(b, a, c), C: ang(c, a, b) };
}
function cumple(t, dat, que) {
  const m = medir(t);
  for (const [k, v] of Object.entries(dat)) {
    const esperado = 'ABC'.includes(k) ? motor.grados(v) : v;
    cerca(m[k], esperado, `${que}: ${k}`, 1e-7);
  }
  assert.ok(t.vertices.C[1] > 0, `${que}: C debe quedar arriba`);
}
function trianguloAlAzar() {
  for (;;) {
    const a = al(1, 20), b = al(1, 20), c = al(1, 20), m = Math.max(a, b, c);
    if (a + b + c - 2 * m > 0.05 * m) return { a, b, c };
  }
}

test('LLL, LAL, ALA y LAA: un solo triángulo y cumple los tres datos', () => {
  for (let k = 0; k < N; k++) {
    const L = trianguloAlAzar(), t = motor.construir(L).triangulos[0], m = medir(t);
    cumple(t, L, 'LLL');
    const lal = { b: m.b, c: m.c, A: m.A }, r1 = motor.construir(lal);
    assert.equal(r1.criterio, 'LAL'); assert.equal(r1.cuantos, 'uno'); cerca(r1.triangulos[0].lados.a, m.a, 'LAL: a', 1e-7);
    const ala = { A: m.A, c: m.c, B: m.B }, r2 = motor.construir(ala);
    assert.equal(r2.criterio, 'ALA'); cerca(r2.triangulos[0].lados.b, m.b, 'ALA: b', 1e-7);
    const laa = { A: m.A, B: m.B, a: m.a }, r3 = motor.construir(laa);
    assert.equal(r3.criterio, 'LAA'); cerca(r3.triangulos[0].lados.c, m.c, 'LAA: c', 1e-7);
    cerca(r3.triangulos[0].angulos.C, m.C, 'LAA: el tercer ángulo', 1e-7);
    // los cuatro dan el mismo triángulo (congruente)
    for (const r of [r1, r2, r3]) { const v = r.triangulos[0].vertices; assert.ok(motor.congruentes([v.A, v.B, v.C], [t.vertices.A, t.vertices.B, t.vertices.C])); }
  }
});
test('LLA: 0, 1 o 2 según la altura h y el lado adyacente; cada triángulo cumple los datos', () => {
  const vistos = new Set();
  for (let k = 0; k < N * 2; k++) {
    const A = al(5, 175), b = al(1, 15), a = al(0.5, 20), r = motor.construir({ A, b, a });
    const h = b * Math.sin(A * Math.PI / 180);
    let n;
    if (A >= 90) n = a > b ? 1 : 0;
    else n = a < h ? 0 : a >= b ? 1 : 2;   // (a = h exacto no sale al azar)
    assert.equal(r.n, n, `A=${A} b=${b} a=${a}`);
    cerca(r.altura, h, 'altura', 1e-9);
    for (const t of r.triangulos) cumple(t, { A, b, a }, 'LLA');
    if (r.n === 2) { assert.ok(!motor.congruentes(Object.values(r.triangulos[0].vertices), Object.values(r.triangulos[1].vertices)), 'los dos no son congruentes'); assert.ok(!r.frenteAlMayor); }
    if (r.frenteAlMayor || (A >= 90 && r.n)) assert.equal(r.cuantos, 'uno', 'el ángulo frente al lado mayor determina');
    vistos.add(r.cuantos);
  }
  assert.deepEqual([...vistos].sort(), ['dos', 'ninguno', 'uno']);
});
test('hipotenusa y cateto (LLA con el recto): siempre uno, y el otro cateto por Pitágoras', () => {
  for (let k = 0; k < N; k++) {
    const b = al(0.5, 20), a = b + al(0.1, 20), r = motor.construir({ A: 90, b, a });
    assert.equal(r.cuantos, 'uno'); assert.ok(r.recto);
    cerca(r.terceros[0], Math.sqrt(a * a - b * b), 'cateto', 1e-9);
    cerca(r.detras[0], -r.terceros[0], 'el corte de atrás es el reflejo');
    assert.ok(r.errores.pitagorasSuma > r.terceros[0]);
  }
});
test('AAA nunca determina: los tres ángulos fijos admiten cualquier tamaño (semejantes)', () => {
  for (let k = 0; k < N; k++) {
    const A = al(5, 100), B = al(5, 170 - A), C = 180 - A - B, r = motor.construir({ A, B, C });
    assert.equal(r.cuantos, 'infinitos'); assert.equal(r.determina, false);
    const kit = { A, B, C, desde: 1, hasta: 9 }, x1 = al(1, 9), x2 = al(1, 9);
    const m1 = motor.mover(kit, [x1, 0]), m2 = motor.mover(kit, [x2, 0]);
    assert.ok(m1.cierra && m2.cierra);
    cerca(m1.lados.a / m2.lados.a, x1 / x2, 'proporcionales', 1e-7); cerca(m1.lados.b / m2.lados.b, x1 / x2, 'proporcionales', 1e-7);
  }
});
test('el armador cierra justo donde construir pone el triángulo, y en ningún otro lugar', () => {
  for (let k = 0; k < N / 2; k++) {
    const kits = [trianguloAlAzar(), { A: al(10, 80), b: al(3, 12), a: al(1, 14) }];
    const L = trianguloAlAzar(), m = medir(motor.construir(L).triangulos[0]);
    kits.push({ A: m.A, c: m.c, B: m.B }, { b: m.b, A: m.A, c: m.c });
    for (const kit of kits) {
      const R = motor.armador(kit), sol = R.solucion;
      if (R.criterio === 'LLL' || R.criterio === 'LAL') assert.equal(R.cierres.length, sol.n ? 2 : 0);
      else assert.equal(R.cierres.length, sol.n);
      let cierran = 0;
      for (let j = 0; j < 720; j++) {
        const P = motor.enLocus(kit, j / 720), r = motor.mover(kit, P, { iman: 1e-6 });
        if (r.cierra) { cierran++; const v = r.triangulo; cumple({ vertices: { A: v.A, B: v.B, C: v.C[1] > 0 ? v.C : [v.C[0], -v.C[1]] } }, kit, R.criterio); }
      }
      // el extremo libre, en cada cierre, da un triángulo con los datos
      R.cierres.forEach((Q, i) => { const r = motor.mover(kit, Q); assert.ok(r.cierra); assert.equal(r.indice, i); });
      if (R.criterio === 'LAL') assert.ok(cierran > 0);
    }
  }
});
test('el imán solo pega cerca de un cierre y la falta mide cuánto queda', () => {
  const kit = { A: 37, b: 10, a: 6.5 };
  const lejos = motor.mover(kit, [8 + 6.5, 6]);   // la varilla horizontal: no toca la base
  assert.equal(lejos.cierra, false); cerca(lejos.falta, 6, 'altura sobre la base');
  const L = { a: 7, b: 8, c: 5 }, r = motor.mover(L, [-8, 0]);
  assert.equal(r.cierra, false); cerca(r.falta, 13 - 7, 'LLL: |XB| − a');
});
test('superponer lleva un triángulo sobre otro congruente (girado, trasladado y volteado)', () => {
  for (let k = 0; k < N; k++) {
    const P = [[al(-9, 9), al(-9, 9)], [al(-9, 9), al(-9, 9)], [al(-9, 9), al(-9, 9)]];
    const g = al(-Math.PI, Math.PI), voltea = rnd() < 0.5, T = [al(-9, 9), al(-9, 9)];
    const Q = P.map(([x, y]) => { const xx = voltea ? -x : x; return [T[0] + xx * Math.cos(g) - y * Math.sin(g), T[1] + xx * Math.sin(g) + y * Math.cos(g)]; });
    const area = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]));
    if (area < 1) continue;
    const r = motor.superponer(P, Q, 1);
    assert.equal(r.refleja, voltea);
    r.puntos.forEach((p, i) => { cerca(p[0], Q[i][0], 'x', 1e-7); cerca(p[1], Q[i][1], 'y', 1e-7); });
    // a mitad de camino el triángulo no se deforma (salvo mientras se voltea)
    const m = motor.superponer(P, Q, 0.7).puntos;
    assert.ok(motor.congruentes(m, P));
    assert.ok(motor.congruentes(P, Q));
    // y la correspondencia la encuentra aunque los nombres vayan en otro orden
    const L = T3 => [d(T3[0], T3[1]), d(T3[1], T3[2]), d(T3[2], T3[0])];
    const c = motor.correspondencia({ nombres: 'ABC', lados: L(P) }, { nombres: 'QRP', lados: L(Q) });
    assert.ok(c.congruentes); assert.equal(c.texto, 'ΔABC ≅ ΔQRP');
  }
});
test('mediatriz: todo punto de ella equidista de A y B; bisectriz: todo punto de ella equidista de los lados', () => {
  for (let k = 0; k < N; k++) {
    const A = [al(-9, 9), al(-9, 9)], B = [al(-9, 9), al(-9, 9)];
    if (d(A, B) < 0.5) continue;
    const r = motor.mediatriz({ A, B, t: al(-20, 20) });
    cerca(r.PA, r.PB, 'PA = PB'); cerca(r.PA * r.PA, r.PM * r.PM + r.mitad * r.mitad, 'Pitágoras en PMA');
    const ang = al(10, 170), dd = al(1, 20), s = motor.bisectriz({ angulo: ang, d: dd });
    cerca(s.distancias[0], s.distancias[1], 'PH = PK'); cerca(s.OH, s.OK, 'OH = OK');
    cerca(d(s.P, [0, 0]), dd, 'OP');
    // PH es perpendicular a OA y PK a OB
    cerca(s.P[0], s.H[0], 'PH vertical');
    const u = [Math.cos(ang * Math.PI / 180), Math.sin(ang * Math.PI / 180)];
    cerca((s.P[0] - s.K[0]) * u[0] + (s.P[1] - s.K[1]) * u[1], 0, 'PK ⟂ OB', 1e-8);
  }
});
test('base media: paralela al tercer lado y la mitad, con A en cualquier lugar', () => {
  for (let k = 0; k < N; k++) {
    const A = [al(-9, 9), al(-9, 9)], B = [al(-9, 9), al(-9, 9)], C = [al(-9, 9), al(-9, 9)];
    const ar = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]));
    if (ar < 1) continue;
    const r = motor.baseMedia({ A, B, C });
    assert.ok(r.paralela); cerca(r.razon, 0.5, 'MN = BC/2');
  }
});
test('mediana relativa a la hipotenusa: siempre la mitad de la hipotenusa, en cualquier punto de la semicircunferencia', () => {
  for (let k = 0; k < N; k++) {
    const h = al(1, 30), t = al(1, 179), r = motor.medianaHipotenusa({ hipotenusa: h, t });
    cerca(r.mediana, h / 2, 'BM = AC/2');
    const [AB, BC] = r.catetos; cerca(AB * AB + BC * BC, h * h, 'ángulo recto en B');
    const s = motor.medianaHipotenusa({ catetos: [AB, BC] });
    cerca(s.B[0], r.B[0], 'B.x', 1e-7); cerca(s.B[1], r.B[1], 'B.y', 1e-7);
  }
});
test('notables: k, k√3, 2k; 3k, 4k, 5k; k, k, k√2 (con Pitágoras)', () => {
  for (let k = 0; k < N; k++) {
    const x = al(0.5, 30);
    for (const tipo of ['30-60', '45-45', '37-53']) {
      for (const dato of ['hipotenusa', 'menor', 'mayor']) {
        const r = motor.notable({ tipo, [dato]: x });
        cerca(r[dato], x, dato); cerca(r.menor * r.menor + r.mayor * r.mayor, r.hipotenusa * r.hipotenusa, 'Pitágoras');
      }
    }
    const r = motor.notable({ tipo: '30-60', hipotenusa: x }); cerca(r.menor, x / 2, 'el menor es la mitad de la hipotenusa');
  }
  assert.equal(motor.raizTexto(Math.sqrt(75)), '5√3'); assert.equal(motor.raizTexto(12), '12'); assert.equal(motor.raizTexto(Math.sqrt(2)), '√2');
  assert.equal(motor.raizTexto(10 / 3), null);
});

// 3. Ningún error típico coincide con la respuesta
test('ningún error típico coincide con la respuesta (construir, mediatriz, bisectriz, mediana, notables, correspondencia)', () => {
  const revisar = (r, que) => {
    for (const [k, v] of Object.entries(r.errores)) {
      if (v === null) continue;
      if (typeof v === 'string') assert.notEqual(v, r.cuantos, `${que}: ${k}`);
      else if (k === 'pitagorasSuma') assert.ok(Math.abs(v - r.terceros[0]) > 1e-6, `${que}: ${k}`);
    }
  };
  for (let k = 0; k < N * 2; k++) {
    const L = trianguloAlAzar();
    revisar(motor.construir(L), 'LLL');
    revisar(motor.construir({ A: al(5, 175), b: al(1, 15), a: al(0.5, 20) }), 'LLA');
    revisar(motor.construir({ A: 90, b: al(1, 10), a: al(10.5, 20) }), 'LLA recto');
    const A = al(5, 100), B = al(5, 170 - A);
    revisar(motor.construir({ A, B, C: 180 - A - B }), 'AAA');
    revisar(motor.construir({ A, B, a: al(1, 9) }), 'LAA');
    revisar(motor.construir({ A, c: al(1, 9), B }), 'ALA');
    revisar(motor.construir({ b: al(1, 9), A, c: al(1, 9) }), 'LAL');
    const m = motor.mediatriz({ A: [0, 0], B: [al(1, 9), 0], t: al(-15, 15) });
    for (const v of Object.values(m.errores)) if (v !== null) assert.ok(Math.abs(v - m.PA) > 1e-9);
    const b = motor.bisectriz({ angulo: al(10, 170), d: al(1, 20) });
    for (const v of Object.values(b.errores)) if (v !== null) assert.ok(Math.abs(v[0] - b.distancias[0]) > 1e-9 || Math.abs(v[1] - b.distancias[1]) > 1e-9);
    const h = motor.medianaHipotenusa({ hipotenusa: al(1, 20), t: al(1, 179) });
    for (const v of Object.values(h.errores)) if (v !== null) assert.ok(Math.abs(v - h.mediana) > 1e-9);
    const bm = motor.baseMedia({ A: [al(-9, 9), al(5, 9)], B: [al(-9, -1), 0], C: [al(1, 9), 0] });
    for (const v of Object.values(bm.errores)) assert.ok(Math.abs(v - bm.MN) > 1e-9);
    for (const tipo of ['30-60', '45-45', '37-53']) {
      const n = motor.notable({ tipo, hipotenusa: al(1, 20) });
      for (const v of Object.values(n.errores)) if (v !== null) assert.ok(Math.abs(v - n.menor) > 1e-9);
    }
  }
  // los datos de la escena
  const c = motor.correspondencia({ nombres: 'ABC', lados: [5, 7, 8], puntos: [[0, 0], [5, 0], [4, 6.9]] },
    { nombres: 'PQR', lados: [8, 5, 7], puntos: [[0, 0], [6.29, 4.95], [7, 0]] });
  for (const v of Object.values(c.errores)) if (v !== null) assert.ok(!c.todas.includes(v));
  for (const kit of [{ A: 37, b: 10, a: 6.5 }, { A: 90, b: 6, a: 10 }, { A: 120, b: 5, a: 7 }, { a: 7, b: 8, c: 5 }, { A: 37, B: 53, C: 90 }]) revisar(motor.construir(kit), JSON.stringify(kit));
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.construir({ a: 3, b: 4 }), /tres datos/);
  assert.throws(() => motor.construir({ a: 3, b: 4, c: 5, A: 90 }), /tres datos/);
  assert.throws(() => motor.construir({ a: 3, b: 4, x: 5 }), /desconocido/);
  assert.throws(() => motor.construir({ a: -3, b: 4, c: 5 }), /mayor que cero/);
  assert.throws(() => motor.construir({ a: '3', b: 4, c: 5 }), /número/);
  assert.throws(() => motor.construir({ A: 180, b: 4, c: 5 }), /entre 0° y 180°/);
  assert.throws(() => motor.construir(null), /faltan/);
  assert.throws(() => motor.armador({ B: 37, a: 10, b: 6 }), /letras/);
  assert.throws(() => motor.mover({ a: 7, b: 8, c: 5 }, [1]), /punto/);
  assert.throws(() => motor.mover({ a: 7, b: 8, c: 5 }, [1, 1], { iman: 0 }), /mayor que cero/);
  assert.throws(() => motor.armador({ A: 60, B: 60, C: 60, desde: 5, hasta: 2 }), /mayor que desde/);
  assert.throws(() => motor.correspondencia({ nombres: 'AB', lados: [1, 1, 1] }, { nombres: 'DEF', lados: [1, 1, 1] }), /tres letras/);
  assert.throws(() => motor.superponer([[0, 0], [1, 0], [0, 1]], [[0, 0], [2, 0], [0, 2]], 1), /no son congruentes/);
  assert.throws(() => motor.mediatriz({ A: [0, 0], B: [0, 0], t: 1 }), /distintos/);
  assert.throws(() => motor.bisectriz({ angulo: 0, d: 1 }), /entre 0° y 180°/);
  assert.throws(() => motor.baseMedia({ A: [0, 0], B: [1, 1], C: [2, 2] }), /triángulo/);
  assert.throws(() => motor.medianaHipotenusa({ hipotenusa: 5, t: 180 }), /entre 0° y 180°/);
  assert.throws(() => motor.notable({ tipo: '20-70', hipotenusa: 5 }), /tipo/);
  assert.throws(() => motor.notable({ tipo: '30-60' }), /falta un lado/);
  assert.equal(motor.academia(motor.grados(37)), 37); assert.equal(motor.academia(motor.grados(53)), 53);
  cerca(motor.sen(37), 0.6, 'sen 37°'); cerca(motor.cos(120), -0.5, 'cos 120°'); cerca(motor.sen(20), Math.sin(Math.PI / 9), 'sen 20°');
});

// 5. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
