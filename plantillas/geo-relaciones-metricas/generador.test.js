// Pruebas del generador de relaciones métricas: casos.json (verificados aparte, a ciegas), papel.json
// contra calc, y un recálculo independiente con coordenadas y búsqueda numérica en 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Camino independiente: se construye la figura con coordenadas ----------
const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const areaPol = pts => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
// Bisección de una función creciente g en [lo, hi] para g(x) = meta.
function biseccion(g, meta, lo, hi) {
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (g(mid) < meta) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
// Triángulo con B = (0, 0), C = (a, 0) y AB = c, AC = b: el ángulo en B se busca numéricamente.
function triangulo(a, b, c) {
  const t = biseccion(th => dist([c * Math.cos(th), c * Math.sin(th)], [a, 0]), b, 0, Math.PI);
  return { A: [c * Math.cos(t), c * Math.sin(t)], B: [0, 0], C: [a, 0], angB: t };
}
// Ángulo en grados → notable de academia (cos 37° = 4/5): se compara el coseno real.
const ACAD = { 37: 0.8, 53: 0.6, 45: Math.SQRT1_2, 30: Math.sqrt(3) / 2, 60: 0.5, 90: 0 };
function academia(th) {
  const c = Math.cos(th);
  for (const [g, co] of Object.entries(ACAD)) {
    if (Math.abs(c - co) < 1e-7) return Number(g);
    if (Math.abs(c + co) < 1e-7) return 180 - Number(g);
  }
  return NaN;
}
// Pie de la perpendicular desde P a la recta QR.
function pie(P, Q, R) {
  const d = [R[0] - Q[0], R[1] - Q[1]];
  const t = ((P[0] - Q[0]) * d[0] + (P[1] - Q[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
  return [Q[0] + t * d[0], Q[1] + t * d[1]];
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'altura-hipotenusa': {
      if (d.sub === 'tangente') {
        // Centro (0, 0); tangentes x = −ρ y x = ρ; P = (−ρ, m), Q = (ρ, n): se busca ρ con PQ a distancia ρ del centro.
        const g = rho => { const P = [-rho, d.m], Q = [rho, d.n]; return Math.abs(P[0] * Q[1] - P[1] * Q[0]) / dist(P, Q) - rho; };
        let lo = 1e-9, hi = 1e4;
        for (let i = 0; i < 300; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
        return (d.pide === 'r' ? 1 : 2) * lo;
      }
      if (d.sub === 'h-catetos') {
        const B = [0, 0], A = [0, d.a], C = [d.b, 0], H = pie(B, A, C);
        return d.pide === 'BH' ? dist(B, H) : dist(A, H);
      }
      const r = (d.m + d.n) / 2, Bp = [d.m, Math.sqrt(r * r - (d.m - r) ** 2)];
      return d.sub === 'h' ? Bp[1] : dist([0, 0], Bp);
    }
    case 'semicircunferencia': {
      const r = d.d / 2, C = [d.m, Math.sqrt(r * r - (d.m - r) ** 2)];
      return d.sub === 'cuerda' ? dist([0, 0], C) : areaPol([[0, 0], [d.d, 0], C]);
    }
    case 'euclides': {
      if (d.sub === 'corona') {
        // O = (0, 0); la recta AB es y = OH; A = (AH, OH) y B a la derecha, sobre la circunferencia exterior.
        const OH = Math.sqrt(d.r * d.r - d.m * d.m), A = [d.m, OH], B = [Math.sqrt(d.R * d.R - OH * OH), OH];
        assert.ok(Math.abs(dist([0, 0], A) - d.r) < 1e-9 && B[0] > A[0]);
        return dist(A, B);
      }
      if (d.sub === 'lado') {
        const C = [d.obtuso ? -d.m : d.m, Math.sqrt(d.b * d.b - d.m * d.m)];
        return dist(C, [d.c, 0]);
      }
      // A = (0, 0), B = (c, 0), C = b(cos α, sen α): se busca α con BC = a y se proyecta.
      const al = biseccion(t => dist([d.b * Math.cos(t), d.b * Math.sin(t)], [d.c, 0]), d.a, 0, Math.PI);
      return Math.abs(d.b * Math.cos(al));
    }
    case 'mediana': {
      if (d.sub === 'mediana') { const T = triangulo(d.a, d.b, d.c); return dist(T.A, [d.a / 2, 0]); }
      const med = a => { const T = triangulo(a, d.b, d.c); return dist(T.A, [a / 2, 0]); };
      // La mediana desde A disminuye cuando BC crece: se busca sobre −mediana.
      return biseccion(a => -med(a), -Math.sqrt(d.ma2), Math.abs(d.b - d.c) + 1e-9, d.b + d.c - 1e-9);
    }
    case 'marlen': {
      // Se reetiqueta: el que falta es D, sus vecinos A y C, el opuesto B. Se arma el rectángulo.
      const op = { A: 'C', B: 'D', C: 'A', D: 'B' }, vec = { A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] };
      const X = d.falta, [Y, Z] = vec[X], O = op[X];
      const PA2 = d.dist[Y], PC2 = d.dist[Z], PB2 = d.dist[O];
      const lo = Math.max(0, PB2 - PC2), hi = Math.min(PA2, PB2);
      assert.ok(hi > lo, 'no existe el rectángulo');
      const y = Math.sqrt((lo + hi) / 2), x = Math.sqrt(PA2 - y * y), w = Math.sqrt(PB2 - y * y), hh = Math.sqrt(PC2 - PB2 + y * y);
      const W = x + w, H = y + hh, P = [x, y];
      assert.ok(Math.abs(dist(P, [W, 0]) ** 2 - PB2) < 1e-6 && Math.abs(dist(P, [W, H]) ** 2 - PC2) < 1e-6);
      return dist(P, [0, H]);
    }
    case 'diferencia-cuadrados': {
      const T = triangulo(d.bc, Math.sqrt(d.ac2), Math.sqrt(d.ab2));
      return academia(T.angB);
    }
    case 'heron': {
      const T = triangulo(d.a, d.b, d.c), S = areaPol([T.A, T.B, T.C]);
      return d.sub === 'area' ? S : T.A[1];
    }
    case 'ptolomeo': {
      if (d.sub === 'heptagono') {
        // Heptágono regular de lado 1 con coordenadas reales; luego se escala.
        const V = Array.from({ length: 7 }, (_, i) => [Math.cos(2 * Math.PI * i / 7), Math.sin(2 * Math.PI * i / 7)]);
        const lado = dist(V[0], V[1]), ac = dist(V[0], V[2]), ad = dist(V[0], V[3]);
        const escala = d.k * (1 / ac + 1 / ad); // así 1/AC + 1/AD = 1/k tras escalar
        return 7 * lado * escala;
      }
      const hh = Math.sqrt(d.l * d.l - ((d.B - d.b) / 2) ** 2);
      return dist([0, 0], [(d.B + d.b) / 2, hh]);
    }
    case 'trapecio-perpendiculares': {
      // O en el origen, AC sobre el eje x y BD sobre el eje y; AO:OC = AD:BC = r:(1 − r).
      const arma = (d1, d2, r) => ({ A: [-d1 * r, 0], C: [d1 * (1 - r), 0], D: [0, -d2 * r], B: [0, d2 * (1 - r)] });
      if (d.sub === 'altura') {
        const T = arma(d.d1, d.d2, 0.6);
        return dist(T.B, pie(T.B, T.A, T.D));
      }
      const r = d.B / (d.B + d.b);
      const d2 = biseccion(x => { const T = arma(d.d1, x, r); return dist(T.A, T.D); }, d.B, 0, 1000);
      const T = arma(d.d1, d2, r);
      assert.ok(Math.abs(dist(T.B, T.C) - d.b) < 1e-6);
      return areaPol([T.A, T.B, T.C, T.D]);
    }
    case 'figuras-compuestas': {
      if (d.sub === 'cometa') {
        // A = (0, 0), C = (c, 0); B con AB = a y ∠ABC = 90°. Se busca c con BM = bm.
        const Bde = c => [d.a * d.a / c, d.a * Math.sqrt(c * c - d.a * d.a) / c];
        const c = biseccion(c => dist(Bde(c), [c / 2, 0]), d.bm, d.a + 1e-9, 1e4);
        const B = Bde(c), D = [B[0], -B[1]]; // simétrico respecto de AC (la bisectriz)
        const BC = dist(B, [c, 0]);
        return d.pide === 'BC' ? BC : d.a + BC + dist([c, 0], D) + dist(D, [0, 0]);
      }
      if (d.sub === 'isosceles-bisectriz') {
        const B = [0, 0], A = [0, d.a], C = [d.b, 0], H = pie(B, A, C);
        const un = P => { const l = Math.hypot(P[0], P[1]); return [P[0] / l, P[1] / l]; };
        const w = [un(H)[0] + un(C)[0], un(H)[1] + un(C)[1]]; // dirección de la bisectriz de HBC
        // D = t·w sobre la recta AC: x/b + y/a = 1.
        const t = 1 / (w[0] / d.b + w[1] / d.a), D = [t * w[0], t * w[1]];
        return d.pide === 'HD' ? dist(H, D) : dist(B, D);
      }
      // equilátero: A = (0, 0), D = (s, 0), B arriba; DC sale de D a 30° sobre el eje x.
      const B = [d.s / 2, d.s * Math.sqrt(3) / 2], Dd = [d.s, 0], u = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)];
      const ang = (P, Q, R) => { const a = [Q[0] - P[0], Q[1] - P[1]], b = [R[0] - P[0], R[1] - P[1]]; return Math.acos((a[0] * b[0] + a[1] * b[1]) / Math.hypot(...a) / Math.hypot(...b)); };
      // ∠BCD baja de 90° a 0° a medida que C se aleja: se busca 30°.
      const t = biseccion(t => -ang([Dd[0] + t * u[0], Dd[1] + t * u[1]], B, Dd), -Math.PI / 6, 1e-9, 1e4);
      const C = [Dd[0] + t * u[0], Dd[1] + t * u[1]];
      assert.ok(Math.abs(ang(Dd, [0, 0], C) - 5 * Math.PI / 6) < 1e-9, '∠ADC = 150°');
      return dist([0, 0], C);
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => Math.abs(a - b) < 1e-6 });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    vistos.add(p._datos.tipo + '/' + (p._datos.sub || ''));
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto) && !a.texto.includes('/'), `semilla ${s}: ${a.texto}`);
    const conGrado = p.alternativas.filter(a => a.texto.endsWith('°')).length;
    assert.ok(conGrado === 0 || conGrado === p.alternativas.length, `semilla ${s}: mezcla formas`);
    const vars = Object.values(p.variables);
    assert.ok(vars.length <= 4 && new Set(vars.map(x => x.color)).size === vars.length, `semilla ${s}: colores`);
  }
  for (const t of ['altura-hipotenusa/h', 'altura-hipotenusa/cateto', 'altura-hipotenusa/h-catetos', 'semicircunferencia/cuerda',
    'semicircunferencia/area', 'euclides/lado', 'euclides/proyeccion', 'mediana/mediana', 'mediana/lado', 'marlen/',
    'diferencia-cuadrados/', 'heron/area', 'heron/altura', 'ptolomeo/trapecio', 'ptolomeo/heptagono',
    'trapecio-perpendiculares/altura', 'trapecio-perpendiculares/area', 'altura-hipotenusa/tangente', 'euclides/corona',
    'figuras-compuestas/cometa', 'figuras-compuestas/isosceles-bisectriz', 'figuras-compuestas/equilatero']) assert.ok(vistos.has(t), `no salió ${t}`);
});

// ---------- Lápiz y papel ----------
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const q of papel.problemas) {
    assert.ok(q.id && !ids.has(q.id)); ids.add(q.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel));
    assert.ok(q.enunciado && q.respuesta && Array.isArray(q.pasos) && q.pasos.length, `${q.id}: falta texto`);
    assert.ok(!/\d\.\d/.test(q.enunciado + q.respuesta + q.pasos.join('')), `${q.id}: se escribe con coma decimal`);
    assert.ok(Array.isArray(q.verificar) && q.verificar.length, `${q.id}: falta verificar`);
  }
});
for (const q of papel.problemas) test(`papel ${q.id}: la respuesta coincide con calc`, () => {
  for (const c of q.verificar) {
    assert.ok(typeof gen.calc[c.fn] === 'function', `no existe calc.${c.fn}`);
    const r = gen.calc[c.fn](...c.args);
    assert.ok(Math.abs(r - c.espera) < 1e-6, `${q.id}: ${c.fn}(${c.args}) da ${r}, se esperaba ${c.espera}`);
  }
});
