// Pruebas del motor de «El triángulo que se estira». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con triángulos al azar (semilla fija): el área no cambia al girar ni al mover A por la
//    paralela a BC (GE6, GE9); el área por coordenadas es base·altura/2 con cualquier lado como base; los
//    ángulos suman 180°; la altura es perpendicular a la base y cae fuera solo si hay un ángulo obtuso junto
//    a esa base (GE7); en el isósceles, altura = mediana = bisectriz desde el vértice, y en el escaleno no
//    (GE8); el teorema de la bisectriz; la fórmula de la mediana; el baricentro a 2/3 de cada mediana; el
//    ortocentro, dentro, en el vértice o fuera; las relaciones métricas del triángulo rectángulo (GE18).
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
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
  assert.equal(datos.plantilla, 'triangulo-estira');
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
const P = () => ({ x: al(-20, 20), y: al(-20, 20) });
function alAzar() {
  for (;;) {
    const A = P(), B = P(), C = P();
    const s = Math.abs(motor.areaConSigno(A, B, C)), L = Math.max(motor.distancia(A, B), motor.distancia(B, C), motor.distancia(C, A));
    if (s > 0.02 * L * L) return [A, B, C];   // ni muy aplastado ni degenerado
  }
}
const N = 400;
const resta = (p, q) => ({ x: p.x - q.x, y: p.y - q.y });
const pesc = (u, v) => u.x * v.x + u.y * v.y;

test('GE9: al girar, los vértices cambian pero los lados, los ángulos, el tipo y el área no', () => {
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C), g = al(-360, 360);
    const r = motor.rotar(A, B, C, g), r2 = motor.rotar(A, B, C, g, P());
    for (const x of [r, r2]) {
      cerca(x.area, t.area, 'área'); assert.equal(x.tipoAngulo, t.tipoAngulo); assert.equal(x.tipoLados, t.tipoLados);
      for (const l of ['a', 'b', 'c']) cerca(x.lados[l], t.lados[l], `lado ${l}`);
      for (const v of ['A', 'B', 'C']) cerca(x.angulos[v], t.angulos[v], `ángulo ${v}`, 1e-8);
    }
    // girar 360° devuelve el mismo triángulo
    const v = motor.rotar(A, B, C, 360);
    cerca(v.A.x, A.x, 'A.x', 1e-9); cerca(v.C.y, C.y, 'C.y', 1e-9);
  }
});
test('un triángulo rectángulo girado sigue siendo rectángulo (tolerancia relativa)', () => {
  for (let k = 0; k < N; k++) {
    // A sobre la circunferencia de diámetro BC: ángulo recto en A
    const B = P(), C = P(), O = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }, R = motor.distancia(B, C) / 2;
    if (R < 1) continue;
    const ang = Math.atan2(B.y - O.y, B.x - O.x) + al(0.3, Math.PI - 0.3);
    const A = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
    const t = motor.triangulo(A, B, C);
    assert.equal(t.tipoAngulo, 'rectángulo'); assert.equal(t.verticeRecto, 'A');
    assert.equal(motor.rotar(A, B, C, al(0, 360)).tipoAngulo, 'rectángulo');
    // la mediana a la hipotenusa mide la mitad de ella y el circuncentro es su punto medio
    cerca(t.medianas.A.longitud, t.lados.a / 2, 'mediana'); cerca(t.circuncentro.x, O.x, 'O.x', 1e-8); cerca(t.circuncentro.y, O.y, 'O.y', 1e-8);
    // relaciones métricas con coordenadas: h² = m·n y c² = a·m (las proyecciones son BH y HC)
    const h = t.alturas.A, m = motor.distancia(B, h.pie), n = motor.distancia(h.pie, C);
    cerca(h.longitud * h.longitud, m * n, 'h² = m·n'); cerca(t.lados.c * t.lados.c, t.lados.a * m, 'c² = a·m');
    cerca(h.longitud, t.lados.b * t.lados.c / t.lados.a, 'h = bc/a');
    const r = motor.rectangulo({ catetos: [t.lados.c, t.lados.b] });
    cerca(r.altura, h.longitud, 'rectangulo() = coordenadas'); cerca(r.proyecciones[0], m, 'm');
  }
});
test('GE6: con A sobre la paralela a BC, el área y la altura no cambian, aunque el triángulo se acueste', () => {
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), d = al(-60, 60), r = motor.moverEnParalela(A, B, C, d);
    cerca(r.area, r.areaAntes, 'área'); cerca(r.altura, r.alturaAntes, 'altura');
    cerca(motor.distancia(r.A, A), Math.abs(d), 'A se corrió d');
  }
  // y lejos de la base, el ángulo junto a B o a C se vuelve obtuso y la altura sale
  const lejos = motor.moverEnParalela({ x: 1, y: 3 }, { x: 0, y: 0 }, { x: 4, y: 0 }, -50).triangulo;
  assert.equal(lejos.alturas.A.donde, 'fuera'); cerca(lejos.area, 6, 'área');
});
test('área por coordenadas = base · altura / 2 con cualquiera de los tres lados como base; los ángulos suman 180°', () => {
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C);
    cerca(t.area, t.areaCoordenadas, 'a·h_a/2');
    cerca(t.lados.b * t.alturas.B.longitud / 2, t.areaCoordenadas, 'b·h_b/2');
    cerca(t.lados.c * t.alturas.C.longitud / 2, t.areaCoordenadas, 'c·h_c/2');
    // Herón, como cálculo independiente
    const { a, b, c } = t.lados, s = (a + b + c) / 2;
    cerca(Math.sqrt(s * (s - a) * (s - b) * (s - c)), t.area, 'Herón', 1e-7);
    cerca(t.sumaAngulos, 180, 'suma de ángulos');
    // al cambiar el orden de los vértices, el área es la misma y cambia el sentido
    const u = motor.triangulo(A, C, B);
    cerca(u.area, t.area, 'orden'); assert.notEqual(u.sentido, t.sentido);
    // el área que da tomar un lado como altura es siempre mayor o igual (el lado es más largo que la altura)
    assert.ok(t.errores.areaConAB >= t.area - 1e-9 && t.errores.areaConAC >= t.area - 1e-9);
  }
});
test('GE7: la altura es perpendicular a la base y cae fuera justo cuando el ángulo junto a la base es obtuso', () => {
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C);
    const pares = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
    for (const v of ['A', 'B', 'C']) {
      const h = t.alturas[v], [p, q] = pares[v], V = t.vertices[v], Pp = t.vertices[p], Q = t.vertices[q];
      assert.ok(Math.abs(pesc(resta(V, h.pie), resta(Q, Pp))) <= 1e-9 * h.base * Math.max(1, h.longitud) * 10, 'perpendicular');
      const obtusoEn = t.angulos[p] > 90 ? p : t.angulos[q] > 90 ? q : null;
      if (obtusoEn) { assert.equal(h.donde, 'fuera', `${v}: debía caer fuera`); assert.equal(h.lado, obtusoEn); assert.ok(h.prolongacion > 0); }
      else assert.equal(h.donde, 'dentro');
      assert.ok(h.longitud <= Math.min(h.errores.ladoHastaP, h.errores.ladoHastaQ) + 1e-9, 'la altura es la menor distancia');
    }
    assert.equal(t.alturasFuera, t.tipoAngulo === 'obtusángulo' ? 2 : 0);
  }
});
test('GE8: en el isósceles, desde el vértice, altura = mediana = bisectriz; en el escaleno, las tres son distintas', () => {
  for (let k = 0; k < N; k++) {
    // isósceles al azar: A sobre la mediatriz de BC, y luego todo girado
    const B = P(), C = P(), M = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }, u = resta(C, B), L = Math.hypot(u.x, u.y);
    if (L < 1) continue;
    const s = al(0.2, 3) * L * (rnd() < 0.5 ? -1 : 1), A = { x: M.x - u.y / L * s, y: M.y + u.x / L * s };
    if (Math.abs(Math.abs(s) - L * Math.sqrt(3) / 2) < 1e-3 * L) continue;   // evita el equilátero
    const t = motor.triangulo(A, B, C);
    assert.equal(t.tipoLados, 'isósceles'); assert.equal(t.verticeIsosceles, 'A');
    cerca(t.alturas.A.longitud, t.medianas.A.longitud, 'h = m'); cerca(t.bisectrices.A.longitud, t.medianas.A.longitud, 'w = m');
    cerca(t.alturas.A.pie.x, M.x, 'pie', 1e-8); cerca(t.bisectrices.A.punto.y, M.y, 'D', 1e-8);
    cerca(motor.partirArea(A, B, C, 0.5).razon, 1, 'mitades');
  }
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C);
    if (t.tipoLados !== 'escaleno') continue;
    const h = t.alturas.A.longitud, w = t.bisectrices.A.longitud, m = t.medianas.A.longitud;
    // con b ≠ c: h < w < m (la bisectriz siempre queda entre la altura y la mediana)
    assert.ok(h < w && w < m, `h=${h} w=${w} m=${m}`);
  }
});
test('teorema de la bisectriz, fórmula de la mediana y baricentro a 2/3 de cada mediana', () => {
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C), { a, b, c } = t.lados;
    const w = t.bisectrices.A;
    cerca(w.segmentos[0] / w.segmentos[1], c / b, 'BD/DC = c/b'); cerca(w.segmentos[0] + w.segmentos[1], a, 'BD + DC = a');
    cerca(w.formula, w.longitud, 'bisectriz: fórmula'); cerca(w.formulaCoseno, w.longitud, 'bisectriz: coseno');
    cerca(w.angulos[0] * 2, t.angulos.A, 'parte el ángulo en dos', 1e-8);
    // la bisectriz parte el área en la misma razón c/b
    cerca(motor.partirArea(A, B, C, c / (b + c)).razon, c / b, 'área partida por la bisectriz');
    for (const v of ['A', 'B', 'C']) {
      const m = t.medianas[v];
      cerca(m.formula, m.longitud, `mediana ${v}: fórmula`);
      cerca(motor.distancia(t.vertices[v], t.baricentro), 2 * m.longitud / 3, `baricentro a 2/3 desde ${v}`);
    }
    // la mediana parte el área en dos mitades iguales
    const pa = motor.partirArea(A, B, C, 0.5); cerca(pa.areas[0], pa.areas[1], 'mediana: mitades'); cerca(pa.total, t.area, 'total');
  }
});
test('ortocentro: las tres alturas pasan por él; dentro en el acutángulo, en el vértice en el rectángulo y fuera en el obtusángulo', () => {
  const dentro = (Q, A, B, C) => {
    const s = [motor.areaConSigno(A, B, Q), motor.areaConSigno(B, C, Q), motor.areaConSigno(C, A, Q)];
    return s.every(x => x > 0) || s.every(x => x < 0);
  };
  const vistos = new Set();
  for (let k = 0; k < N; k++) {
    const [A, B, C] = alAzar(), t = motor.triangulo(A, B, C), H = t.ortocentro, esc = Math.max(t.lados.a, t.lados.b, t.lados.c);
    for (const [V, Pp, Q] of [[A, B, C], [B, C, A], [C, A, B]])
      assert.ok(Math.abs(pesc(resta(H, V), resta(Q, Pp))) <= 1e-7 * esc * esc, 'H está en la altura');
    assert.equal(H.donde, t.tipoAngulo === 'acutángulo' ? 'dentro' : 'fuera');
    assert.equal(dentro(H, A, B, C), H.donde === 'dentro');
    assert.ok(dentro(t.baricentro, A, B, C) && dentro(t.incentro, A, B, C), 'baricentro e incentro siempre dentro');
    // recta de Euler: G está entre O y H, con GH = 2·OG
    cerca(motor.distancia(t.baricentro, H), 2 * motor.distancia(t.baricentro, t.circuncentro), 'Euler', 1e-7);
    vistos.add(t.tipoAngulo);
  }
  assert.ok(vistos.has('acutángulo') && vistos.has('obtusángulo'), 'el azar cubre los dos tipos');
});
test('GE18: relaciones métricas del triángulo rectángulo por cuatro caminos que dan lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const a = al(0.5, 30), b = al(0.5, 30), r = motor.rectangulo({ catetos: [a, b] }), c = r.hipotenusa, [m, n] = r.proyecciones, h = r.altura;
    cerca(h * h, m * n, 'h² = m·n'); cerca(a * a, c * m, 'a² = c·m'); cerca(b * b, c * n, 'b² = c·n'); cerca(h, a * b / c, 'h = ab/c');
    cerca(m + n, c, 'm + n = c'); cerca(r.area, c * h / 2, 'área con la hipotenusa');
    for (const otro of [motor.rectangulo({ proyecciones: [m, n] }), motor.rectangulo({ hipotenusa: c, cateto: a }), motor.rectangulo({ hipotenusa: c, proyeccion: m })]) {
      cerca(otro.altura, h, 'misma altura'); cerca(otro.catetos[1], b, 'mismo cateto');
    }
    // los errores típicos dan otra cosa (salvo coincidencias): el promedio de m y n nunca es menor que h
    assert.ok(r.errores.hPromedioProyecciones >= h - 1e-12, 'media aritmética ≥ media geométrica');
    assert.ok(r.bisectrizRecto >= h - 1e-12 && r.bisectrizRecto <= r.mediana + 1e-12, 'h ≤ bisectriz ≤ mediana');
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  const B = { x: 0, y: 0 }, C = { x: 4, y: 0 };
  assert.throws(() => motor.triangulo({ x: 2, y: 0 }, B, C), /alineados/);
  assert.throws(() => motor.triangulo(B, B, B), /coinciden/);
  assert.throws(() => motor.triangulo({ x: 'a', y: 1 }, B, C), /numéricas/);
  assert.throws(() => motor.triangulo(null, B, C), /numéricas/);
  assert.throws(() => motor.altura({ x: NaN, y: 1 }, B, C), /numéricas/);
  assert.throws(() => motor.rectangulo({ catetos: [0, 3] }), /mayor que cero/);
  assert.throws(() => motor.rectangulo({ catetos: [-1, 3] }), /mayor que cero/);
  assert.throws(() => motor.rectangulo({ hipotenusa: 5, cateto: 5 }), /menor que la hipotenusa/);
  assert.throws(() => motor.rectangulo({ hipotenusa: 5, proyeccion: 6 }), /menor que la hipotenusa/);
  assert.throws(() => motor.rectangulo({}), /faltan datos/);
  assert.throws(() => motor.rectangulo({ proyecciones: ['4', 9] }), /número/);
  assert.throws(() => motor.moverEnParalela({ x: 1, y: 3 }, B, C, 'lejos'), /número/);
  assert.throws(() => motor.rotar({ x: 1, y: 3 }, B, C, undefined), /número/);
  assert.throws(() => motor.partirArea({ x: 1, y: 3 }, B, C, 1), /entre 0 y 1/);
  assert.throws(() => motor.partirArea({ x: 1, y: 3 }, B, C, 0), /entre 0 y 1/);
  // acepta [x, y]
  cerca(motor.triangulo([-2, 3], [0, 0], [4, 0]).area, 6, 'con listas');
});

// 4. Problemas de papel (regla 6)
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
