// Pruebas del motor de «El espejo en la cuadrícula». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): reflejar dos veces devuelve el punto; H es el punto medio de PP'
//    y PP' es perpendicular a la recta; la reflexión conserva distancias e invierte el sentido de un triángulo, y la
//    simetría central lo conserva; dos reflexiones seguidas son la traslación o el giro que dice componer (cálculo
//    punto por punto); los ejes hallados dejan la figura encima de sí misma y ninguna otra recta por G lo hace;
//    un polígono regular de n lados tiene n ejes y centro solo si n es par; las figuras giradas conservan el
//    número de ejes; los planos de simetría del cubo son 9 y los de una caja de aristas distintas, 3.
// 3. Ningún error típico coincide con la respuesta correcta en las predicciones de la escena, con muchos parámetros.
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
// { fig: [...] } y { poli: [...] } en los argumentos se arman con el motor (convención de casos.json)
function resolver(a) {
  if (a && typeof a === 'object' && Array.isArray(a.fig)) { let f = motor.figura(...a.fig); if (a.girar) f = motor.girarFigura(f, a.girar); return f; }
  if (a && typeof a === 'object' && Array.isArray(a.poli)) return motor.poliedro(...a.poli);
  return a;
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args.map(resolver));
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'simetria');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const ent = (a, b) => Math.floor(al(a, b + 1));
const N = 300;
const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
const rectaAzar = () => {
  const k = ent(0, 4);
  if (k === 0) return { x: al(-5, 5) };
  if (k === 1) return { y: al(-5, 5) };
  if (k === 2) return { m: al(-3, 3), n: al(-5, 5) };
  if (k === 3) return { punto: { x: al(-5, 5), y: al(-5, 5) }, angulo: al(0, 180) };
  return { a: al(-4, 4) || 1, b: al(-4, 4) || 1, c: al(-5, 5) };
};
const pAzar = () => ({ x: al(-8, 8), y: al(-8, 8) });

test('reflejar: dos veces devuelve el punto; H es el punto medio de PP\' y está en la recta; PP\' es perpendicular', () => {
  for (let k = 0; k < N; k++) {
    const r = rectaAzar(), P = pAzar(), R = motor.recta(r), q = motor.reflejar(P, r);
    const P2 = motor.reflejar(q.P, r).P;
    cerca(P2.x, P.x, 'x', 1e-8); cerca(P2.y, P.y, 'y', 1e-8);
    cerca((P.x + q.P.x) / 2, q.H.x, 'medio x', 1e-8); cerca((P.y + q.P.y) / 2, q.H.y, 'medio y', 1e-8);
    cerca(R.a * q.H.x + R.b * q.H.y + R.c, 0, 'H en la recta', 1e-8);
    cerca((q.P.x - P.x) * R.dir.x + (q.P.y - P.y) * R.dir.y, 0, 'perpendicular', 1e-8);
    cerca(dist(P, q.P), 2 * q.d, 'PP\' = 2d', 1e-8);
    const m = motor.pliegue(P, r, 0.5); cerca(m.x, q.H.x, 'pliegue a la mitad', 1e-8);
  }
});
test('la reflexión conserva distancias e invierte el sentido; la simetría central y los giros lo conservan', () => {
  for (let k = 0; k < N; k++) {
    const T = [pAzar(), pAzar(), pAzar()];
    if (Math.abs(motor.areaConSigno(T)) < 0.5) continue;
    const r = rectaAzar(), Ti = motor.reflejarFigura(T, r), O = pAzar();
    cerca(dist(Ti[0], Ti[1]), dist(T[0], T[1]), 'lado', 1e-8);
    assert.notEqual(motor.orientacion(Ti), motor.orientacion(T), 'la reflexión invierte el sentido');
    const c = motor.centralTriangulo(T, O);
    assert.equal(c.sentido, c.sentidoOriginal, 'la central lo conserva');
    cerca(c.area, Math.abs(motor.areaConSigno(T)), 'área', 1e-8);
    c.puntos.forEach((P, i) => { cerca((P.x + T[i].x) / 2, O.x, 'O medio', 1e-8); cerca(motor.girar(T[i], O, 180).x, P.x, 'central = giro 180', 1e-8); });
    const giro = al(-360, 360);
    assert.equal(motor.orientacion(T.map(P => motor.girar(P, O, giro))), motor.orientacion(T));
  }
});
test('dos reflexiones: paralelas dan la traslación 2d; si se cortan, el giro 2θ alrededor del corte (punto por punto)', () => {
  for (let k = 0; k < N; k++) {
    const ang = al(0, 180), A = pAzar();
    const r1 = { punto: A, angulo: ang };
    const P = pAzar();
    // paralelas
    const d = al(0.5, 6), n = { x: -Math.sin(ang * Math.PI / 180), y: Math.cos(ang * Math.PI / 180) };
    const r2 = { punto: { x: A.x + d * n.x, y: A.y + d * n.y }, angulo: ang + (rnd() < 0.5 ? 180 : 0) };
    const c = motor.componer(r1, r2), Q = motor.aplicarDos(P, r1, r2);
    assert.equal(c.tipo, 'traslacion'); cerca(c.modulo, 2 * d, 'módulo', 1e-8);
    cerca(Q.x, P.x + c.vector.x, 'traslación x', 1e-8); cerca(Q.y, P.y + c.vector.y, 'traslación y', 1e-8);
    // se cortan
    const th = al(5, 85) * (rnd() < 0.5 ? -1 : 1), r3 = { punto: A, angulo: ang + th };
    const g = motor.componer(r1, r3), Q2 = motor.aplicarDos(P, r1, r3), G = motor.girar(P, g.centro, g.angulo);
    assert.equal(g.tipo, 'giro'); cerca(g.angulo, 2 * th, '2θ', 1e-8);
    cerca(Q2.x, G.x, 'giro x', 1e-7); cerca(Q2.y, G.y, 'giro y', 1e-7);
  }
});
test('simetrias: cada eje hallado deja la figura sobre sí misma; ninguna otra recta por G (cada grado) lo hace', () => {
  const figs = [['rectangulo', 6, 4], ['cuadrado', 3], ['rombo', 6, 4], ['romboide', 6, 3, 2], ['equilatero', 4], ['isosceles', 4, 5], ['escaleno'],
    ['trapecio', 6, 2, 3], ['trapecioRecto', 6, 3, 3], ['regular', 5], ['regular', 8]].concat(motor.LETRAS.map(l => ['letra', l]));
  for (const f of figs) {
    const fig = motor.figura(...f), s = motor.simetrias(fig);
    for (const e of s.ejes) assert.ok(motor.coincide(fig, e), `${f}: eje ${e.angulo}`);
    for (let a = 0; a < 180; a += 0.5) {
      const es = s.ejes.some(e => Math.abs(e.angulo - a) < 1e-6);
      if (!es) assert.equal(motor.coincide(fig, { punto: s.G, angulo: a }), false, `${f}: ${a}° no debería ser eje`);
    }
  }
});
test('polígono regular de n lados: n ejes, centro solo si n es par; girar o agrandar no cambia nada', () => {
  for (let n = 3; n <= 16; n++) {
    const p = motor.prediccionEjes(motor.figura('regular', n, al(1, 5)));
    assert.equal(p.ejes, n); assert.equal(p.centro, n % 2 === 0);
    const g = motor.prediccionEjes(motor.girarFigura(motor.figura('regular', n, 2), al(0, 360)));
    assert.equal(g.ejes, n);
  }
  for (let k = 0; k < 60; k++) {
    const b = ent(2, 9), h = ent(2, 9), giro = al(0, 360);
    const r = motor.prediccionEjes(motor.girarFigura(motor.figura('rectangulo', b, h), giro));
    assert.equal(r.ejes, b === h ? 4 : 2); assert.equal(r.centro, true);
  }
});
test('planos de simetría: cubo 9, caja de aristas distintas 3, prisma de base cuadrada 5; cada plano deja los vértices en su sitio', () => {
  for (let k = 0; k < 40; k++) {
    const a = ent(1, 6), b = a + ent(1, 3), c = b + ent(1, 3);
    assert.equal(motor.planos(motor.poliedro('cubo', a)).numPlanos, 9);
    assert.equal(motor.planos(motor.poliedro('caja', a, b, c)).numPlanos, 3);
    assert.equal(motor.planos(motor.poliedro('prismaCuadrado', a, c)).numPlanos, 5);
  }
  const cubo = motor.poliedro('cubo', 2), r = motor.planos(cubo);
  for (const pl of r.planos) {
    const sec = motor.seccion(cubo, pl);
    assert.ok(sec.length === 4, 'cada plano corta el cubo en un cuadrilátero');
    for (const P of sec) cerca(pl.normal.x * P.x + pl.normal.y * P.y + pl.normal.z * P.z, pl.d, 'en el plano', 1e-9);
  }
  const g = motor.girar3D({ x: 1, y: 0, z: 5 }, 90, { x: 0, y: 0, z: 0 }); cerca(g.x, 0, 'giro x'); cerca(g.y, 1, 'giro y'); cerca(g.z, 5, 'giro z');
  for (const pl of r.planos) for (const V of cubo.vertices) {
    const Q = motor.reflejarEnPlano(V, pl);
    assert.ok(cubo.vertices.some(X => Math.abs(X.x - Q.x) + Math.abs(X.y - Q.y) + Math.abs(X.z - Q.z) < 1e-9));
  }
});
test('quiralidad: un espejo cualquiera vuelve izquierda a la mano derecha; un giro no la cambia', () => {
  for (let k = 0; k < N; k++) {
    const n = { x: al(-1, 1), y: al(-1, 1), z: al(-1, 1) };
    if (Math.hypot(n.x, n.y, n.z) < 0.1) continue;
    const r = motor.manoEnEspejo({ pulgar: { x: 1, y: 0, z: 0 }, indice: { x: 0, y: 1, z: 0 }, medio: { x: 0, y: 0, z: 1 } }, { normal: n, d: al(-3, 3) });
    assert.equal(r.original, 'derecha'); assert.equal(r.imagen, 'izquierda'); assert.equal(r.trasGiro, 'izquierda');
  }
});

// 3. Ningún error típico coincide con la respuesta (predicciones de la escena, con muchos parámetros)
const mismo = (P, Q) => P && Q && Math.abs(P.x - Q.x) < 1e-9 && Math.abs(P.y - Q.y) < 1e-9;
test('ningún error típico coincide con la respuesta', () => {
  // paso 3: simétrico con coordenadas en una recta oblicua (que no sea y = x)
  for (let k = 0; k < N; k++) {
    const m = [1, 2, -1, -2, 0.5, -0.5][ent(0, 5)], n = ent(-4, 4), P = { x: ent(-6, 6), y: ent(-6, 6) };
    const r = motor.reflejar(P, { m, n });
    if (r.d < 1e-9) continue;
    if (m === 1 && n === 0) continue;
    for (const [e, Q] of Object.entries(r.errores)) assert.ok(!mismo(Q, r.P), `reflejar ${JSON.stringify(P)} en y = ${m}x + ${n}: ${e}`);
  }
  // la recta del paso 3
  const p3 = motor.reflejar({ x: 5, y: 1 }, { m: 1, n: 2 });
  for (const Q of Object.values(p3.errores)) assert.ok(!mismo(Q, p3.P));
  // pasos 1 y 7: la letra F, con cualquier tallo y espejo
  for (let k = 0; k < 50; k++) {
    const e = ent(-3, 3), b = motor.reflejoEfe({ espejo: e, tallo: e + ent(1, 4), alto: ent(3, 6), larga: ent(3, 4), corta: ent(1, 2) });
    for (const x of Object.values(b.errores)) assert.ok(!(x.apunta === b.apunta && x.larga === b.larga));
    assert.ok(new Set(Object.values(b.errores).map(x => x.apunta + x.larga)).size === 3, 'los tres errores son distintos');
  }
  // experimento 4: el simétrico de un punto respecto de un plano
  for (let k = 0; k < N; k++) {
    const P = { x: ent(1, 5), y: ent(1, 5), z: ent(1, 5) }, r = motor.simetricoEspacio(P, { normal: { x: 0, y: 0, z: 1 }, d: 0 });
    for (const Q of Object.values(r.errores)) assert.ok(!(Q.x === r.P.x && Q.y === r.P.y && Q.z === r.P.z));
  }
  // paso 4: el sentido del triángulo simétrico respecto de un punto
  for (let k = 0; k < N; k++) {
    const T = [pAzar(), pAzar(), pAzar()];
    if (Math.abs(motor.areaConSigno(T)) < 0.5) continue;
    const c = motor.centralTriangulo(T, pAzar());
    assert.notEqual(c.errores.comoReflexion.sentido, c.sentido); assert.notEqual(c.errores.invierteSentido.sentido, c.sentido);
  }
  // pasos 5 y 6 y experimentos 2 y 5: ejes de figuras
  const figs = [[['rectangulo', 6, 4]], [['cuadrado', 4], 45], [['romboide', 6, 3, 2]], [['regular', 7]], [['regular', 5]], [['regular', 9]]];
  for (const [f, g] of figs) {
    let fig = motor.figura(...f); if (g) fig = motor.girarFigura(fig, g);
    const p = motor.prediccionEjes(fig);
    const usados = f[0] === 'rectangulo' ? ['conDiagonales', 'soloVertical', 'ninguno'] : f[0] === 'cuadrado' ? ['soloRectos', 'dobleCuenta', 'ninguno'] : f[0] === 'romboide' ? ['conDiagonales'] : ['dobleCuenta', 'soloVertical', 'ninguno'];
    for (const u of usados) assert.notEqual(p.errores[u], p.ejes, `${f} ${u}`);
  }
  for (let b = 2; b <= 9; b++) for (let h = 2; h <= 9; h++) if (b !== h) assert.notEqual(motor.prediccionEjes(motor.figura('rectangulo', b, h)).errores.conDiagonales, 2);
  // pasos 7 y 8 y experimentos 1 y 3: composición y planos
  for (let k = 0; k < N; k++) {
    const d = ent(1, 9), c = motor.componer({ x: 0 }, { x: d });
    assert.notEqual(c.errores.sinDuplicar, c.modulo); assert.notEqual(c.errores.vuelveAlInicio, c.modulo);
    const th = ent(5, 85), g = motor.componer({ y: 0 }, { punto: { x: 0, y: 0 }, angulo: th });
    assert.notEqual(g.errores.sinDuplicar, g.angulo); assert.notEqual(g.errores.mitad, g.angulo);
  }
  const cubo = motor.prediccionPlanos(motor.poliedro('cubo', 2));
  for (const e of ['soloCaras', 'unoPorCara', 'unoPorArista']) assert.notEqual(cubo.errores[e], cubo.planos);
  for (let k = 0; k < 30; k++) {
    const a = ent(1, 5), b = a + ent(1, 3), c = b + ent(1, 3), p = motor.prediccionPlanos(motor.poliedro('caja', a, b, c));
    for (const e of ['comoCubo', 'unoPorCara', 'comoPrisma', 'unoPorArista']) assert.notEqual(p.errores[e], p.planos);
  }
  const mano = motor.manoEnEspejo({ pulgar: { x: 1, y: 0, z: 0 }, indice: { x: 0, y: 1, z: 0 }, medio: { x: 0, y: 0, z: 1 } }, { normal: { x: 0, y: 1, z: 0 }, d: 3 });
  for (const v of Object.values(mano.errores)) assert.notEqual(v, mano.imagen);
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.recta({ A: { x: 1, y: 1 }, B: { x: 1, y: 1 } }), /coinciden/);
  assert.throws(() => motor.recta({ a: 0, b: 0, c: 3 }), /no pueden ser los dos 0/);
  assert.throws(() => motor.recta({ z: 3 }), /no se reconoce/);
  assert.throws(() => motor.reflejar({ x: '1', y: 2 }, { x: 0 }), /número/);
  assert.throws(() => motor.areaConSigno([{ x: 0, y: 0 }, { x: 1, y: 1 }]), /tres puntos/);
  assert.throws(() => motor.figura('estrella'), /desconocida/);
  assert.throws(() => motor.figura('regular', 2), /entero de 3 o más/);
  assert.throws(() => motor.figura('letra', 'Q'), /no hay letra/);
  assert.throws(() => motor.simetrias({}), /segmentos/);
  assert.throws(() => motor.poliedro('dodecaedro'), /desconocido/);
  assert.throws(() => motor.planos({ vertices: [{ x: 0, y: 0, z: 0 }] }), /cuatro vértices/);
  assert.throws(() => motor.quiralidad({ x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }), /mismo plano/);
  assert.throws(() => motor.reflejoEfe({ espejo: 3, tallo: 2 }), /derecha del espejo/);
  assert.throws(() => motor.efe({ larga: 1, corta: 2 }), /larga > corta/);
  assert.throws(() => motor.poliedro('prismaRegular', 2, 1, 1), /entero de 3 o más/);
  assert.throws(() => motor.reflejarEnPlano({ x: 1, y: 1, z: 1 }, { normal: { x: 0, y: 0, z: 0 } }), /cero/);
  assert.equal(motor.componer({ x: 2 }, { x: 2 }).tipo, 'identidad');
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
