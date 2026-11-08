// Pruebas del generador de troncos y prismas: casos.json (verificados aparte, a ciegas), papel.json
// contra calc y un recálculo independiente en cada uno de 600 problemas.
// El camino independiente no usa las fórmulas cerradas: integra el área de las secciones con Simpson,
// pone los sólidos en coordenadas (caras por producto vectorial, proyecciones y fórmula del cordón) y
// usa los notables de academia (tg 37° = 3/4, etc.) solo para fijar las alturas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const PI = Math.PI, R3 = Math.sqrt(3);
function simpson(fn, a, b, n = 2000) {
  const hh = (b - a) / n; let s = fn(a) + fn(b);
  for (let i = 1; i < n; i++) s += fn(a + i * hh) * (i % 2 ? 4 : 2);
  return s * hh / 3;
}
const SEN = { 37: 0.6, 53: 0.8, 30: 0.5 }, COS = { 37: 0.8, 53: 0.6, 30: R3 / 2 }, TG = { 37: 0.75, 53: 4 / 3, 45: 1, 60: R3 };
const resta = (p, q) => p.map((x, i) => x - q[i]);
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norma = a => Math.hypot(...a);
const areaTri = (p, q, r) => norma(cruz(resta(q, p), resta(r, p))) / 2;
const areaCuad = (p, q, r, s) => areaTri(p, q, r) + areaTri(p, r, s);
function cordon(pts) { let A = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; A += x1 * y2 - x2 * y1; } return Math.abs(A) / 2; }
// Cuadrado de lado L centrado en el eje, a la altura z.
const cuadrado = (L, z) => [[-L / 2, -L / 2, z], [L / 2, -L / 2, z], [L / 2, L / 2, z], [-L / 2, L / 2, z]];
function lateralTronco(L, l, h) {
  const A = cuadrado(L, 0), B = cuadrado(l, h); let s = 0;
  for (let i = 0; i < 4; i++) s += areaCuad(A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i]);
  return s;
}
// Distancia del centro de un equilátero de lado x a un lado, en coordenadas.
function inradioEq(x) {
  const P = [[0, 0], [x, 0], [x / 2, x * R3 / 2]], c = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  return c[1]; // el lado P0P1 está sobre el eje x
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'tronco-piramide': {
      if (d.sub === 'cuadrada') return simpson(z => (d.L + (d.l - d.L) * z / d.h) ** 2, 0, d.h);
      if (d.sub === 'bases-area') { const a = Math.sqrt(d.B), b = Math.sqrt(d.b); return simpson(z => (a + (b - a) * z / d.h) ** 2, 0, d.h); }
      const h = (inradioEq(d.L) - inradioEq(d.l)) * TG[60];
      return simpson(z => R3 / 4 * (d.L + (d.l - d.L) * z / h) ** 2, 0, h);
    }
    case 'piramide-menor': {
      // Pirámide de altura 1 y base proporcional: el área de la sección a la distancia z del vértice va con z².
      const parte = (z1, z2) => simpson(z => z * z, z1, z2);
      if (d.sub === 'corte') {
        const k = d.p / d.q, menor = d.V * parte(0, k) / parte(0, 1);
        return d.pide === 'menor' ? menor : d.V - menor;
      }
      const k = d.l / d.L; // la pirámide chica ocupa la fracción k de la altura total
      return d.vm * parte(k, 1) / parte(0, k);
    }
    case 'tronco-apotema': {
      if (d.sub === 'lateral' || d.sub === 'chimenea') {
        const h = (d.L - d.l) / 2 * TG[d.theta];
        const lat = lateralTronco(d.L, d.l, h);
        if (d.sub === 'lateral') return lat;
        const A = cuadrado(d.l, h), B = cuadrado(d.l, h + d.H); let duct = 0;
        for (let i = 0; i < 4; i++) duct += areaCuad(A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i]);
        return lat + duct;
      }
      const h = d.dato === 'bases' ? (d.A - d.a) * TG[d.theta] : d.ap * SEN[d.theta];
      return simpson(() => PI * d.rho ** 2, 0, h);
    }
    case 'prisma-oblicuo': {
      const s = SEN[d.theta], c = COS[d.theta];
      if (d.sub === 'base-desde-recta') {
        // Hexágono de la sección recta en el plano perpendicular a u; se proyecta sobre z = 0 a lo largo de u.
        const u = [c, 0, s], e1 = [-s, 0, c], e2 = [0, 1, 0];
        const pts = [];
        for (let k = 0; k < 6; k++) {
          const t = k * PI / 3, P = e1.map((x, i) => d.a * (Math.cos(t) * x + Math.sin(t) * e2[i]));
          const lam = -P[2] / u[2];
          pts.push([P[0] + lam * u[0], P[1] + lam * u[1]]);
        }
        return cordon(pts);
      }
      if (d.sub === 'cara-distancia') {
        const lado = 1, arista = d.S / lado;             // la cara es lado × arista (sección recta ⟂ aristas)
        return cordon([[0, 0], [lado, 0], [0.3, d.d]]) * arista;
      }
      return d.B * [d.La * c, 0, d.La * s][2];           // base × componente vertical de la arista
    }
    case 'tronco-prisma': {
      if (d.sub === 'volumen') {
        // Base (0,0), (p,0), (0,q); alturas a, b, c en esos vértices; la tapa es el plano que pasa por ellas.
        const z = (x, y) => d.a + (d.b - d.a) * x / d.p + (d.c - d.a) * y / d.q;
        return simpson(x => simpson(y => z(x, y), 0, d.q * (1 - x / d.p), 40), 0, d.p, 40);
      }
      const B = [[0, 0, 0], [d.s, 0, 0], [d.s / 2, d.s * R3 / 2, 0]], al = [d.a, d.b, d.c];
      const T = B.map((q, i) => [q[0], q[1], al[i]]);
      let s = 0;
      for (let i = 0; i < 3; i++) s += areaCuad(B[i], B[(i + 1) % 3], T[(i + 1) % 3], T[i]);
      return s;
    }
  }
  return NaN;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-7 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y todas las variantes', () => {
  const tipos = new Set(), subs = new Set();
  for (let s = 0; s < 1000; s++) { const d = gen.generar(s)._datos; tipos.add(d.tipo); subs.add(d.tipo + '/' + d.sub + (d.dato ? '/' + d.dato : '')); }
  assert.equal(tipos.size, gen.TIPOS.length);
  assert.equal(subs.size, 14);
});

test('cada problema: a lo más 4 colores, distintos, y la correcta se escribe como sus distractores', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length, `semilla ${s}: colores ${colores}`);
    const usadas = new Set([...p.enunciado, ...p.pregunta, ...p.solucion.flat()].filter(x => x && x.v).map(x => x.v));
    for (const k of usadas) assert.ok(p.variables[k], `semilla ${s}: ${k} sin color`);
    const forma = t => (t.includes('π') ? 'pi' : t.includes('√') ? 'r3' : 'q');
    assert.equal(new Set(p.alternativas.map(a => forma(a.texto))).size, 1, `semilla ${s}: ${p.alternativas.map(a => a.texto)}`);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
  }
});

test('papel.json: entre 6 y 8 problemas, cada uno verificado contra calc', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const pr of papel.problemas) {
    assert.ok(pr.id && pr.enunciado && pr.respuesta && pr.pasos.length && pr.verificar.length, pr.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    for (const vf of pr.verificar) {
      const fn = gen.calc[vf.fn];
      assert.ok(fn, `${pr.id}: no existe calc.${vf.fn}`);
      const valor = fn(...vf.args);
      // espera: número, { pi: n, den: m } = nπ/m, o { r3: n, den: m } = n√3/m.
      const e = vf.espera, esperado = typeof e === 'number' ? e : (e.pi !== undefined ? e.pi * PI : e.r3 * R3) / (e.den || 1);
      assert.ok(Math.abs(valor - esperado) < 1e-9 * Math.max(1, Math.abs(esperado)), `${pr.id}: ${vf.fn} da ${valor}, se esperaba ${esperado}`);
    }
  }
});
