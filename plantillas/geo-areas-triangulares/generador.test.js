// Pruebas del generador de áreas poligonales: casos.json (verificados aparte, a ciegas), papel.json
// contra calc, y un recálculo independiente en cada uno de 600 problemas: se arma la figura con
// coordenadas (intersecciones de rectas, bisección para las condiciones de la mediatriz y del arco)
// y el área sale de la fórmula del cordón (shoelace).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const R3 = Math.sqrt(3);
function deClave(k) {
  const [q, p] = k.split('|').map(f => { const [n, d] = f.split('/').map(Number); return n / d; });
  return q + p * R3;
}
// Fórmula del cordón.
const area = (...pts) => Math.abs(pts.reduce((s, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
// Cruce de las rectas P1P2 y P3P4.
function cruce([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
  return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
}
const dist = ([a, b], [c, d]) => Math.hypot(a - c, b - d);
function biseccion(f, lo, hi) {
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Math.sign(f(m)) === Math.sign(f(lo))) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const rad = g => g * Math.PI / 180;

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'misma-altura') {
    if (d.sub === 'rectangulo-razon') {
      // AB = 1; ABE = T da BE = 2T; BC = BE·(m + n)/m.
      const BE = 2 * d.T, BC = BE * (d.m + d.n) / d.m;
      const A = [0, 0], B = [1, 0], C = [1, BC], D = [0, BC], E = [1, BE];
      assert.ok(Math.abs(area(A, B, E) - d.T) < 1e-9);
      return area(A, E, C, D);
    }
    if (d.sub === 'bisectriz') {
      // Ángulo en A tal que el área sea S; D = cruce de la bisectriz con BC.
      const fi = Math.asin(2 * d.S / (d.b * d.c));
      const A = [0, 0], B = [d.c, 0], C = [d.b * Math.cos(fi), d.b * Math.sin(fi)];
      const D = cruce(A, [Math.cos(fi / 2), Math.sin(fi / 2)], B, C);
      return area(A, B, D);
    }
    if (d.sub === 'bisectriz-rectangulo') {
      const A = [0, 0], B = [d.a, 0], Dv = [0, d.b];
      return area(A, B, cruce(A, [1, 1], B, Dv));
    }
    const Bv = [0, 0], C = [d.m + d.n, 0], A = [1.7, 2 * d.S / (d.m + d.n)], D = [d.m, 0];
    const E = [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2];
    return area(Bv, E, D);
  }
  if (d.tipo === 'paralelas') {
    const A = [0, 0], D = [d.B, 0], B = [1.3, d.h], C = [1.3 + d.b, d.h];
    if (d.sub === 'trapecio-punto') {
      const Pp = [1.3 + 0.37 * d.b, d.h]; // un P cualquiera
      return d.pide === 'laterales' ? area(A, B, Pp) + area(Pp, C, D) : area(A, Pp, D);
    }
    const O = cruce(A, C, B, D);
    assert.ok(Math.abs(area(A, B, D) - d.S1) < 1e-9 && Math.abs(area(A, O, D) - d.S2) < 1e-9);
    return area(C, O, D);
  }
  if (d.tipo === 'trapecio') {
    // Bases BC = a (arriba) y AD = b (abajo), en una escala que se ajusta con la altura H.
    let a, b, H;
    if (d.sub === 'desde-total') { a = d.a; b = d.b; H = 2 * d.T / (a + b); }
    else { a = Math.sqrt(d.S1); b = Math.sqrt(d.S2); H = 1; }
    const A = [0, 0], D = [b, 0], B = [0.6, H], C = [0.6 + a, H], O = cruce(A, C, B, D);
    if (d.sub === 'desde-total') return area(B, O, C);
    // Se ajusta H para que BOC = S1 (las áreas escalan con H).
    const k = d.S1 / area(B, O, C);
    assert.ok(Math.abs(area(A, O, D) * k - d.S2) < 1e-6);
    return d.sub === 'total' ? area(A, B, C, D) * k : area(A, O, B) * k;
  }
  if (d.tipo === 'punto-medio') {
    const l = d.l, A = [0, 0], B = [l, 0], C = [l, l], D = [0, l], M = [l, l / 2];
    const Pp = cruce(A, C, D, M);
    return { DPC: area(D, Pp, C), PMC: area(Pp, M, C), APD: area(A, Pp, D), ABMP: area(A, B, M, Pp) }[d.pieza];
  }
  if (d.tipo === 'notables') {
    // Se busca por bisección el lado s de EFGH con EB = s·cos 37°, BF = s·sen 37° (cos 37° = 4/5) y AE + EB = L.
    const L = d.L, s = biseccion(x => x * 0.6 + x * 0.8 - L, 0, 2 * L);
    const E = [L - 0.8 * s, 0], F = [L, 0.6 * s], G = [0.8 * s, L], H = [0, L - 0.6 * s], A = [0, 0], B = [L, 0];
    assert.ok(Math.abs(dist(E, F) - dist(F, G)) < 1e-9 && Math.abs(dist(G, H) - s) < 1e-9);
    return { interior: area(E, F, G, H), esquina: area(E, B, F), AFG: area(A, F, G) }[d.pide];
  }
  if (d.tipo === 'equilateros') {
    if (d.sub === 'estrella') {
      const l = d.R ? d.R * Math.SQRT2 : d.l; // el lado del cuadrado inscrito es la cuerda de 90°
      const sq = [[0, 0], [l, 0], [l, l], [0, l]], pts = [];
      for (let i = 0; i < 4; i++) {
        const [x1, y1] = sq[i], [x2, y2] = sq[(i + 1) % 4], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const nx = (y2 - y1) / l, ny = -(x2 - x1) / l; // normal hacia afuera
        pts.push(sq[i], [mx + nx * l * R3 / 2, my + ny * l * R3 / 2]);
      }
      return area(...pts);
    }
    if (d.sub === 'hexagono' || d.sub === 'pentagono') {
      // Se recorre el contorno con giros de 60° (ángulos interiores de 120°) y lados dados.
      const { L, x, y, z } = d;
      const lados = [x, L - x - y, y, L - y - z, z, L - z - x];
      let pt = [0, 0], dir = 0; const pts = [pt];
      for (const s of lados) { pt = [pt[0] + s * Math.cos(rad(dir)), pt[1] + s * Math.sin(rad(dir))]; pts.push(pt); dir += 60; }
      assert.ok(dist(pts[6], pts[0]) < 1e-9, 'el hexágono no cierra');
      const [A, B, C, D, E, F] = pts.slice(0, 6);
      if (d.sub === 'hexagono') return area(A, B, C, D, E, F);
      const Q = cruce(F, A, C, B);
      return area(Q, C, D, E, F);
    }
    if (d.sub === 'isosceles-lados') return area([0, 0], [d.l, 0], [d.l * Math.cos(rad(30)), d.l * Math.sin(rad(30))]);
    // Base dada: se busca el lado l con BC = b por bisección.
    const l = biseccion(t => dist([t, 0], [t * Math.cos(rad(30)), t * Math.sin(rad(30))]) - d.b, 0.001, 100 * d.b);
    return area([0, 0], [l, 0], [l * Math.cos(rad(30)), l * Math.sin(rad(30))]);
  }
  // pitagoras
  if (d.sub === 'mediatriz') {
    // B(0, 0), C sobre el eje x, P(m, 0); A(0, y) con PA = PC (P en la mediatriz de AC).
    const Bv = [0, 0], C = [d.m + d.n, 0], Pp = [d.m, 0];
    const y = biseccion(t => dist(Pp, [0, t]) - dist(Pp, C), 0, 10 * d.n);
    const ar = area(Bv, C, [0, y]);
    return d.tasa ? ar * d.tasa : ar;
  }
  const A = [-d.d / 2, 0], B = [d.d / 2, 0];
  const th = biseccion(t => dist(A, [d.d / 2 * Math.cos(t), d.d / 2 * Math.sin(t)]) - d.a, 0, Math.PI);
  return area(A, B, [d.d / 2 * Math.cos(th), d.d / 2 * Math.sin(th)]);
}
const igual = (es, valor) => Math.abs(es - deClave(valor)) < 1e-6 * Math.max(1, Math.abs(es));
probarGenerador(gen, { semillas: 600, recalcular, igual });
const { probarFugas } = require('../../nucleo/probar-generador.js');
probarFugas(gen, { valorNumerico: a => deClave(a.valor) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(deClave(p.respuesta.valor) - c.esperado.respuesta) <= casos.tolerancia, `da ${deClave(p.respuesta.valor)}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('papel.json: cada verificación cuadra con calc', () => {
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const pr of papel.problemas) {
    assert.ok(pr.verificar.length, `${pr.id} sin verificación`);
    for (const ver of pr.verificar) {
      const x = gen.calc.valor(gen.calc[ver.fn](...ver.args));
      assert.ok(Math.abs(x - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${pr.id}: ${ver.fn} da ${x}, se esperaba ${ver.espera}`);
    }
  }
});

test('salen todos los tipos y subtipos, y todas las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  const forma = t => (/√3/.test(t) ? 'r' : '') + (/^\(/.test(t) || !/√3/.test(t) ? 'q' : '');
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + (d.sub || d.pieza || d.pide));
    const fs = new Set(p.alternativas.map(a => forma(a.texto)));
    assert.equal(fs.size, 1, `semilla ${s}: formas mezcladas ${[...fs]}`);
    for (const a of p.alternativas) assert.ok(!/,\d|\/\d/.test(a.texto), `semilla ${s}: decimal o fracción en ${a.texto}`);
  }
  for (const t of ['misma-altura/rectangulo-razon', 'misma-altura/bisectriz', 'misma-altura/bisectriz-rectangulo', 'misma-altura/razon-segmentos',
    'paralelas/trapecio-punto', 'paralelas/diagonales', 'trapecio/total', 'trapecio/lateral', 'trapecio/desde-total',
    'punto-medio/DPC', 'punto-medio/APD', 'punto-medio/PMC', 'punto-medio/ABMP', 'notables/interior', 'notables/esquina', 'notables/AFG',
    'equilateros/estrella', 'equilateros/hexagono', 'equilateros/pentagono', 'equilateros/isosceles-lados', 'equilateros/isosceles-base',
    'pitagoras/mediatriz', 'pitagoras/semicircunferencia']) {
    assert.ok(vistos.has(t), `no salió ${t}`);
  }
});
