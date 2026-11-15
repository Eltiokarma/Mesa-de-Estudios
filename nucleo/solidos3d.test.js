// Pruebas de nucleo/solidos3d.js. Los valores esperados salen de fórmulas de libro o de otro motor (plantillas/simetria),
// no de este módulo: así se verifican aparte.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./solidos3d.js');
const SIM = require('../plantillas/simetria/motor.js');
const { resta, largo, punto, cruz, unit, centro } = S.util;
const casi = (a, b, t = 1e-9) => Math.abs(a - b) < t;

test('conteo de caras, vértices y aristas (libro) y Euler C + V = A + 2', () => {
  const libro = { tetraedro: [4, 4, 6], cubo: [6, 8, 12], octaedro: [8, 6, 12], dodecaedro: [12, 20, 30], icosaedro: [20, 12, 30],
    'prisma-3': [5, 6, 9], 'prisma-5': [7, 10, 15], 'prisma-6': [8, 12, 18], 'piramide-4': [5, 5, 8], 'piramide-5': [6, 6, 10],
    'piramide-3': [4, 4, 6], 'piramide-6': [7, 7, 12], ortoedro: [6, 8, 12], 'prisma-4': [6, 8, 12] };
  for (const [id, [C, V, A]] of Object.entries(libro)) {
    const c = S.conteo(S.poliedro(id));
    assert.deepEqual([c.C, c.V, c.A], [C, V, A], id);
    assert.equal(c.C + c.V, c.A + 2, id);
  }
});

test('los poliedros regulares tienen todas sus aristas iguales y caras del mismo número de lados', () => {
  const lados = { tetraedro: 3, cubo: 4, octaedro: 3, dodecaedro: 5, icosaedro: 3 };
  for (const [id, p] of Object.entries(lados)) {
    const P = S.poliedro(id), L = S.aristas(P).map(([a, b]) => largo(resta(P.vertices[a], P.vertices[b])));
    assert.ok(L.every(x => casi(x, L[0], 1e-9)), id);
    assert.ok(P.caras.every(f => f.length === p), id);
  }
});

test('las caras miran hacia afuera y quedan centradas en el origen', () => {
  for (const id of S.CATALOGO) {
    const P = S.poliedro(id);
    assert.ok(largo(centro(P.vertices)) < 1e-9, id);
    for (const f of P.caras) {
      const n = cruz(resta(P.vertices[f[1]], P.vertices[f[0]]), resta(P.vertices[f[2]], P.vertices[f[0]]));
      assert.ok(punto(n, centro(f.map(q => P.vertices[q]))) > 0, `${id}: cara al revés`);
    }
  }
});

test('planos de simetría: libro y el motor de plantillas/simetria cuentan lo mismo', () => {
  const libro = { cubo: 9, tetraedro: 6, octaedro: 9, ortoedro: 3, 'prisma-4': 5, 'prisma-3': 4, 'prisma-6': 7, 'piramide-4': 4, 'piramide-3': 3, 'piramide-6': 6, 'prisma-5': 6, icosaedro: 15, dodecaedro: 15 };
  for (const [id, n] of Object.entries(libro)) assert.equal(S.planosSimetria(S.poliedro(id)).length, n, id);
  // El otro motor arma sus sólidos con otras medidas y otra posición: cuenta igual.
  assert.equal(SIM.planos(SIM.poliedro('cubo', 2)).numPlanos, 9);
  assert.equal(SIM.planos(SIM.poliedro('prismaRegular', 6, 1, 3)).numPlanos, 7);
  assert.equal(SIM.planos(SIM.poliedro('caja', 1, 2, 3)).numPlanos, 3);
  assert.equal(SIM.planos(SIM.poliedro('piramideCuadrada', 2, 3)).numPlanos, 4);
  assert.equal(SIM.planos(SIM.poliedro('tetraedro', 2)).numPlanos, 6);
});

test('normalDe y reflejar: el plano horizontal cambia el signo de y; un plano oblicuo no es de simetría del cubo', () => {
  assert.deepEqual(S.normalDe(0, 0), [0, 1, 0]);
  assert.deepEqual(S.reflejar([1, 2, 3], [0, 1, 0]).map(x => +x.toFixed(12)), [1, -2, 3]);
  const cubo = S.poliedro('cubo');
  assert.equal(S.esPlanoSimetria(cubo, S.normalDe(45, 90)), true);     // por dos aristas opuestas
  assert.equal(S.esPlanoSimetria(cubo, S.normalDe(30, 0)), false);
  // Reflejar dos veces devuelve el punto; reflejar conserva distancias al centro.
  const p = [0.3, -1.2, 0.7], n = S.normalDe(35, 70), q = S.reflejar(p, n);
  assert.ok(largo(resta(S.reflejar(q, n), p)) < 1e-12);
  assert.ok(casi(largo(q), largo(p), 1e-12));
});

test('desarrollo: armado en t = 1, plano en t = 0, sin estirar aristas ni encimar caras', () => {
  for (const id of ['tetraedro', 'cubo', 'octaedro', 'dodecaedro', 'icosaedro', 'prisma-3', 'prisma-5', 'prisma-6', 'piramide-4', 'piramide-5']) {
    assert.deepEqual(S.conteo(S.apoyar(S.poliedro(id))), S.conteo(S.poliedro(id)));
    const P = S.apoyar(S.poliedro(id)), armado = S.desarrollo(P, 1), plano = S.desarrollo(P, 0);
    armado.caras.forEach((f, k) => f.forEach((p, i) => assert.ok(largo(resta(p, P.vertices[P.caras[k][i]])) < 1e-9, id)));
    const y0 = plano.caras[plano.raiz][0][1];
    for (const f of plano.caras) for (const p of f) assert.ok(Math.abs(p[1] - y0) < 1e-7, `${id}: el desarrollo no queda plano`);
    for (const t of [0, 0.5]) S.desarrollo(P, t).caras.forEach((f, k) => f.forEach((p, i) => {
      const q = f[(i + 1) % f.length], a = P.vertices[P.caras[k][i]], b = P.vertices[P.caras[k][(i + 1) % f.length]];
      assert.ok(casi(largo(resta(p, q)), largo(resta(a, b)), 1e-9), `${id}: arista estirada`);
    }));
    // Sin encimarse: el centro de cada cara plana no cae dentro de ninguna otra (prueba en el plano xz).
    const dentro = (c, f) => {
      let signo = 0;
      for (let i = 0; i < f.length; i++) {
        const a = f[i], b = f[(i + 1) % f.length], s = (b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0]);
        if (Math.abs(s) < 1e-9) return false;
        if (signo && Math.sign(s) !== signo) return false;
        signo = Math.sign(s);
      }
      return true;
    };
    plano.caras.forEach((f, k) => plano.caras.forEach((g, h) => { if (h !== k) assert.ok(!dentro(centro(f), g), `${id}: caras ${k} y ${h} encimadas`); }));
  }
});

test('revolución: Pappus da los volúmenes de libro', () => {
  const pi = Math.PI;
  assert.ok(casi(S.revolucion('rectangulo', 0, 360).volumen, pi * 1 * 1 * 2));            // cilindro r = 1, h = 2
  assert.ok(casi(S.revolucion('triangulo', 0, 360).volumen, pi * 1 * 1 * 2 / 3));         // cono r = 1, h = 2
  assert.ok(casi(S.revolucion('semicirculo', 0, 360).volumen, 4 / 3 * pi));               // esfera r = 1
  assert.ok(casi(S.revolucion('rectangulo', 1, 360).volumen, pi * (4 - 1) * 2));          // cilindro hueco de radios 1 y 2
  assert.ok(casi(S.revolucion('circulo', 0.4, 360).volumen, 2 * pi * pi * 1 * 0.36));      // toro R = 1, r = 0,6
  assert.ok(casi(S.revolucion('rectangulo', 0, 90).volumen, pi * 2 / 4));                 // un cuarto de cilindro
  assert.equal(S.revolucion('semicirculo', 0, 360).solido, 'esfera');
  assert.equal(S.revolucion('circulo', 0.5, 360).solido, 'toro');
});

test('revolución: el área del perfil coincide con el área de la región (fórmula de la lazada)', () => {
  for (const id of S.REGIONES) for (const d of [0, 0.75, 2]) {
    const g = S.region(id, d), p = g.perfil;
    let A = 0, Mx = 0, My = 0;
    for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], c = a[0] * b[1] - b[0] * a[1]; A += c / 2; Mx += (a[0] + b[0]) * c / 6; My += (a[1] + b[1]) * c / 6; }
    const tol = id === 'semicirculo' || id === 'circulo' ? 0.02 : 1e-9;     // los arcos van con 24 a 32 tramos
    assert.ok(Math.abs(Math.abs(A) - g.area) < tol * g.area, `${id} área`);
    assert.ok(Math.abs(Mx / A - g.rc) < tol * g.rc + 1e-9, `${id} centroide`);
    assert.ok(Math.abs(My / A - g.yc) < 0.02, `${id} centroide en y`);
  }
});

test('cubo pintado: contado uno por uno da 8, 12(n − 2), 6(n − 2)² y (n − 2)³', () => {
  for (let n = 2; n <= 6; n++) {
    const c = S.porClase(n);
    assert.deepEqual([c[3], c[2], c[1], c[0]], [8, 12 * (n - 2), 6 * (n - 2) ** 2, (n - 2) ** 3]);
    assert.equal(S.cubitos(n).length, n ** 3);
  }
});

test('varilla: sombra L·cos a, altura L·sen a; el pie H está en el piso', () => {
  const v = S.varilla(37, 5, 40);
  assert.ok(casi(v.sombra, 5 * Math.cos(37 * Math.PI / 180)) && casi(v.altura, 5 * Math.sin(37 * Math.PI / 180)));
  assert.equal(v.H[1], 0);
  assert.ok(casi(largo(resta(v.B, v.A)), 5));
  assert.ok(casi(S.varilla(90, 2, 0).sombra, 0));
});

test('diedro: PH = p · sen φ; con φ obtuso el pie cae fuera de la cara del piso', () => {
  const d = S.diedro(60, 2);
  assert.ok(casi(d.PH, 2 * Math.sin(Math.PI / 3)) && d.dentro);
  assert.ok(casi(largo(d.P), 2));
  assert.equal(S.diedro(120, 2).dentro, false);
  assert.ok(casi(S.diedro(120, 2).PH, d.PH));
  // El ángulo plano: entre la perpendicular a la arista en el piso (z) y la de la otra cara (u).
  assert.ok(casi(Math.acos(punto(unit(d.u), [0, 0, 1])) * 180 / Math.PI, 60, 1e-9));
});

test('proyectar conserva el largo (girar no cambia la figura)', () => {
  const p = [0.4, -1.3, 2.2], q = S.proyectar(p, { giro: 33, inclinacion: -18 });
  assert.ok(casi(largo(q), largo(p), 1e-12));
});
