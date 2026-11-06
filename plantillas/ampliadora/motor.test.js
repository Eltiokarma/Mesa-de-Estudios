// Pruebas del motor de La ampliadora. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: con la figura ampliada por k (también k racional), las longitudes se multiplican por k,
//    las áreas por k² y los volúmenes por k³ (GE1, GE2); la homotecia conserva los ángulos y multiplica los
//    lados por k; la teselación cuenta k² piezas que cubren la figura; cubitos visibles + escondidos = total
//    (GE13); el cono es un tercio del cilindro y los vertidos conservan el agua (GE20); la figura "lineal"
//    tiene k veces el área pero no es semejante.
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
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
  assert.equal(datos.plantilla, 'ampliadora');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20, `${datos.casos.length} casos`);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const KS = [1 / 3, 1 / 2, 2 / 3, 1, 4 / 3, 3 / 2, 5 / 3, 2, 5 / 2, 3, 7 / 2, 4, 0.1, 7.25];
const FIGURAS = [
  ['cuadrado', { lado: 3 }], ['rectangulo', { base: 2, altura: 5 }], ['triangulo', { lado: 3 }], ['triangulo', { a: 4, b: 5, c: 7 }],
  ['circulo', { r: 1.5 }], ['cubo', { arista: 2 }], ['prisma', { largo: 2, ancho: 3, alto: 4 }],
  ['prisma', { base: { tipo: 'triangulo', lado: 2 }, h: 5 }], ['cilindro', { r: 2, h: 3 }], ['cono', { r: 3, h: 4 }],
  ['piramide', { base: { tipo: 'cuadrado', lado: 6 }, h: 4 }], ['piramide', { base: { tipo: 'triangulo', lado: 3 }, h: 2 }], ['esfera', { r: 3 }],
];
test('GE1 y GE2: al ampliar por k (entero o racional), perímetro ×k, área ×k² y volumen ×k³', () => {
  for (const [tipo, d] of FIGURAS) for (const k of KS) {
    const r = motor.escalar(tipo, d, k);
    cerca(r.razon.lado, k, `${tipo} k=${k} lado`);
    if (r.razon.perimetro !== undefined) cerca(r.razon.perimetro, k, `${tipo} k=${k} perímetro`);
    cerca(r.razon.area, k * k, `${tipo} k=${k} área`);
    if (r.original.dimension === 3) cerca(r.razon.volumen, k * k * k, `${tipo} k=${k} volumen`);
    if (Math.abs(k - 1) > 1e-9) assert.ok(Math.abs(r.razon.area - r.errores.areaLineal / r.original.area) > 1e-6, 'el área no crece como el lado');
  }
});
test('ampliar dos veces es ampliar por el producto, y k = 1/2 deshace k = 2', () => {
  for (const [tipo, d] of FIGURAS) for (const a of [1 / 3, 2, 5 / 2]) for (const b of [3 / 4, 3]) {
    const una = motor.escalar(tipo, d, a), dos = motor.escalar(tipo, d, a * b);
    const otra = motor.escalar(tipo, Object.fromEntries(Object.entries(d).map(([c, v]) => [c, typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([q, w]) => [q, typeof w === 'number' ? w * a : w])) : v * a])), b);
    cerca(otra.escalada.area, dos.escalada.area, `${tipo} área compuesta`);
    if (una.original.dimension === 3) cerca(otra.escalada.volumen, dos.escalada.volumen, `${tipo} volumen compuesto`);
  }
  cerca(motor.escalar('cuadrado', { lado: 6 }, 0.5).escalada.area * 4, motor.figura('cuadrado', { lado: 6 }).area, 'k = 1/2');
});
test('segunMagnitud y maqueta: el factor es k, k² o k³, y la maqueta va y vuelve', () => {
  for (const k of KS) {
    cerca(motor.segunMagnitud(5, k, 'longitud').resultado, 5 * k, 'longitud');
    cerca(motor.segunMagnitud(5, k, 'area').resultado, 5 * k * k, 'área');
    cerca(motor.segunMagnitud(5, k, 'volumen').resultado, 5 * k ** 3, 'volumen');
  }
  for (const e of [10, 50, 200, 50000]) for (const m of ['longitud', 'area', 'volumen']) {
    const ida = motor.maqueta(e, 3, m), vuelta = motor.maqueta(e, ida.real, m, 'aMaqueta');
    cerca(vuelta.maqueta, 3, `1:${e} ${m}`);
  }
});
test('homotecia: conserva los ángulos, multiplica los lados por k y el área por k²; el centro no se mueve', () => {
  const figs = [motor.vertices('cuadrado', { lado: 3 }), motor.vertices('triangulo', { a: 4, b: 5, c: 7 }), motor.vertices('rectangulo', { base: 2, altura: 5 }),
    [[1, 2], [5, 1], [6, 4], [2, 6]]];
  for (const P of figs) for (const k of KS) for (const O of [[0, 0], [1, 1], [-2, 3], [10, -4]]) {
    const Q = motor.homotecia(P, O, k);
    cerca(motor.angulos(Q), motor.angulos(P), `ángulos k=${k}`, 1e-7);
    cerca(motor.lados(Q), motor.lados(P).map(l => l * k), `lados k=${k}`);
    cerca(motor.areaPoligono(Q), motor.areaPoligono(P) * k * k, `área k=${k}`);
    // cada punto queda en la recta que lo une con el centro, a k veces la distancia
    P.forEach((p, j) => { const q = Q[j]; cerca((q[0] - O[0]) * (p[1] - O[1]) - (q[1] - O[1]) * (p[0] - O[0]), 0, 'alineado'); });
    cerca(motor.homotecia([O], O, k)[0], O, 'centro fijo');
  }
});
test('los vértices de las figuras dan su área y su perímetro', () => {
  for (const [tipo, d] of [['cuadrado', { lado: 3 }], ['rectangulo', { base: 2, altura: 5 }], ['triangulo', { lado: 3 }], ['triangulo', { a: 3, b: 4, c: 5 }]]) {
    const v = motor.vertices(tipo, d), f = motor.figura(tipo, d);
    cerca(motor.areaPoligono(v), f.area, `${tipo} área`); cerca(motor.lados(v).reduce((s, x) => s + x, 0), f.perimetro, `${tipo} perímetro`);
  }
  cerca(motor.angulos(motor.vertices('triangulo', { lado: 2 })), [60, 60, 60], 'equilátero');
});
test('teselación: k² piezas de la figura chica que cubren la grande sin sobrar; las invertidas son k(k−1)/2', () => {
  for (let k = 1; k <= 12; k++) for (const tipo of ['cuadrado', 'triangulo']) {
    const t = motor.teselar(tipo, k), chica = motor.figura(tipo, { lado: 1 }), grande = motor.figura(tipo, { lado: k });
    assert.equal(t.total, k * k, `${tipo} k=${k}`);
    if (tipo === 'triangulo') { assert.equal(t.invertidos, k * (k - 1) / 2); assert.equal(t.derechos, k * (k + 1) / 2); }
    const suma = t.piezas.reduce((s, p) => s + motor.areaPoligono(p.vertices), 0);
    cerca(suma, grande.area, `${tipo} k=${k} las piezas cubren el área`);
    for (const p of t.piezas) cerca(motor.areaPoligono(p.vertices), chica.area, 'cada pieza es una copia');
    // cada pieza es semejante (igual) a la chica: mismos lados
    for (const p of t.piezas) cerca(motor.lados(p.vertices).sort(), motor.lados(motor.vertices(tipo, { lado: 1 })).sort(), 'lados de la pieza');
    // y todas quedan dentro de la grande
    const V = motor.vertices(tipo, { lado: k });
    for (const p of t.piezas) for (const [x, y] of p.vertices) for (let j = 0; j < V.length; j++) {
      const a = V[j], b = V[(j + 1) % V.length];
      assert.ok((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) >= -1e-9, 'pieza fuera');
    }
    assert.equal(motor.copias(tipo, k).contadas, k * k);
  }
});
test('GE13: en el cubo de n, cubitos con alguna cara afuera + escondidos = n³; en el dibujo asoman 3n² − 3n + 1', () => {
  for (let n = 1; n <= 15; n++) {
    const c = motor.cubitos(n);
    assert.equal(c.total, n ** 3); assert.equal(c.visibles + c.interior, c.total);
    if (n >= 2) assert.equal(c.visibles, n ** 3 - (n - 2) ** 3);
    assert.equal(c.visiblesDibujo, 3 * n * n - 3 * n + 1); assert.equal(c.carasDibujo, 3 * n * n);
    if (c.pintadas) assert.equal(c.pintadas[0] + c.pintadas[1] + c.pintadas[2] + c.pintadas[3], c.total);
    assert.equal(motor.copias('cubo', n).contadas, n ** 3);
  }
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) {
    const r = motor.bloque(a, b, c);
    assert.equal(r.total, a * b * c); assert.equal(r.visiblesDibujo + r.ocultosDibujo, r.total);
    if (r.pintadas) assert.equal(Object.values(r.pintadas).reduce((s, x) => s + x, 0), r.total);
    cerca(motor.figura('prisma', { largo: a, ancho: b, alto: c }).volumen, r.total, 'el volumen cuenta los cubitos');
  }
});
test('baldosas enteras: el cuadrado de lado n tiene n²; nunca más que el área', () => {
  for (let n = 1; n <= 12; n++) assert.equal(motor.baldosas('cuadrado', { lado: n }).enteras, n * n);
  for (const k of KS) for (const tipo of ['cuadrado', 'circulo', 'triangulo']) {
    const d = tipo === 'circulo' ? { r: 1.5 * k } : { lado: 3 * k }, b = motor.baldosas(tipo, d);
    assert.ok(b.enteras <= b.area + 1e-9 && b.pedazos >= -1e-9, `${tipo} k=${k}`);
  }
});
test('GE20: el cono es un tercio del cilindro de igual base y altura; la pirámide, un tercio del prisma', () => {
  for (const r of [0.5, 1, 3, 7]) for (const h of [1, 4, 9.5]) {
    const c = motor.conosParaLlenar(r, h);
    cerca(c.conos, 3, 'tres conos');
    cerca(motor.figura('cono', { r, h }).errores.sinTercio, motor.figura('cilindro', { r, h }).volumen, 'sin el tercio, cilindro');
    cerca(motor.figura('piramide', { base: { tipo: 'cuadrado', lado: r }, h }).volumen * 3, motor.figura('prisma', { base: { tipo: 'cuadrado', lado: r }, h }).volumen, 'pirámide');
  }
});
test('vertidos: el agua se conserva, los niveles solo suben (cilindro) o bajan (cono en cada vertido) y al final el cilindro está lleno', () => {
  for (const [r, h] of [[3, 4], [1, 10], [5, 2]]) {
    let antesCil = -1;
    for (let t = 0; t <= 3 + 1e-12; t += 0.05) {
      const v = motor.vertido(r, h, Math.min(3, t)), Vc = motor.figura('cono', { r, h }).volumen;
      cerca(v.enCono + v.enCilindro, (v.completos === 3 ? 3 : v.vertido) * Vc, `t=${t} agua total`);
      assert.ok(v.nivelCilindro >= antesCil - 1e-12, 'el cilindro solo sube'); antesCil = v.nivelCilindro;
      // el agua que queda en el cono es un cono semejante: su volumen es (nivel/h)³ del cono
      cerca(Vc * (v.nivelCono / h) ** 3, v.enCono, `t=${t} cono semejante`);
      cerca(v.radioAgua / r, v.nivelCono / h, 'el agua del cono es semejante');
      assert.ok(v.nivelCilindro <= h + 1e-9);
    }
    assert.equal(motor.vertido(r, h, 3).lleno, true);
    cerca(motor.vertido(r, h, 1).nivelCilindro, h / 3, 'un vertido: un tercio');
    cerca(motor.vertido(r, h, 2).nivelCilindro, 2 * h / 3, 'dos vertidos: dos tercios');
  }
});
test('¿y si fuera lineal?: la figura estirada tiene k veces el área, pero sus ángulos o sus proporciones cambian', () => {
  for (const k of KS.filter(k => Math.abs(k - 1) > 1e-9)) {
    const c = motor.siFueraLineal('cuadrado', { lado: 3 }, k);
    cerca(c.lineal.area, 9 * k, 'cuadrado: k veces el área'); assert.equal(c.lineal.semejante, false);
    assert.notEqual(Math.round(1e9 * c.lineal.base / c.lineal.altura), 1e9, 'ya no es un cuadrado');
    cerca(c.ladoParaArea ** 2, 9 * k, 'el cuadrado semejante con k veces el área tiene lado ×√k');
    cerca(c.razonAreaSemejante, k * k, 'la semejante tiene k² veces');
    const t = motor.siFueraLineal('triangulo', { lado: 3 }, k);
    cerca(t.lineal.area, motor.figura('triangulo', { lado: 3 }).area * k, 'triángulo: k veces');
    assert.ok(Math.abs(motor.angulos(t.lineal.vertices)[0] - 60) > 1e-6, 'los ángulos cambian');
    const ci = motor.siFueraLineal('circulo', { r: 1.5 }, k);
    cerca(ci.lineal.area, motor.figura('circulo', { r: 1.5 }).area * k, 'círculo: k veces'); assert.equal(ci.lineal.tipo, 'elipse');
  }
  assert.equal(motor.siFueraLineal('cuadrado', { lado: 3 }, 1).lineal.semejante, true);
});
test('fracciones para mostrar k', () => {
  assert.deepEqual(motor.fraccion(4 / 3), { num: 4, den: 3 }); assert.deepEqual(motor.fraccion(0.5), { num: 1, den: 2 });
  assert.deepEqual(motor.fraccion(3), { num: 3, den: 1 }); assert.equal(motor.fraccion(Math.SQRT2), null);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.figura('hexagono', { lado: 1 }), /desconocida/);
  assert.throws(() => motor.figura('cuadrado', { lado: 0 }), /mayor que cero/);
  assert.throws(() => motor.figura('cuadrado', {}), /número/);
  assert.throws(() => motor.figura('cuadrado', { lado: 'tres' }), /número/);
  assert.throws(() => motor.figura('triangulo', { a: 1, b: 2, c: 3 }), /no forman/);
  assert.throws(() => motor.figura('piramide', { base: { tipo: 'circulo', r: 1 }, h: 2 }), /cuadrado o un triángulo/);
  assert.throws(() => motor.figura('prisma', { base: { tipo: 'cubo', arista: 1 }, h: 2 }), /plana/);
  assert.throws(() => motor.escalar('cubo', { arista: 2 }, 0), /mayor que cero/);
  assert.throws(() => motor.escalar('cubo', { arista: 2 }, -2), /mayor que cero/);
  assert.throws(() => motor.homotecia([], [0, 0], 2), /faltan/);
  assert.throws(() => motor.homotecia([[0, 0]], [0], 2), /punto/);
  assert.throws(() => motor.homotecia([[0, 'a']], [0, 0], 2), /número/);
  assert.throws(() => motor.teselar('triangulo', 1.5), /entero/);
  assert.throws(() => motor.teselar('triangulo', 0), /al menos/);
  assert.throws(() => motor.teselar('circulo', 2), /teselar/);
  assert.throws(() => motor.cubitos(2.5), /entero/);
  assert.throws(() => motor.bloque(2, 0, 2), /al menos/);
  assert.throws(() => motor.segunMagnitud(2, 3, 'peso'), /desconocida/);
  assert.throws(() => motor.maqueta(0, 3, 'area'), /mayor que cero/);
  assert.throws(() => motor.maqueta(50, 3, 'area', 'alReves'), /sentido/);
  assert.throws(() => motor.vertido(3, 4, 3.5), /vertidos/);
  assert.throws(() => motor.vertido(3, 4, -1), /negativo/);
  assert.throws(() => motor.siFueraLineal('cubo', { arista: 2 }, 2), /planas/);
  assert.throws(() => motor.siFueraLineal('triangulo', { a: 3, b: 4, c: 5 }, 2), /equilátero/);
  assert.throws(() => motor.angulos([[0, 0], [1, 1]]), /3 vértices/);
  assert.throws(() => motor.copias('dodecaedro', 2), /desconocida/);
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
