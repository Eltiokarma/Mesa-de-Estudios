// Pruebas del motor de gravitación. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Física de verdad, comprobada por otro camino: la fuerza es la misma sobre los dos cuerpos y cumple F·r² constante;
//    g(h) por la ley de Newton con la masa de la Tierra; la órbita circular tiene aceleración centrípeta v²/r = g;
//    T²/r³ es la misma para todas las órbitas de un planeta (Kepler III); el geoestacionario da una vuelta en un día;
//    con la velocidad de escape la energía es cero; en el cañón de Newton se conservan la energía y el momento angular
//    punto por punto, y la elipse cerrada tarda el T de Kepler III; en Kepler II los sectores barren áreas iguales
//    (medidas aquí con triángulos finos) y la rapidez sale de la conservación del momento angular.
// 3. Lo que enseña la escena: lejos del suelo la gravedad no se apaga (G1); g ∝ 1/r², nunca 1/r (G3); el mismo peso
//    con otra masa si el radio compensa (G4); la rapidez orbital no depende de la masa del satélite; la balanza marca
//    cero en caída libre aunque el peso siga (G8); en la elipse va más rápido cerca del Sol (G6).
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

const { G, G0, R, GM_T, M_T } = motor;

// 2. Física de verdad
test('tercera ley: la misma fuerza sobre los dos y F·r² no cambia con la distancia; a = F/m de cada uno', () => {
  for (const [m1, m2] of [[1, 1], [5.97e24, 7.35e22], [60, 6e24], [3, 0.002]]) {
    let antes = null;
    for (const r of [0.5, 2, 7.3e3, 3.84e8]) {
      const f = motor.fuerza({ m1, m2, r });
      assert.equal(f.sobre1, f.sobre2); cerca(f.F * r * r, G * m1 * m2, 'F·r²');
      cerca(f.a1 * m1, f.a2 * m2, 'm1·a1 = m2·a2'); assert.equal(f.masivo, m1 >= m2 ? 1 : 2);
      if (antes) cerca(f.F / antes.F, (antes.r / r) ** 2, 'razón de fuerzas = (r1/r2)²');
      antes = { F: f.F, r };
    }
  }
});
test('g(h) coincide con G·M/r² con la masa de la Tierra, y la órbita circular tiene v²/r = g', () => {
  cerca(G * M_T / (R * R), G0, 'g en el suelo');
  for (let h = 0; h <= 8 * R; h += R / 7) {
    const r = R + h, g = motor.gAltura({ h }).g;
    cerca(g, G * M_T / (r * r), `g a ${h} m`);
    const o = motor.orbita({ h, m: 3 });
    cerca(o.v * o.v / o.r, g, 'centrípeta'); cerca(o.g, g, 'g de la órbita'); cerca(o.F, 3 * g, 'F = m·g');
    cerca(o.E, -o.Ec, 'E = −Ec'); cerca(o.Ep, -2 * o.Ec, 'Ep = −2·Ec');
    // estado(t): sobre el círculo, con la rapidez v y la velocidad perpendicular al radio.
    for (const t of [0, o.T / 8, o.T / 3, o.T]) {
      const s = o.estado(t);
      cerca(Math.hypot(s.x, s.y), o.r, 'radio'); cerca(Math.hypot(s.vx, s.vy), o.v, 'rapidez');
      cerca((s.x * s.vx + s.y * s.vy) / (o.r * o.v), 0, 'v ⟂ r', 1e-9);
    }
    const s0 = o.estado(0), sT = o.estado(o.T); cerca(s0.x / o.r, sT.x / o.r, 'una vuelta en T', 1e-9); cerca(s0.y, sT.y, 'una vuelta en T');
  }
});
test('Kepler III: T²/r³ = 4π²/GM para todas las órbitas, en la Tierra y en otro planeta; kepler3 da lo mismo', () => {
  for (const c of [{}, { kM: 4, kR: 2 }, { kM: 0.1, kR: 0.5 }]) {
    const GM = (c.kM || 1) * GM_T, Rp = (c.kR || 1) * R;
    for (const k of [1, 1.5, 2, 4, 6.6, 60]) {
      const o = motor.orbita(Object.assign({ r: k * Rp }, c));
      cerca(o.T * o.T / o.r ** 3, 4 * Math.PI * Math.PI / GM, `T²/r³ con r = ${k} Rp`);
      const base = motor.orbita(Object.assign({ r: Rp }, c)), k3 = motor.kepler3({ r1: Rp, r2: k * Rp, T1: base.T });
      cerca(k3.T2, o.T, 'kepler3 contra orbita'); cerca(k3.kv, o.v / base.v, 'kv');
    }
  }
});
test('geoestacionario: la órbita que da ese r tarda exactamente un día (y otro período, lo que se pida)', () => {
  for (const T of [86400, 43200, 2 * 86400]) {
    const g = motor.geoestacionario({ T });
    cerca(motor.orbita({ r: g.r }).T, T, `T = ${T}`); cerca(g.h, g.r - R, 'h'); cerca(motor.orbita({ r: g.r }).v, g.v, 'v');
  }
  assert.ok(motor.geoestacionario().rEnR > 6.5 && motor.geoestacionario().rEnR < 6.7);
});
test('escape: con ve la energía por kilo es cero, con menos es negativa; ve = √2·vc a cualquier distancia', () => {
  for (const c of [{}, { kM: 4, kR: 2 }]) for (const h of [0, 4e5, R, 5 * R]) {
    const s = motor.escape(Object.assign({ h }, c)), GM = (c.kM || 1) * GM_T;
    cerca((s.ve * s.ve / 2) / (GM / s.r), 1, 'energía con ve: ½·ve² = GM/r', 1e-12);
    cerca(s.razon, Math.SQRT2, '√2'); assert.equal(s.errores.infinita, Infinity);
    cerca(s.vc, motor.orbita(Object.assign({ r: s.r }, c)).v, 'vc = la orbital');
  }
});
test('cañón de Newton: en cada punto del recorrido se conservan la energía y el momento angular', () => {
  for (const h0 of [0.1 * R, R, 3 * R]) for (const f of [0.5, 0.8, 0.999, 1, 1.2, 1.4142, 1.5, 2]) {
    const vc = Math.sqrt(GM_T / (R + h0)), l = motor.lanzamiento({ v0: f * vc, h0 });
    const pts = l.recorrido(300, 10 * R);
    assert.ok(pts.length === 301);
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], b = pts[i + 1], p = pts[i], dt = b.t - a.t;
      assert.ok(dt > 0, 'el tiempo avanza');
      const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt;   // derivada numérica (central)
      const escala = GM_T / l.r0;   // la energía es una resta de números grandes: se compara contra GM/r0
      cerca(((vx * vx + vy * vy) / 2 - GM_T / p.r) / escala, l.energia / escala, `energía en el punto ${i}`, 5e-4);
      cerca(p.x * vy - p.y * vx, -l.H, `momento angular en el punto ${i}`, 2e-3);
    }
    if (l.tipo === 'cae') { cerca(pts[pts.length - 1].r, R, 'termina en el suelo'); assert.ok(f < 1); }
    if (l.tipo === 'circular' || l.tipo === 'eliptica') {
      const fin = pts[pts.length - 1];
      if (fin.phi >= 2 * Math.PI - 1e-9) cerca(fin.t, l.T, 'una vuelta tarda el T de Kepler III', 1e-6);
    }
    if (f >= Math.SQRT2 + 1e-6) assert.equal(l.tipo, 'escapa'); if (f < Math.SQRT2 - 1e-3) assert.notEqual(l.tipo, 'escapa');
    if (f > 1 && f < Math.SQRT2 - 1e-3) assert.equal(l.tipo, 'eliptica');
    // en(t) cae sobre la trayectoria
    const q = l.en(pts[pts.length - 1].t * 0.37, 10 * R); cerca(q.r, l.rDe(q.phi), 'en(t) sobre la cónica');
  }
});
test('Kepler II: sectores de igual tiempo barren áreas iguales; r·v⊥ constante y va más rápido en el perihelio', () => {
  for (const e of [0, 0.0167, 0.3, 0.6, 0.9]) {
    const k = motor.kepler2({ e, a: 2, T: 3, n: 6 });
    for (let j = 0; j < k.n; j++) {
      // área del sector con 400 triángulos finos desde el foco
      let A = 0; const t0 = j * k.T / k.n, t1 = (j + 1) * k.T / k.n, N = 400;
      let p = k.posicion(t0);
      for (let i = 1; i <= N; i++) { const q = k.posicion(t0 + (t1 - t0) * i / N); A += (p.x * q.y - p.y * q.x) / 2; p = q; }
      cerca(A, k.areaSector, `e = ${e}, sector ${j}`, 1e-4);
    }
    // momento angular por unidad de masa: r·v⊥ = 2π·a·b/T en todos los puntos
    const L = 2 * Math.PI * k.a * k.b / k.T;
    for (const t of [0, 0.4, 1.1, 2.9]) {
      const p = k.posicion(t), d = 1e-6, q = k.posicion(t + d), vx = (q.x - p.x) / d, vy = (q.y - p.y) / d;
      cerca(Math.hypot(vx, vy), p.v, `rapidez en t = ${t}`, 1e-4); cerca(p.x * vy - p.y * vx, L, 'r·v⊥', 1e-4);
    }
    cerca(k.vp * k.rp, k.va * k.ra, 'vp·rp = va·ra'); assert.ok(e === 0 ? Math.abs(k.razonV - 1) < 1e-12 : k.razonV > 1);
    cerca(k.sectores[0].x, k.rp, 'arranca en el perihelio');
  }
});

// 3. Lo que enseña la escena
test('cañón: por debajo de vSinChoque la bala cae al suelo; desde ahí da vueltas (desde 2R, unos 4,6 km/s)', () => {
  for (const h0 of [0.2 * R, R, 2 * R]) {
    const v = motor.lanzamiento({ v0: 1000, h0 }).vSinChoque;
    assert.equal(motor.lanzamiento({ v0: v * 0.999, h0 }).tipo, 'cae');
    assert.notEqual(motor.lanzamiento({ v0: v * 1.001, h0 }).tipo, 'cae');
    cerca(motor.lanzamiento({ v0: v, h0 }).rMin, R, 'perigeo en el suelo', 1e-9);
  }
  cerca(motor.lanzamiento({ v0: 1000, h0: R }).vSinChoque, 8000 / Math.sqrt(3), 'desde 2R');
});

test('G1: a la altura de la estación espacial la gravedad sigue siendo casi el 90 %, y nunca llega a cero', () => {
  cerca(motor.gAltura({ h: 4e5 }).fraccion, 256 / 289, 'estación');
  let antes = Infinity;
  for (let h = 0; h <= 1e9; h += 1e7) { const g = motor.gAltura({ h }).g; assert.ok(g > 0 && g < antes + 1e-12); antes = g; }
});
test('G3: con el doble de distancia al centro, un cuarto; el error lineal (1/r) siempre da más que la verdad', () => {
  for (const kr of [1.5, 2, 3, 4, 10]) {
    const c = motor.comparar({ kr }); cerca(c.razon, 1 / (kr * kr), `kr = ${kr}`); assert.ok(c.errores.lineal > c.razon);
  }
  for (const h of [1e5, R / 2, R, 3 * R]) { const g = motor.gAltura({ h }); assert.ok(g.errores.lineal > g.g); }
});
test('G4: dos planetas con masas distintas dan el mismo peso si kM = kR²', () => {
  for (const kR of [0.5, 1.3, 2, 3]) cerca(motor.planeta({ kM: kR * kR, kR }).g, G0, `kR = ${kR}`);
});
test('la rapidez orbital y el período no dependen de la masa del satélite', () => {
  for (const m of [1, 1000, 4.2e5]) { const o = motor.orbita({ h: R, m }); cerca(o.v, 4000 * Math.SQRT2, `m = ${m}`); cerca(o.g, 2.5, 'g'); }
});
test('G8: la balanza marca menos cuanto más acelera hacia abajo el ascensor, y cero en caída libre; el peso no cambia', () => {
  let antes = Infinity;
  for (let a = 0; a <= 10; a += 0.5) { const b = motor.balanza({ m: 70, a }); assert.ok(b.lectura < antes); antes = b.lectura; assert.equal(b.peso, 700); }
  assert.equal(motor.balanza({ m: 70, a: 10 }).lectura, 0); cerca(motor.balanza({ m: 70, a: 10 }).caida(2), 20, 'cae 20 m en 2 s');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.fuerza({ m1: 0, m2: 1, r: 1 }), /mayor que cero/);
  assert.throws(() => motor.fuerza({ m1: 1, m2: 'mucha', r: 1 }), /inválido/);
  assert.throws(() => motor.gAltura({ h: -5 }), /negativo/);
  assert.throws(() => motor.gAltura({}), /inválido/);
  assert.throws(() => motor.alturaParaG({ fraccion: 2 }), /entre 0 y 1/);
  assert.throws(() => motor.alturaParaG({ fraccion: 0 }), /mayor que cero/);
  assert.throws(() => motor.orbita({ r: 1e6 }), /menor que el radio/);
  assert.throws(() => motor.orbita({}), /Falta r o h/);
  assert.throws(() => motor.planeta({ kM: -1 }), /mayor que cero/);
  assert.throws(() => motor.kepler2({ e: 1 }), /entre 0 y 1/);
  assert.throws(() => motor.balanza({ m: 50, a: 12 }), /no puede pasar de g/);
  assert.throws(() => motor.lanzamiento({ v0: 0 }), /mayor que cero/);
  assert.throws(() => motor.geoestacionario({ T: 100 }), /dentro del planeta/);
  assert.throws(() => motor.fuerza(), /Faltan los datos/);
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
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
