// Pruebas del motor de «El tablero que se parte en piezas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: las particiones en dos piezas tienen piezas conexas y congruentes, con perímetro m + n + corte, y
//    piezas() las reconoce al cortar por su borde común; partirDos y partirEn(…, 2) dan lo mismo; la escalera rearma un
//    cuadrado de área W·H; las tiras también; en ubicaciones, las 8 isometrías cuentan cada ubicación 8/orientaciones
//    veces; el marco por fórmula = contado casilla por casilla; los triángulos con puntos son C(n, 3) − Σ C(k, 3) por
//    recta; sin sombra, los cuadrados son Σ (m − k + 1)(n − k + 1); la fracción del triángulo no cambia con los lados
//    del rectángulo; en la S, el perímetro no depende de M.
// 3. Ningún error típico coincide con la respuesta en las predicciones de la escena, y las opciones son distintas.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  if (espera === null || typeof espera !== 'object' || Array.isArray(espera)) { cerca(r, espera, que); return; }
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'cuadricula-piezas');
  assert.equal(typeof datos.verificacion, 'string');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera !== undefined, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const k = q => q[0] + ',' + q[1];
function bordeComun(A) {
  const s = new Set(A.map(k)), out = [];
  for (const [f, c] of A) {
    if (!s.has(k([f, c + 1]))) out.push([c + 1, f, c + 1, f + 1]);
    if (!s.has(k([f, c - 1]))) out.push([c, f, c, f + 1]);
    if (!s.has(k([f + 1, c]))) out.push([c, f + 1, c + 1, f + 1]);
    if (!s.has(k([f - 1, c]))) out.push([c, f, c + 1, f]);
  }
  return out;
}
test('partirDos: piezas conexas, congruentes, con perímetro m + n + corte; piezas() las reconoce', () => {
  for (const [m, n] of [[2, 2], [2, 3], [2, 4], [3, 4], [4, 4], [2, 6], [3, 6], [4, 5]]) {
    const r = motor.partirDos(m, n);
    const vistas = new Set();
    for (const p of r.lista) {
      assert.ok(motor.conexa(p.A) && motor.conexa(p.B));
      assert.ok(motor.congruentes(p.A, p.B).es);
      assert.equal(p.A.length + p.B.length, m * n);
      assert.equal(p.perimetro, m + n + p.corte);
      assert.equal(motor.perimetro(p.B), p.perimetro);
      const cortes = bordeComun(p.A).filter(([x1, y1, x2, y2]) => !(x1 === x2 && (x1 === 0 || x1 === n)) && !(y1 === y2 && (y1 === 0 || y1 === m)));
      const q = motor.piezas(m, n, cortes);
      assert.equal(q.total, 2); assert.ok(q.congruentes); assert.deepEqual(q.perimetros, [p.perimetro, p.perimetro]);
      assert.equal(q.cortesUsados, p.corte);
      const cl = p.A.map(k).sort().join(' ');
      assert.ok(!vistas.has(cl)); vistas.add(cl);
    }
    assert.equal(motor.partirEn([m, n], 2).total, r.total, `${m} × ${n}`);
    // el corte recto por la mitad, si existe, está entre las particiones y es el de menor perímetro
    if (r.recto !== null) assert.equal(r.minimo, r.recto);
  }
});
test('partirEn: cada partición cubre la región sin solapes con piezas congruentes', () => {
  for (const [reg, kk] of [[motor.regionL(2), 4], [[3, 4], 4], [[3, 4], 3], [[2, 6], 3], [[4, 4], 4]]) {
    const r = motor.partirEn(reg, kk), N = Array.isArray(reg[0]) ? reg.length : reg[0] * reg[1];
    assert.ok(r.total > 0);
    for (const t of r.lista) {
      assert.equal(t.length, kk);
      const todas = t.flat(); assert.equal(new Set(todas.map(k)).size, N);
      for (const p of t) { assert.ok(motor.conexa(p)); assert.ok(motor.congruentes(t[0], p).es); }
    }
    assert.equal(r.formas.reduce((s, f) => s + f.maneras, 0), r.total);
  }
});
test('escalera y tiras: rearman un cuadrado del mismo área', () => {
  for (let kk = 1; kk <= 4; kk++) for (let t = 1; t <= 2; t++) {
    const W = (kk + 1) * (kk + 1) * t, H = kk * kk * t, e = motor.escalera(W, H);
    assert.ok(e.posible && e.encaja, `${W} × ${H}`);
    assert.equal(e.lado * e.lado, W * H);
    assert.equal(e.A.length + e.B.length, W * H);
    const rr = motor.rearmar(e.cuadrado); assert.ok(rr.esCuadrado); assert.equal(rr.alto, e.lado);
    // el corte separa A de B: piezas() con esos tramos da exactamente A y B
    const q = motor.piezas(H, W, e.corte); assert.equal(q.total, 2); assert.equal(q.cortesUsados, e.corte.length);
    assert.ok(motor.congruentes(e.A, e.B).es, 'los dos trozos de la escalera son iguales');
    const tr = motor.tiras(W, H);
    if (tr.posible) { assert.ok(tr.encaja); assert.ok(tr.trozos > e.trozos || kk === 1); }
  }
  assert.equal(motor.escalera(12, 5).posible, false);
});
test('ubicaciones: las 8 isometrías cuentan cada ubicación 8/orientaciones veces', () => {
  const formas = [[[0,0]], [[0,0],[0,1]], [[0,0],[1,0],[1,1]], [[0,0],[1,0],[2,0],[2,1]], [[0,0],[0,1],[0,2],[1,1]], [[0,0],[0,1],[1,1],[1,2]], [[0,0],[0,1],[1,0],[1,1]], [[0,0],[1,0],[1,1],[2,1],[2,2]]];
  for (const p of formas) for (const [m, n] of [[3, 3], [3, 4], [4, 4], [2, 5]]) {
    const u = motor.ubicaciones(p, [m, n]);
    assert.equal(u.errores.ochoVeces, u.total * 8 / u.orientaciones);
    assert.ok(u.errores.comoDibujo <= u.errores.soloGiros && u.errores.soloGiros <= u.total);
    assert.equal(new Set(u.lista.map(x => x.celdas.map(k).sort().join(' '))).size, u.total);
  }
});
test('marco: fórmula = conteo; triángulos: C(n, 3) − Σ C(k, 3); cuadrados sin sombra', () => {
  for (let m = 2; m <= 9; m++) for (let n = 2; n <= 9; n++) for (let g = 1; 2 * g <= Math.min(m, n); g++) {
    const b = motor.casillasBorde(m, n, g); assert.equal(b.total, b.formula); assert.equal(b.errores.esquinasDosVeces - b.total, 4 * g * g);
  }
  for (const pts of [motor.red(3, 3), motor.red(3, 4), motor.red(4, 4), motor.dosRectas(4, 3), motor.dosRectas(5, 5), [[0,0],[1,1],[2,2],[3,3],[0,3],[3,0]]]) {
    const t = motor.triangulosPuntos(pts);
    assert.equal(t.total, motor.C(pts.length, 3) - t.rectas.reduce((s, x) => s + motor.C(x, 3), 0));
    assert.equal(t.total + t.alineadas, t.ternas);
  }
  for (let m = 1; m <= 6; m++) for (let n = 1; n <= 6; n++) {
    let s = 0; for (let kk = 1; kk <= Math.min(m, n); kk++) s += (m - kk + 1) * (n - kk + 1);
    const r = motor.cuadradosLibres(m, n, []); assert.equal(r.total, s); assert.equal(r.todos, s);
  }
  // diagonal: un cuadrado k × k es libre si sus filas y sus columnas no se cruzan
  for (let t = 1; t <= 8; t++) {
    let s = 0;
    for (let kk = 1; kk <= t; kk++) for (let f = 0; f + kk <= t; f++) for (let c = 0; c + kk <= t; c++) if (c >= f + kk || f >= c + kk) s++;
    assert.equal(motor.diagonal(t).total, s);
  }
});
test('fracción y arcos: no dependen de las medidas', () => {
  const rnd = motor.azar(2026);
  const nombres = ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'DA', 'O'];
  for (let i = 0; i < 200; i++) {
    const W = 1 + Math.floor(rnd() * 20), H = 1 + Math.floor(rnd() * 20);
    const [P, Q, R] = [0, 1, 2].map(() => nombres[Math.floor(rnd() * 9)]);
    if (new Set([P, Q, R]).size < 3) continue;
    const t = motor.trianguloEn(W, H, P, Q, R), f = motor.fraccionTriangulo(P, Q, R);
    assert.ok(Math.abs(t.area / t.total - f.num / f.den) < 1e-12);
    if (f.sobrantes) assert.ok(Math.abs(f.sobrantes.reduce((s, x) => s + x.valor, 0) + f.valor - 1) < 1e-12);
  }
  for (let am = 1; am < 10; am++) { const s = motor.curvaS(10, am); assert.equal(s.zonas[0].b, 10); assert.equal(s.zonas[0].a, 0); }
  for (let am = 1; am < 8; am++) { const z = motor.arcosZonas(8, am); assert.equal(z.suma.a, 8); assert.equal(z.suma.b, 4 + am); }
});
test('isometrías: las 8 conservan la pieza y su perímetro; congruentes es simétrica', () => {
  const p = [[0,0],[1,0],[2,0],[2,1],[1,2]].filter(q => q[1] < 2).concat([[1, 1]]);
  for (const x of motor.isometrias(p)) { assert.equal(motor.perimetro(x.celdas), motor.perimetro(p)); assert.ok(motor.congruentes(x.celdas, p).es); assert.ok(motor.congruentes(p, x.celdas).es); }
  assert.equal(motor.congruentes([[0,0],[0,1]], [[0,0],[1,0],[1,1]]).es, false);
});

// 3. Las predicciones de la escena: errores distintos de la respuesta y opciones distintas
test('predicciones: ningún distractor coincide con la respuesta', () => {
  const distintos = (xs, que) => assert.equal(new Set(xs.map(String)).size, xs.length, `${que}: opciones repetidas ${xs}`);
  const d1 = motor.partirDos(4, 4); distintos([d1.maximo, d1.errores.corteRecto, d1.errores.segundo, d1.errores.mitadTablero], 'paso 1');
  const d2 = motor.partirEn(motor.regionL(2), 4, 15), per = motor.perimetro(motor.regionL(2));
  distintos([d2.formas[0].metros, per / 4 * 15, 3 * 4 * 15, 3 * 15], 'paso 2');
  const e = motor.escalera(16, 9); distintos([e.lado, e.errores.mismoPerimetro, e.errores.cuartoDelArea, 16 + 9], 'paso 3');
  distintos([e.trozos, 3, e.errores.tiras, 'no'], 'paso 4');
  const en = motor.escaleraEnchape(4, 0.3, 0.2, 1, 50); distintos([en.costo, en.errores.sinCostados, en.errores.unCostado, en.errores.costadoRectangulo], 'paso 5');
  const z = motor.arcosZonas(8, 4); distintos([z.suma, z.errores.compartidoUnaVez, z.errores.sinRectos, z.errores.sinRectosNiCompartido].map(x => x.a + '+' + x.b), 'paso 6');
  const f = motor.fraccionTriangulo('A', 'BC', 'CD'); distintos([f, f.errores.olvidaUna, f.errores.todasIguales, f.errores.loQueSobra].map(x => x.num + '/' + x.den), 'paso 7');
  const u = motor.ubicaciones([[0,0],[1,0],[2,0],[2,1]], [3, 3]); distintos([u.total, u.errores.comoDibujo, u.errores.soloGiros, u.errores.marcos], 'paso 8');
  const t = motor.triangulosPuntos(motor.dosRectas(4, 3)); distintos([t.total, t.errores.sinRestar, t.errores.unaPorRecta, t.errores.conOrden], 'paso 9');
  const s = motor.diagonal(5); distintos([s.total, s.errores.patronDoble, s.errores.todos, s.errores.soloCasillas], 'paso 10');
  const b = motor.casillasBorde(7, 9, 2); distintos([b.total, b.errores.esquinasDosVeces, b.errores.sinEsquinas, b.errores.anillosIguales], 'exp 1');
  const ut = motor.ubicaciones([[0,0],[0,1],[0,2],[1,1]], [3, 4]); distintos([ut.total, ut.errores.ochoVeces, ut.errores.comoDibujo, ut.errores.marcos], 'exp 2');
  const cs = motor.curvaS(10, 6); distintos([cs.suma.b, cs.errores.compartidoUnaVez.b, 10, 16], 'exp 3');
  const r = motor.triangulosPuntos(motor.red(3, 3)); distintos([r.total, r.errores.sinRestar, r.errores.soloFilasColumnas, r.errores.conOrden], 'exp 4');
  const d5 = motor.partirDos(3, 6); distintos([d5.maximo, d5.errores.corteRecto, d5.errores.segundo, d5.errores.mitadTablero], 'exp 5');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.partirDos(3, 3));
  assert.throws(() => motor.partirDos(5, 5));
  assert.throws(() => motor.partirDos(6, 4));
  assert.throws(() => motor.piezas(3, 3, [[0, 0, 2, 0]]));
  assert.throws(() => motor.piezas(0, 3, []));
  assert.throws(() => motor.partirEn([3, 3], 2));
  assert.throws(() => motor.normalizar([[0, 0], [0, 0]]));
  assert.throws(() => motor.normalizar([]));
  assert.throws(() => motor.arcosZonas(8, 8));
  assert.throws(() => motor.fraccionTriangulo('A', 'A', 'B'));
  assert.throws(() => motor.fraccionTriangulo('A', 'X', 'B'));
  assert.throws(() => motor.triangulosPuntos([[0, 0], [1, 1]]));
  assert.throws(() => motor.triangulosPuntos([[0, 0], [1, 1], [0, 0]]));
  assert.throws(() => motor.casillasBorde(4, 4, 3));
  assert.throws(() => motor.cuadradosLibres(3, 3, [[3, 0]]));
  assert.throws(() => motor.escaleraEnchape(0, 1, 1, 1));
  assert.throws(() => motor.areaPiezas([{ tipo: 'circulo', r: 1 }]));
});

// 5. papel.json
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length >= 2 && p.verificar.length);
});
for (const p of papel.problemas) test('papel ' + p.id, () => { for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id); });
