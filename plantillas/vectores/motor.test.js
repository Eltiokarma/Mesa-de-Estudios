// Pruebas del motor de «Flechas que se suman». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con vectores al azar (semilla fija): la ley de cosenos da lo mismo que la suma por
//    componentes; |a − b| ≤ R ≤ a + b; R baja siempre al abrir θ de 0° a 180°; la suma es conmutativa y
//    asociativa (polígono = paralelogramo); las componentes cumplen Pitágoras; el unitario mide 1; el producto
//    escalar es |u||v|cos θ y el vectorial es perpendicular a los dos; los notables 37° y 53° son aproximados
//    (menos de 0,3 % de error); la homogeneidad y el despeje de exponentes con fórmulas armadas al azar.
//    0.2.0: división con m = n da el punto medio y pesos cruzados; el baricentro a 2/3 de cada mediana; MN del
//    trapecio es la semidiferencia; una figura con k caminos da k·c; un ciclo cerrado de aristas de una caja suma 0;
//    el θ del inverso cumple |a + b| = k|a − b|; girar los ejes no cambia módulos; sombra² + (área/|v|)² = |u|²; el
//    vector de módulo dado y los dos sentidos.
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
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
    // las claves de los pares del hexágono llevan un «+»: se buscan enteras
    const x = k.startsWith('pares.') ? campo(r.pares[k.split('.')[1]], k.split('.').slice(2).join('.')) : campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'vectores');
  assert.ok(datos.casos.length >= 30 && datos.casos.length <= 45);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const V = () => ({ x: al(-20, 20), y: al(-20, 20) });
const N = 400;

test('ley de cosenos = suma por componentes, con cualquier ángulo (exacto y con notables)', () => {
  for (let k = 0; k < N; k++) {
    const a = al(0, 30), b = al(0, 30), th = al(-400, 400);
    const r = motor.resultante(a, b, th, { exacto: true });
    const u = motor.vector(a, 0), v = motor.vector(b, th, { exacto: true });
    const s = motor.suma([u, v]);
    cerca(r.R, s.modulo, 'R', 1e-8); cerca(r.porComponentes, r.R, 'componentes', 1e-8);
    // los errores típicos dan otra cosa salvo en los casos límite
    assert.ok(r.errores.sumaModulos >= r.R - 1e-9, 'la suma de módulos es la cota de arriba');
    assert.ok(r.errores.restaModulos <= r.R + 1e-9, 'la resta de módulos es la cota de abajo');
    // el signo menos de la ley de cosenos es la resultante de a y −b
    cerca(r.errores.cosenoMenos, motor.resultante(a, b, th + 180, { exacto: true }).R, 'cosenoMenos = |a − b|', 1e-8);
  }
  for (const th of [37, 53, 127, 143, 217, 233, 307, 323]) {
    const r = motor.resultante(5, 5, th), s = motor.suma([motor.vector(5, 0), motor.vector(5, th)]);
    cerca(r.R, s.modulo, `notable ${th}`);
  }
});
test('|a − b| ≤ R ≤ a + b; R baja siempre al abrir θ de 0° a 180° y no es mínima en 90°', () => {
  for (let k = 0; k < N; k++) {
    const a = al(0.1, 30), b = al(0.1, 30), g = motor.rango(a, b), r = motor.resultante(a, b, al(0, 360), { exacto: true }).R;
    assert.ok(r >= g.minimo - 1e-9 && r <= g.maximo + 1e-9, `R = ${r} fuera de [${g.minimo}, ${g.maximo}]`);
    cerca(motor.resultante(a, b, 0).R, g.maximo, 'máximo'); cerca(motor.resultante(a, b, 180).R, g.minimo, 'mínimo', 1e-8);
    cerca(motor.resultante(a, b, 90).R, g.perpendicular, 'perpendicular');
    const bar = motor.barrido(a, b, 36);
    assert.ok(bar.decrece, 'R baja siempre'); assert.ok(bar.R90 > g.minimo, 'en 90° no está el mínimo');
  }
  // dos vectores iguales con 120°: la resultante mide lo mismo que cada uno; con 180°, cero
  for (let k = 0; k < 50; k++) { const a = al(0.1, 30); cerca(motor.resultante(a, a, 120).R, a, '120°'); cerca(motor.resultante(a, a, 180).R, 0, '180°', 1e-7); }
});
test('polígono = paralelogramo: la suma es conmutativa y asociativa; la resta es sumar el opuesto', () => {
  for (let k = 0; k < N; k++) {
    const u = V(), v = V(), w = V();
    const s1 = motor.suma([u, v]), s2 = motor.suma([v, u]);
    cerca(s1.x, s2.x, 'x'); cerca(s1.y, s2.y, 'y');
    const t1 = motor.suma([motor.suma([u, v]), w]), t2 = motor.suma([u, motor.suma([v, w])]), t3 = motor.suma([u, v, w]);
    cerca(t1.x, t3.x, 'asociativa x', 1e-8); cerca(t2.y, t3.y, 'asociativa y', 1e-8);
    // la última punta del polígono es la resultante
    const p = t3.puntas[t3.puntas.length - 1]; cerca(p.x, t3.x, 'punta', 1e-8);
    // u + v + (−u − v) = 0: polígono cerrado
    assert.ok(motor.suma([u, v, { x: -u.x - v.x, y: -u.y - v.y }]).cerrado, 'cerrado');
    const d = motor.resta(u, v); cerca(d.x, u.x - v.x, 'resta x'); cerca(motor.suma([d, v]).y, u.y, 'resta + v = u', 1e-8);
    assert.ok(t3.errores.sumaModulos >= t3.modulo - 1e-9, 'desigualdad triangular');
  }
});
test('componentes: Pitágoras, cos para x y sen para y; los notables 37° y 53° se equivocan en menos de 0,3 %', () => {
  for (let k = 0; k < N; k++) {
    const m = al(0, 50), th = al(-720, 720), c = motor.componentes(m, th, { exacto: true });
    cerca(Math.hypot(c.x, c.y), m, 'Pitágoras', 1e-8);
    const p = motor.polar(c);
    if (m > 1e-6) cerca(Math.cos((p.angulo - th) * Math.PI / 180), 1, 'mismo ángulo', 1e-8);
    cerca(c.errores.cambiados.x, Math.abs(c.y) < 1e-12 ? 0 : m * Math.sin(th * Math.PI / 180), 'cambiados', 1e-7);
  }
  for (const th of [37, 53, 127, 143, 217, 233, 307, 323]) {
    const n = motor.trig(th), e = motor.trig(th, { exacto: true });
    assert.ok(n.notable && !e.notable);
    cerca(n.cos * n.cos + n.sen * n.sen, 1, `${th}: sen² + cos² = 1`);
    assert.ok(Math.abs(n.sen - e.sen) < 0.003 && Math.abs(n.cos - e.cos) < 0.003, `${th}: aproximación`);
    assert.equal(Math.sign(n.sen), Math.sign(e.sen)); assert.equal(Math.sign(n.cos), Math.sign(e.cos));
  }
  for (const th of [0, 90, 180, 270, 360, -90]) { const t = motor.trig(th); assert.ok(Number.isInteger(t.cos) && Number.isInteger(t.sen), `${th}: exacto`); }
});
test('unitario: mide 1, apunta igual y los errores no miden 1', () => {
  for (let k = 0; k < N; k++) {
    const v = V(), u = motor.unitario(v), m = Math.hypot(v.x, v.y);
    cerca(Math.hypot(u.x, u.y), 1, 'módulo 1'); cerca(u.x * m, v.x, 'x', 1e-8); cerca(motor.anguloEntre(u, v), 0, 'misma dirección', 1e-5);
    if (Math.abs(v.x) > 0.1 && Math.abs(v.y) > 0.1) assert.ok(u.errores.moduloEntreSuma < 1, 'dividir entre la suma da menos de 1');
  }
});
test('producto escalar = |u||v|cos θ; el vectorial es perpendicular a los dos y mide |u||v|sen θ', () => {
  for (let k = 0; k < N; k++) {
    const u = { x: al(-9, 9), y: al(-9, 9), z: al(-9, 9) }, v = { x: al(-9, 9), y: al(-9, 9), z: al(-9, 9) };
    const mu = Math.hypot(u.x, u.y, u.z), mv = Math.hypot(v.x, v.y, v.z), th = motor.anguloEntre(u, v) * Math.PI / 180;
    cerca(motor.escalar(u, v), mu * mv * Math.cos(th), 'escalar', 1e-7);
    const w = motor.vectorial(u, v);
    cerca(motor.escalar(w, u), 0, 'w ⊥ u', 1e-7); cerca(motor.escalar(w, v), 0, 'w ⊥ v', 1e-7);
    cerca(w.modulo, mu * mv * Math.sin(th), '|u × v|', 1e-7);
    const w2 = motor.vectorial(v, u); cerca(w2.z, -w.z, 'anticonmutativo', 1e-9);
  }
});
test('hexágono: la suma desde un vértice es siempre 3 veces la diagonal mayor (6 lados)', () => {
  for (let k = 0; k < 100; k++) {
    const L = al(0.1, 40), h = motor.hexagono(L);
    cerca(h.modulo, 6 * L, '6L'); cerca(h.enDiagonales, 3, '3·AD'); cerca(h.y, 0, 'sobre AD', 1e-8);
    for (const n of ['B', 'C', 'D', 'E', 'F']) cerca(Math.hypot(h.vertices[n].x, h.vertices[n].y), L, `radio ${n}`);
    cerca(h.errores.sumaModulos, (4 + 2 * Math.sqrt(3)) * L, 'suma de módulos');
  }
});
test('análisis dimensional: homogeneidad, constantes y exponentes con fórmulas al azar', () => {
  const B = ['M', 'L', 'T'];
  const dAzar = () => { const d = {}; for (const b of B) d[b] = Math.floor(al(-3, 4)); return d; };
  for (let k = 0; k < N; k++) {
    const d1 = dAzar(), d2 = dAzar();
    assert.ok(motor.iguales(motor.cociente(motor.producto(d1, d2), d2), d1), 'producto y cociente');
    assert.ok(motor.homogenea([d1, d1, motor.producto(d1, {})]).homogenea);
    // constante: K·f debe pesar lo mismo que el miembro
    const c = motor.constante(d1, [{ dim: d2, exp: 2 }]);
    assert.ok(motor.iguales(motor.producto(c.dimension, motor.potencia(d2, 2)), d1), 'K·f² = miembro');
    // exponentes: se arma miembro = A^α·B^β·C^γ con exponentes conocidos y el motor los recupera
    const fs = [{ nombre: 'α', dim: dAzar() }, { nombre: 'β', dim: dAzar() }, { nombre: 'γ', dim: dAzar() }];
    const e = [Math.floor(al(-3, 4)) / 2, Math.floor(al(-3, 4)), Math.floor(al(-3, 4))];
    const m = motor.producto({}, ...fs.map((f, i) => motor.potencia(f.dim, e[i])));
    const r = motor.exponentes(m, fs);
    assert.ok(r.compatible, 'siempre hay solución (se armó con una)');
    if (r.unica) fs.forEach((f, i) => cerca(r.exponentes[f.nombre], e[i], f.nombre, 1e-9));
  }
  // un número o un ángulo no cambian la dimensión
  assert.ok(motor.iguales(motor.producto('fuerza', 'angulo', 'numero'), 'fuerza'));
  // dos fórmulas que no se pueden resolver de una sola forma
  assert.equal(motor.exponentes({ L: 1 }, [{ nombre: 'α', dim: 'longitud' }, { nombre: 'β', dim: 'area' }]).unica, false);
  assert.equal(motor.exponentes({ M: 1 }, [{ nombre: 'α', dim: 'longitud' }]).compatible, false);
  // las siete fundamentales del SI
  assert.equal(Object.values(motor.MAGNITUDES).filter(m => m.fundamental).length, 7);
});

// 2b. Propiedades de la 0.2.0 (figuras, sólidos y componentes)
const ent = (a, b) => Math.floor(al(a, b + 1));
const P2 = () => ({ x: ent(-9, 9), y: ent(-9, 9) });
test('división: con m = n da el punto medio; los pesos suman 1, son cruzados y P queda sobre AB con AP : PB = m : n', () => {
  for (let k = 0; k < N; k++) {
    const A = V(), B = V(), m = al(0.1, 9), n = al(0.1, 9), d = motor.division(A, B, m, n);
    cerca(d.pesoA + d.pesoB, 1, 'pesos'); cerca(d.pesoA, n / (m + n), 'cruzado');
    cerca(d.AP / (d.AP + d.PB), m / (m + n), 'razón', 1e-7);
    cerca(d.AP + d.PB, Math.hypot(B.x - A.x, B.y - A.y), 'sobre el segmento', 1e-7);
    const e = motor.division(A, B, m, m); cerca(e.x, (A.x + B.x) / 2, 'medio x'); cerca(e.y, (A.y + B.y) / 2, 'medio y');
    cerca(e.errores.derechos.x, e.x, 'con m = n los derechos coinciden');
    const r = motor.division(A, B, n, m); cerca(d.errores.derechos.x, r.x, 'derechos = la razón al revés', 1e-8);
  }
});
test('baricentro: está a 2/3 de cada mediana y GP + GQ + GR = 0', () => {
  for (let k = 0; k < N; k++) {
    const P = V(), Q = V(), R = V();
    if (Math.abs((Q.x - P.x) * (R.y - P.y) - (Q.y - P.y) * (R.x - P.x)) < 1) continue;
    const g = motor.baricentro(P, Q, R), g2 = motor.baricentro(Q, R, P), g3 = motor.baricentro(R, P, Q);
    cerca(g.fraccion, 2 / 3, 'PG/PM'); cerca(g2.x, g.x, 'la misma G'); cerca(g3.y, g.y, 'la misma G');
    cerca(P.x - g.x + Q.x - g.x + R.x - g.x, 0, 'suma x', 1e-8);
    cerca(g.errores.invertido.x, P.x + g.mediana.x / 3, 'un tercio', 1e-8);
  }
});
test('trapecio: MN es paralelo a las bases y mide la semidiferencia; la base media mide la semisuma', () => {
  for (let k = 0; k < N; k++) {
    const A = P2(), u = { x: ent(1, 6), y: ent(-3, 3) }, l1 = ent(2, 5), l2 = ent(1, 4), h = { x: ent(-3, 3), y: ent(1, 5) };
    const B = { x: A.x + l1 * u.x, y: A.y + l1 * u.y }, D = { x: A.x + h.x, y: A.y + h.y }, C = { x: D.x + l2 * u.x, y: D.y + l2 * u.y };
    const t = motor.trapecio(A, B, C, D);
    cerca(t.MN.modulo, Math.abs(l1 - l2) * Math.hypot(u.x, u.y) / 2, '|MN|', 1e-8);
    cerca(t.MN.x * u.y - t.MN.y * u.x, 0, 'paralelo', 1e-8);
    cerca(t.mediana.modulo, (l1 + l2) * Math.hypot(u.x, u.y) / 2, 'semisuma', 1e-8);
    // los puntos medios de los lados no paralelos dan la semisuma
    const P = { x: (A.x + D.x) / 2, y: (A.y + D.y) / 2 }, Q = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
    cerca(Q.x - P.x, t.mediana.x, 'base media x', 1e-8);
  }
});
test('reducción: una figura armada con k caminos de la cola a la punta del marcado da R = k·c', () => {
  for (let k = 0; k < 150; k++) {
    const caminos = ent(1, 4), Q = [ent(2, 9), ent(-3, 3)], puntos = { P: [0, 0], Q }, vectores = [['P', 'Q']];
    let id = 0;
    for (let c = 0; c < caminos; c++) {
      const largo = ent(1, 3); let ant = 'P';
      for (let j = 0; j < largo; j++) { const n = 'X' + (id++); puntos[n] = [ent(-9, 9), ent(-9, 9)]; vectores.push([ant, n]); ant = n; }
      vectores.push([ant, 'Q']);
    }
    const r = motor.reduccion({ puntos, vectores, marcado: ['P', 'Q'] });
    assert.equal(r.k, caminos + 1); cerca(r.modulo, (caminos + 1) * Math.hypot(Q[0], Q[1]), '|R|', 1e-8);
    assert.equal(r.grupos.length, caminos + 1); assert.equal(r.sobran.length, 0);
    for (const g of r.grupos) { const s = motor.suma(g.vectores.map(i => r.vectores[i])); cerca(s.x, Q[0], 'cada camino vale c', 1e-8); }
    cerca(r.errores.masUno - r.errores.menosUno, 2 * r.c.modulo, 'k ± 1');
  }
});
test('sólidos: un ciclo cerrado de aristas suma 0; las aristas paralelas son el mismo vector; tres aristas desde un vértice dan la diagonal', () => {
  for (let k = 0; k < 150; k++) {
    const a = ent(1, 9), b = ent(1, 9), c = ent(1, 9), s = motor.caja(a, b, c);
    // camino cerrado al azar por las aristas (ida o vuelta)
    let v = 'A'; const pares = [];
    for (let j = 0; j < 8; j++) {
      const op = s.aristas.filter(r => r.de === v || r.a === v), r = op[ent(0, op.length - 1)], w = r.de === v ? r.a : r.de;
      pares.push([v, w]); v = w;
    }
    // volver a A por las aristas: x, y y z hasta el origen
    const P = s.vertices[v];
    const camino = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].find(n => { const q = s.vertices[n]; return q.x === 0 && q.y === P.y && q.z === P.z; });
    if (camino !== v) pares.push([v, camino]);
    const q1 = s.vertices[camino], baja = Object.keys(s.vertices).find(n => { const q = s.vertices[n]; return q.x === 0 && q.y === 0 && q.z === q1.z; });
    if (baja !== camino) pares.push([camino, baja]);
    if (baja !== 'A') pares.push([baja, 'A']);
    const t = motor.sumaSolido(s, pares);
    cerca(t.modulo, 0, 'ciclo cerrado', 1e-9);
    const g = motor.sumaSolido(s, [['A', 'B'], ['A', 'D'], ['A', 'E']]);
    cerca(g.modulo, s.diagonal, 'diagonal'); cerca(g.x, a, 'G.x'); cerca(g.z, c, 'G.z');
    const p1 = motor.sumaSolido(s, [['A', 'B']]), p2 = motor.sumaSolido(s, [['H', 'G']]);
    assert.deepEqual([p1.x, p1.y, p1.z], [p2.x, p2.y, p2.z], 'AB = HG');
    for (const r of s.aristas) { const d = motor.sumaSolido(s, [[r.de, r.a]]); assert.equal(['x', 'y', 'z'].filter(e => d[e] !== 0).join(''), r.direccion); }
    assert.ok(g.errores.sumaModulos >= g.modulo - 1e-9, 'desigualdad triangular');
    cerca(motor.sumaSolido(s, [['A', 'G'], ['G', 'A']]).modulo, 0, 'AG + GA = 0');
  }
  const c = motor.cubo(3); assert.equal(c.tipo, 'cubo'); cerca(c.diagonal, 3 * Math.sqrt(3), 'cubo');
});
test('inverso de suma y diferencia: con el θ que da el motor, |a + b| = k·|a − b| para dos vectores iguales', () => {
  for (let k = 0; k < N; k++) {
    const K = al(0.05, 12), a = al(0.5, 20), r = motor.inversoSumaDiferencia(K);
    const S = motor.resultante(a, a, r.theta, { exacto: true }).R, D = motor.resultante(a, a, 180 - r.theta, { exacto: true }).R;
    cerca(S / D, K, 'k', 1e-7);
    cerca(Math.tan(r.theta * Math.PI / 360), 1 / K, 'tan(θ/2) = 1/k', 1e-9);
  }
  // con el notable de academia (3-4-5) la relación sale exacta
  const n = motor.inversoSumaDiferencia(2);
  cerca(motor.resultante(5, 5, n.academia).R / motor.resultante(5, 5, 180 - n.academia).R, 2, 'notable');
});
test('girar los ejes: los módulos y la resultante no cambian; girar φ y luego −φ deja todo igual', () => {
  for (let k = 0; k < N; k++) {
    const lista = [V(), V(), V()], phi = al(-360, 360), g = motor.girarEjes(lista, phi), s = motor.suma(lista);
    cerca(g.resultante.modulo, s.modulo, '|R|', 1e-8);
    g.vectores.forEach((v, i) => cerca(v.modulo, Math.hypot(lista[i].x, lista[i].y), 'módulo', 1e-8));
    const h = motor.girarEjes(g.vectores, -phi);
    h.vectores.forEach((v, i) => { cerca(v.x, lista[i].x, 'vuelta x', 1e-7); cerca(v.y, lista[i].y, 'vuelta y', 1e-7); });
    cerca(motor.escalar(g.vectores[0], g.vectores[1]), motor.escalar(lista[0], lista[1]), 'el producto escalar no cambia', 1e-7);
  }
});
test('proyección y área: sombra² + (área/|v|)² = |u|²; la sombra es 0 y el área es máxima con 90°; el triángulo es la mitad', () => {
  for (let k = 0; k < N; k++) {
    const u = V(), v = V(), p = motor.proyeccion(u, v), A = motor.area(v, u), mv = Math.hypot(v.x, v.y);
    cerca(p.escalar ** 2 + (A.paralelogramo / mv) ** 2, u.x ** 2 + u.y ** 2, 'Pitágoras', 1e-7);
    cerca(p.escalar * mv, motor.escalar(u, v), 'u·v = |v|·sombra', 1e-7);
    cerca(A.triangulo * 2, A.paralelogramo, 'mitad');
    assert.equal(motor.area(u, v).sentido, A.errores.manoInvertida, 'u × v = −v × u');
    const perp = { x: -v.y, y: v.x };
    cerca(motor.proyeccion(perp, v).escalar, 0, 'perpendicular', 1e-9);
    cerca(motor.area(v, perp).paralelogramo, mv * mv, 'área máxima', 1e-8);
    assert.ok(motor.area(v, { x: v.x * 0.5 + perp.x * 0.3, y: v.y * 0.5 + perp.y * 0.3 }).paralelogramo <= motor.area(v, perp).paralelogramo + 1e-9);
  }
});
test('vector de módulo dado: mide eso, es paralelo a v con el mismo sentido y el antiparalelo es el opuesto', () => {
  for (let k = 0; k < N; k++) {
    const v = V(), m = al(0.1, 30), w = motor.unitarioConModulo(v, m);
    cerca(Math.hypot(w.x, w.y), m, 'módulo'); cerca(motor.anguloEntre(w, v), 0, 'paralelo', 1e-5);
    cerca(w.antiparalelo.x, -w.x, 'antiparalelo');
    const u = motor.unitario(w); cerca(u.x, w.unitario.x, 'el unitario de w es el de v');
    cerca(Math.hypot(w.errores.escalado.x, w.errores.escalado.y), w.factor, 'el «escalado» no mide 1');
  }
});
test('dos sentidos: cada solución pone R sobre el eje con el módulo pedido, una en cada sentido', () => {
  for (let k = 0; k < N; k++) {
    const eje = rnd() < 0.5 ? 'x' : 'y', e = eje === 'x' ? 0 : 1, o = 1 - e, m = ent(1, 20);
    const A = [ent(-9, 9), ent(-9, 9)], B = [ent(-9, 9), ent(-9, 9)];
    if (rnd() < 0.5) A[e] = null; else B[e] = null;
    if (rnd() < 0.5) A[o] = null; else B[o] = null;
    const r = motor.dosSentidos(A, B, eje, m);
    assert.equal(r.soluciones.length, 2);
    r.soluciones.forEach((s, i) => {
      cerca(s.R[o], 0, 'sobre el eje'); cerca(Math.abs(s.R[e]), m, 'módulo');
      assert.equal(Math.sign(s.R[e]), i === 0 ? 1 : -1);
      cerca(s.A[0] + s.B[0], s.R[0], 'R = A + B');
    });
    cerca(r.soluciones[0].incognitaEje - r.soluciones[1].incognitaEje, 2 * m, 'las dos raíces de (… + U)² = m²');
  }
});
test('radical: reconoce k√n y p + q√n', () => {
  for (let k = 0; k < 200; k++) {
    const kk = ent(1, 12), n = [2, 3, 5, 6, 7, 10, 13][ent(0, 6)];
    assert.equal(motor.radical(kk * Math.sqrt(n)), `${kk === 1 ? '' : kk}√${n}`);
  }
  assert.equal(motor.radical(2 + 2 * Math.sqrt(2)), '2 + 2√2');
  assert.equal(motor.radical(-3), '−3');
  assert.equal(motor.radical(Math.PI), null);
});
test('errores de entrada de la 0.2.0', () => {
  assert.throws(() => motor.division([0, 0], [1, 1], 0, 1), /mayor que cero/);
  assert.throws(() => motor.baricentro([0, 0], [1, 1], [2, 2]), /alineados/);
  assert.throws(() => motor.trapecio([0, 0], [4, 0], [3, 2], [1, 3]), /paralelos/);
  assert.throws(() => motor.trapecio([0, 0], [4, 0], [1, 2], [3, 2]), /sentido/);
  assert.throws(() => motor.reduccion({ puntos: { P: [0, 0] }, vectores: [], marcado: ['P', 'P'] }), /nulo/);
  assert.throws(() => motor.reduccion({ puntos: { P: [0, 0] }, vectores: [['P', 'Z']], marcado: ['P', 'P'] }), /punto Z/);
  assert.throws(() => motor.caja(1, 0, 1), /mayor que cero/);
  assert.throws(() => motor.sumaSolido({ tipo: 'cubo', a: 1 }, [['A', 'Z']]), /desconocido/);
  assert.throws(() => motor.sumaSolido({ tipo: 'prisma', a: 1 }, [['A', 'B']]), /no conozco/);
  assert.throws(() => motor.inversoSumaDiferencia(0), /mayor que cero/);
  assert.throws(() => motor.girarEjes([], 10), /faltan/);
  assert.throws(() => motor.proyeccion([1, 1], [0, 0]), /nulo/);
  assert.throws(() => motor.unitarioConModulo([0, 0], 3), /nulo/);
  assert.throws(() => motor.dosSentidos([null, 1], [1, 1], 'x', 5), /incógnita/);
  assert.throws(() => motor.dosSentidos([null, 1], [1, null], 'z', 5), /eje/);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.vector('5', 30), /número/);
  assert.throws(() => motor.vector(-1, 30), /negativo/);
  assert.throws(() => motor.vector(5, NaN), /número/);
  assert.throws(() => motor.resultante(3, -4, 90), /negativos/);
  assert.throws(() => motor.suma([]), /lista/);
  assert.throws(() => motor.suma([{ x: 1 }]), /numéricas/);
  assert.throws(() => motor.unitario({ x: 0, y: 0 }), /nulo/);
  assert.throws(() => motor.anguloEntre({ x: 0, y: 0 }, { x: 1, y: 0 }), /nulo/);
  assert.throws(() => motor.hexagono(0), /mayor que cero/);
  assert.throws(() => motor.barrido(3, 4, 0), /entero/);
  assert.throws(() => motor.dimension('rapidez de la luz'), /no conozco/);
  assert.throws(() => motor.dimension({ X: 1 }), /no conozco/);
  assert.throws(() => motor.homogenea(['fuerza']), /dos términos/);
  assert.throws(() => motor.exponentes({ T: 1 }, []), /faltan/);
  assert.throws(() => motor.constante({ L: 1 }, [{}]), /dim/);
  // acepta [x, y]
  cerca(motor.suma([[3, 0], [0, 4]]).modulo, 5, 'con listas');
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
