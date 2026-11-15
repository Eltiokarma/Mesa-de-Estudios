// Pruebas de nucleo/fisica3d.js: cada escena da los números que calcula su motor, comprobados aquí con una cuenta
// independiente escrita a mano (no con los motores): módulo y producto vectorial, F = q v × B con B en x̂,
// Φ = B·A·cos θ, la fase de la onda y el tiro con g = 10.
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('./fisica3d.js');
const casi = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} ≠ ${b}`);

test('vectores: |A| y A × B por componentes', () => {
  const casos = [
    { v: { ax: 2, ay: 2, az: 1, b: 'x', ver: 'comp' }, modA: 3 },
    { v: { ax: 1, ay: -2, az: 2, b: 'z', ver: 'cruz' }, modA: 3, cruz: [-2, -1, 0], punto: 2 },
    { v: { ax: 2, ay: 0, az: 0, b: 'y', ver: 'cruz' }, modA: 2, cruz: [0, 0, 2], punto: 0 },
    { v: { ax: 2, ay: 2, az: 0, b: 'xy', ver: 'cruz' }, modA: Math.sqrt(8), cruz: [0, 0, 0], punto: 4 },
    { v: { ax: 2, ay: -2, az: 2, b: 'xy', ver: 'cruz' }, modA: Math.sqrt(12), cruz: [-2, 2, 4], punto: 0 },
  ];
  for (const c of casos) {
    const r = F.vectores(c.v);
    casi(r.modA, c.modA);
    if (c.cruz) { r.cruz.forEach((x, k) => casi(x, c.cruz[k])); casi(r.punto, c.punto); casi(r.modCruz, Math.hypot(...c.cruz)); }
  }
});

test('vectores: con las sombras se ven A y sus componentes no nulas; con el producto, la cara solo si A × B ≠ 0', () => {
  const s = F.vectores({ ax: 2, ay: 0, az: 1, b: 'x', ver: 'comp' }).datos;
  assert.deepEqual(s.flechas.map(x => x.rotulo), ['A', 'Ax', 'Az']);
  assert.equal(F.vectores({ ax: 2, ay: 2, az: 0, b: 'xy', ver: 'cruz' }).datos.caras.length, 0);
  assert.equal(F.vectores({ ax: 2, ay: 0, az: 0, b: 'y', ver: 'cruz' }).datos.caras.length, 1);
});

test('lorentz: F = q (0, v_z, −v_y) con B = x̂, perpendicular a v y a B', () => {
  for (const th of [0, 30, 45, 90, 150, 180]) for (const fi of [0, 90, 135, 270]) for (const q of [1, -1]) {
    const t = th * Math.PI / 180, p = fi * Math.PI / 180, vy = Math.sin(t) * Math.cos(p), vz = Math.sin(t) * Math.sin(p);
    const r = F.lorentz({ th, fi, q });
    casi(r.F[0], 0, 1e-9); casi(r.F[1], q * vz, 1e-9); casi(r.F[2], -q * vy, 1e-9);
    casi(r.modulo, Math.abs(Math.sin(t)), 1e-9);
  }
  assert.equal(F.lorentz({ th: 0, fi: 0, q: 1 }).datos.flechas.some(x => x.rotulo === 'F'), false);
  assert.match(F.lorentz({ th: 90, fi: 0, q: -1 }).datos.alt, /negativa.*F mide 1 de qvB/);
});

test('espira: Φ = B·A·cos θ con los cosenos de academia, y la sombra mide A·|cos θ|', () => {
  const casos = [[0, 1, 0.16, 0.16], [60, 1, 0.16, 0.08], [90, 0.6, 0.12, 0], [120, 0.4, 0.08, -0.016], [180, 1, 0.04, -0.04]];
  for (const [th, B, A, Phi] of casos) { const r = F.espira({ th, B, A }); casi(r.Phi, Phi); casi(r.sombra, A * Math.abs(Math.cos(th * Math.PI / 180)), 1e-9); }
  // La sombra del piso: su área en la escena es (lado)² · |cos θ|, con lado = √A · 6.
  const d = F.espira({ th: 60, B: 1, A: 0.16 }).datos, s = d.caras[1].puntos;
  casi(Math.abs(s[1][0] - s[0][0]) * Math.abs(s[2][1] - s[1][1]), 2.4 * 2.4 * 0.5, 1e-9);
  assert.equal(F.espira({ th: 90, B: 1, A: 0.16 }).datos.caras.length, 1);     // de canto: sin sombra rellena
});

test('onda EM: f = c/λ, T en ns, B₀ = E₀/c y E en el origen = −E₀ sen(2πt/T)', () => {
  for (const [lam, E0, t] of [[3, 3, 2.5], [1.5, 6, 0], [6, 2, 5], [4.5, 1, 7.5]]) {
    const r = F.ondaEM({ lam, E0, t }), T = lam / 3e8 * 1e9;
    casi(r.f, 3e8 / lam, 1e-3); casi(r.T, T, 1e-9); casi(r.B0, E0 / 3e8, 1e-18);
    casi(r.Eorigen, -E0 * Math.sin(2 * Math.PI * t / T), 1e-9);
  }
  const d = F.ondaEM({ lam: 3, E0: 3, t: 0 }).datos;
  // E y B en fase y perpendiculares: en cada x, la flecha de E es vertical y la de B horizontal, del mismo largo.
  for (let k = 0; k < 24; k += 2) {
    const e = d.flechas[k], b = d.flechas[k + 1];
    assert.equal(e.color, 'c-o'); assert.equal(b.color, 'c-i');
    casi(e.a[0] - e.de[0], 0); casi(e.a[1] - e.de[1], 0); casi(b.a[2] - b.de[2], 0);
    casi(Math.abs(e.a[2]), Math.abs(b.a[1]));
  }
});

test('tiro: x = v₀ cos θ · t, y = v₀ sen θ · t − 5t², y la pelota se queda en el suelo después de caer', () => {
  const r = F.tiro({ v0: 20, ang: 30, t: 1 });
  casi(r.x, 20 * Math.cos(Math.PI / 6), 1e-9); casi(r.y, 5); casi(r.tSubida, 1); casi(r.tVuelo, 2);
  const s = F.tiro({ v0: 25, ang: 37, t: 2 });                    // 37°: 3-4-5 de academia
  casi(s.x, 40); casi(s.y, 15 * 2 - 20);
  const tarde = F.tiro({ v0: 20, ang: 30, t: 5 });
  casi(tarde.t, 2); casi(tarde.y, 0, 1e-9); assert.equal(tarde.enAire, false);
  casi(F.tiro({ v0: 20, ang: 37, t: 0 }).alcance, F.tiro({ v0: 20, ang: 53, t: 0 }).alcance);
});

test('órbita: T = 2π √(r³/GM) con GM = g₀R², el satélite queda en su plano inclinado y g apunta al centro', () => {
  const GM = 10 * 6.4e6 ** 2;
  for (const [rr, inc, t] of [[1.1, 0, 0.5], [2, 30, 1], [4, 90, 3.5], ['dia', 45, 12]]) {
    const o = F.orbita({ r: rr, inc, t }), r = rr === 'dia' ? Math.cbrt(GM * 86400 ** 2 / (4 * Math.PI ** 2)) : rr * 6.4e6;
    casi(o.T, 2 * Math.PI * Math.sqrt(r ** 3 / GM) / 3600, 1e-9);
    casi(o.v, Math.sqrt(GM / r), 1e-6);
    const i = inc * Math.PI / 180, n = [0, -Math.sin(i), Math.cos(i)];
    const S = o.datos.bolas[o.datos.bolas.length - 1].en;
    casi(S[0] * n[0] + S[1] * n[1] + S[2] * n[2], 0, 1e-9);                   // en el plano de la órbita
    casi(Math.hypot(...S), 0.42 * r / 6.4e6, 1e-9);                           // a r del centro
    const gf = o.datos.flechas.find(x => x.rotulo === 'g'), d = gf.a.map((c, k) => c - gf.de[k]);
    casi(Math.abs(d[0] * S[0] + d[1] * S[1] + d[2] * S[2]) / (Math.hypot(...d) * Math.hypot(...S)), 1, 1e-9);   // hacia el centro
  }
  casi(F.orbita({ r: 'dia', inc: 0, t: 0 }).T, 24, 1e-9);
});
