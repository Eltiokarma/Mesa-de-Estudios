// Pruebas del generador de relaciones métricas en la circunferencia: casos.json (verificados aparte,
// a ciegas), papel.json contra calc, y un recálculo independiente en 600 problemas: se arma la figura
// con coordenadas (circunferencias, rectas tangentes, cortes) y se busca lo que falta numéricamente.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
// Raíz de g en [lo, hi] por bisección (g cambia de signo en el intervalo).
function raiz(g, lo, hi) {
  let glo = g(lo);
  assert.ok(glo * g(hi) <= 0, 'la bisección no encierra una raíz');
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, gm = g(m); if (gm * glo > 0) { lo = m; glo = gm; } else hi = m; }
  return (lo + hi) / 2;
}
// Distancia desde E, en la dirección d (unitaria), hasta la circunferencia (O, ρ), con E dentro (raíz positiva).
function rayo(E, d, O, rho) {
  const w = [E[0] - O[0], E[1] - O[1]], b = w[0] * d[0] + w[1] * d[1], c = w[0] ** 2 + w[1] ** 2 - rho * rho;
  return -b + Math.sqrt(b * b - c);
}
// Cortes de una recta que sale de P en dirección d con la circunferencia (O, ρ): [cerca, lejos] o null.
function cortes(P, d, O, rho) {
  const w = [P[0] - O[0], P[1] - O[1]], b = w[0] * d[0] + w[1] * d[1], c = w[0] ** 2 + w[1] ** 2 - rho * rho, D = b * b - c;
  if (D < 0) return null;
  return [-b - Math.sqrt(D), -b + Math.sqrt(D)];
}
const distRecta = (O, P, Q) => Math.abs((Q[0] - P[0]) * (P[1] - O[1]) - (P[0] - O[0]) * (Q[1] - P[1])) / dist(P, Q);
// Secante horizontal: la circunferencia de centro (0, 0) y radio ρ (por defecto AB); A y B a la altura y0; P a la izquierda de A.
function figuraSecante(PA, AB, rho = AB) {
  const y0 = -Math.sqrt(rho * rho - AB * AB / 4), P = [-AB / 2 - PA, y0];
  return { P, O: [0, 0], rho, PT: Math.sqrt(dist(P, [0, 0]) ** 2 - rho * rho) };
}
// Triángulo con B = (0, 0), C = (a, 0), AB = c, AC = b.
function triangulo(a, b, c) {
  const t = raiz(th => dist([c * Math.cos(th), c * Math.sin(th)], [a, 0]) - b, 1e-12, Math.PI - 1e-12);
  return { A: [c * Math.cos(t), c * Math.sin(t)], B: [0, 0], C: [a, 0] };
}
// Tangente del ángulo → ángulo de academia (cos 37° = 4/5; 53°/2 tiene tangente 1/2; 37°/2, 1/3).
const TAN = { 45: 1, 26.5: 0.5, 63.5: 2, 18.5: 1 / 3, 71.5: 3, 37: 0.75, 53: 4 / 3 };
const academia = t => { for (const [g, v] of Object.entries(TAN)) if (Math.abs(t - v) < 1e-7) return Number(g); return NaN; };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'tangente': {
      if (d.sub === 'pt') return figuraSecante(d.a, d.c).PT;
      if (d.sub === 'secante') { const c = raiz(c => figuraSecante(d.a, c).PT - d.t, 1e-9, 1000); return c; }
      if (d.sub === 'razon') { const k = raiz(k => figuraSecante(d.p * k, d.q * k).PT - Math.sqrt(d.t2), 1e-9, 100); return d.q * k; }
      if (d.sub === 'centro') return raiz(rho => Math.sqrt((d.a + rho) ** 2 - rho * rho) - d.t, 1e-9, 1000);
      // semicírculo: centro (w − ρ, 0), tangente a la diagonal AC.
      const rho = raiz(r => distRecta([d.w - r, 0], [0, 0], [d.w, d.h]) - r, 1e-9, d.w / 2);
      if (d.pide === 'perimetro') { const f6 = x => (Math.round(x * 1e6) / 1e6).toFixed(6); return `pq:${f6(rho)}|${f6(2 * rho)}`; }
      return Math.PI * rho;
    }
    case 'secantes': {
      const F = figuraSecante(d.PA, d.AB, 50 * d.AB); // radio grande: así el corte cercano puede quedar tan cerca de P como haga falta
      // Segunda secante desde P: se gira hasta que el corte cercano quede a PC.
      const dir = a => [Math.cos(a), Math.sin(a)];
      const aT = Math.atan2(-F.P[1], -F.P[0]) + Math.asin(F.rho / dist(F.P, F.O)); // dirección tangente
      const a0 = Math.atan2(-F.P[1], -F.P[0]);
      const alfa = raiz(a => { const c = cortes(F.P, dir(a), F.O, F.rho); return (c ? c[0] : 1e9) - d.PC; }, a0, aT - 1e-12);
      const [pc, pd] = cortes(F.P, dir(alfa), F.O, F.rho);
      assert.ok(Math.abs(pc - d.PC) < 1e-6);
      return pd - pc;
    }
    case 'cuerdas': {
      if (d.sub === 'cuarto') {
        const E = [0, 0], O = [(d.EB - d.AE) / 2, 100], rho = dist(O, [-d.AE, 0]);
        // Se gira la cuerda CD por E hasta que EC = CE.
        const base = Math.atan2(E[1] - O[1], E[0] - O[0]); // dirección desde O hacia E: ahí la distancia es mínima
        const th = raiz(t => rayo(E, [Math.cos(base + t), Math.sin(base + t)], O, rho) - d.CE, 0, Math.PI);
        return rayo(E, [-Math.cos(base + th), -Math.sin(base + th)], O, rho);
      }
      const E = [0, 0], O = [(d.ED - d.CE) / 2, 100], rho = dist(O, [-d.CE, 0]);
      const base = Math.atan2(E[1] - O[1], E[0] - O[0]) + Math.PI / 2; // cuerda perpendicular a OE: la más corta
      const largo = t => rayo(E, [Math.cos(base + t), Math.sin(base + t)], O, rho) + rayo(E, [-Math.cos(base + t), -Math.sin(base + t)], O, rho);
      const th = raiz(t => largo(t) - d.L, 0, Math.PI / 2);
      return Math.max(rayo(E, [Math.cos(base + th), Math.sin(base + th)], O, rho), rayo(E, [-Math.cos(base + th), -Math.sin(base + th)], O, rho));
    }
    case 'tangentes-iguales': {
      if (d.sub === 'incirculo') {
        const T = triangulo(d.a, d.b, d.c), s = d.a + d.b + d.c;
        const I = [(d.a * T.A[0] + d.b * T.B[0] + d.c * T.C[0]) / s, (d.a * T.A[1] + d.b * T.B[1] + d.c * T.C[1]) / s];
        return I[0]; // el pie de I sobre BC (eje x) está en x = I.x, medido desde B
      }
      const Oc = [d.L / 2, d.L / 2];
      const n = raiz(n => distRecta(Oc, [d.AM, 0], [0, n]) - d.L / 2, 1e-9, d.L / 2);
      return Math.hypot(d.AM, n);
    }
    case 'pitot': {
      if (d.sub === 'general') {
        // Tangentes desde cada vértice: con una cualquiera (tA) salen las demás.
        const tA = 1, tB = d.AB - tA, tC = d.BC - tB, tD = d.CD - tC;
        return tD + tA;
      }
      if (d.sub === 'isosceles') {
        // Circunferencia de centro (0, ρ) tangente a las bases y = 0 e y = 2ρ y al lado de (B/2, 0) a (b/2, 2ρ).
        const g = rho => distRecta([0, rho], [d.B / 2, 0], [d.b / 2, 2 * rho]) - rho;
        return raiz(g, 1e-6, 1000);
      }
      const [s, c] = { 53: [0.8, 0.6], 37: [0.6, 0.8], 74: [0.96, 0.28], 16: [0.28, 0.96] }[d.ang];
      const O = [d.r, d.r];
      // D = (x, 0); el lado DC sube hacia la izquierda con el ángulo ADC.
      return raiz(x => distRecta(O, [x, 0], [x - c, s]) - d.r, 2 * d.r, 1000);
    }
    case 'poncelet': {
      if (d.sub === 'radio') {
        const c = Math.hypot(d.a, d.b);
        return (d.a * d.b / 2) / ((d.a + d.b + c) / 2);
      }
      const rDe = a => { const b = Math.sqrt(d.c * d.c - a * a); return (a * b / 2) / ((a + b + d.c) / 2); };
      const a = raiz(a => rDe(a) - d.r, 1e-9, d.c / Math.SQRT2);
      return a + Math.sqrt(d.c * d.c - a * a) + d.c;
    }
    case 'arcos-cuerdas': {
      if (d.sub === 'congruencia') {
        // E en el origen: A y C sobre el eje x, D y B sobre la recta que forma ang con EA. EC = EB = q y ED = EA = p
        // son lo que da la congruencia; se comprueba que los cuatro puntos son concíclicos y que AB = CD.
        const t = d.ang * Math.PI / 180, A = [d.p, 0], C = [-d.q, 0], D = [d.p * Math.cos(t), d.p * Math.sin(t)], B = [-d.q * Math.cos(t), -d.q * Math.sin(t)];
        // Centro: intersección de las mediatrices de AC y de AD.
        const ox = (A[0] + C[0]) / 2, mx = (A[0] + D[0]) / 2, my = (A[1] + D[1]) / 2, dx = D[0] - A[0], dy = D[1] - A[1];
        const oy = (dx * (mx - ox) + dy * my) / dy, O = [ox, oy], rho = dist(O, A);
        for (const X of [B, C, D]) assert.ok(Math.abs(dist(O, X) - rho) < 1e-9, 'no son concíclicos');
        assert.ok(Math.abs(dist(A, B) - dist(C, D)) < 1e-9, 'AB ≠ CD');
        return dist(A, D);
      }
      const AB = h => dist([-h, -Math.sqrt(d.R * d.R - h * h)], [0, -d.R]);
      if (d.sub === 'cuerda') return AB(d.AC / 2);
      return 2 * raiz(h => AB(h) - Math.sqrt(d.AB2), 1e-9, d.R);
    }
    case 'inscriptible': {
      const L = d.L, A = [0, L], C = [L, 0], M = [d.m, 0], N = [L, d.m];
      // P = AM ∩ BN, con B = (0, 0): BN = s·N; AM = A + t(M − A).
      const t = raiz(t => { const X = [A[0] + t * (M[0] - A[0]), A[1] + t * (M[1] - A[1])]; return X[1] * N[0] - X[0] * N[1]; }, 0, 1);
      const Pp = [A[0] + t * (M[0] - A[0]), A[1] + t * (M[1] - A[1])];
      const Q = d.pide === 'MPC' ? M : N;
      const u1 = [Q[0] - Pp[0], Q[1] - Pp[1]], u2 = [C[0] - Pp[0], C[1] - Pp[1]];
      const ang = Math.atan2(Math.abs(u1[0] * u2[1] - u1[1] * u2[0]), u1[0] * u2[0] + u1[1] * u2[1]);
      return academia(Math.tan(ang));
    }
  }
  return NaN;
}
const igual = (a, b) => (typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(typeof c.esperado.respuesta === 'string' ? p.respuesta.valor === c.esperado.respuesta
      : Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    vistos.add(p._datos.tipo + '/' + (p._datos.sub || ''));
    if (p._datos.pide === 'perimetro') vistos.add('perimetro-region');
    const conGrado = p.alternativas.filter(a => /°/.test(a.texto)).length, conPi = p.alternativas.filter(a => a.texto.includes('π')).length;
    assert.ok(conGrado === 0 || conGrado === p.alternativas.length, `semilla ${s}: mezcla ángulos`);
    assert.ok(conPi === 0 || conPi === p.alternativas.length, `semilla ${s}: mezcla π`);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal (${a.texto})`);
    const vars = Object.values(p.variables);
    assert.ok(vars.length <= 4 && new Set(vars.map(x => x.color)).size === vars.length, `semilla ${s}: colores`);
  }
  for (const t of ['tangente/pt', 'tangente/secante', 'tangente/razon', 'tangente/centro', 'tangente/semicirculo', 'secantes/',
    'cuerdas/cuarto', 'cuerdas/partes', 'tangentes-iguales/incirculo', 'tangentes-iguales/esquina', 'pitot/general',
    'pitot/isosceles', 'pitot/rectangulo', 'poncelet/radio', 'poncelet/perimetro', 'arcos-cuerdas/cuerda',
    'arcos-cuerdas/al-reves', 'arcos-cuerdas/congruencia', 'inscriptible/', 'perimetro-region']) assert.ok(vistos.has(t), `no salió ${t}`);
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
    assert.ok(!/\d\.\d/.test(q.enunciado + ' ' + q.respuesta + ' ' + q.pasos.join(' ')), `${q.id}: se escribe con coma decimal`);
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

// ---------- Controles de la revisión ----------
// El valor numérico de una alternativa (las claves «pq:p|q» valen p·π + q).
const valorNum = x => (typeof x === 'string' ? (([p, q]) => Math.PI * Number(p) + Number(q))(x.slice(3).split('|')) : x);
test('la correcta no es siempre la mayor ni la menor (máx. 60 % por subtipo, en 600 semillas)', () => {
  const cuenta = {};
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), k = p._datos.tipo + '/' + (p._datos.sub || '') + (p._datos.pide ? '/' + p._datos.pide : '');
    const vals = p.alternativas.map(a => valorNum(a.valor)), c = valorNum(p.respuesta.valor);
    const extremo = c >= Math.max(...vals) - 1e-9 || c <= Math.min(...vals) + 1e-9;
    cuenta[k] = cuenta[k] || [0, 0]; cuenta[k][0] += extremo ? 1 : 0; cuenta[k][1]++;
  }
  const malos = Object.entries(cuenta).filter(([, [e, t]]) => t >= 5 && e / t > 0.6).map(([k, [e, t]]) => `${k}: ${e}/${t}`);
  assert.deepEqual(malos, []);
});
test('cada variable con color aparece en el problema y cada color usado está declarado; ids de error únicos', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), usadas = new Set();
    for (const parte of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of parte) if (x && typeof x === 'object') usadas.add(x.v);
    for (const k of Object.keys(p.variables)) assert.ok(usadas.has(k), `semilla ${s}: la variable ${k} no se usa`);
    for (const k of usadas) assert.ok(p.variables[k], `semilla ${s}: ${k} sin declarar`);
    const ids = p.alternativas.filter(a => !a.correcta).map(a => a.error.id);
    assert.equal(new Set(ids).size, ids.length, `semilla ${s}: ids repetidos ${ids}`);
  }
});
