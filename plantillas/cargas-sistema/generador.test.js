// Pruebas del generador «Tres cargas en el plano»: casos.json (calculados aparte), papel.json y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: se ponen las cargas en coordenadas (en metros y coulombs, SI) y
//   - la energía del sistema se calcula ARMÁNDOLO: se traen las cargas una por una desde lejos y se
//     suma el trabajo q·V que hace falta en el potencial de las que ya están;
//   - la razón Q/q para energía cero se busca por bisección sobre esa energía;
//   - en la gráfica, el potencial en otro punto se integra desde el campo (V2 = V1 − ∫E·dr, Simpson) y
//     el campo se saca derivando V(r) numéricamente;
//   - el campo resultante se suma como vectores en 3D (no con los factores del generador).
const K = 9e9;
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], (p[2] || 0) - (q[2] || 0));
function armar(cargas) { // cargas: [{ q (C), p: [x, y, z] }]
  let W = 0;
  cargas.forEach((c, i) => { for (let j = 0; j < i; j++) W += c.q * K * cargas[j].q / dist(c.p, cargas[j].p); });
  return W;
}
function geometria(d) { // posiciones en m a partir de los datos
  if (d.sub === 'linea') { const a = d.pares[0][2] / 100, b = d.pares[1][2] / 100; return [[0, 0], [a, 0], [a + b, 0]]; }
  if (d.sub === 'triangulo') {
    if (d.pares[2][2] === 50) return [[0, 0.3], [0, 0], [0.4, 0]];
    const l = d.pares[0][2] / 100; return [[0, 0], [l, 0], [l / 2, l * Math.sqrt(3) / 2]];
  }
  return [[0, 0], [0.3, 0], [0.3, 0.4], [0, 0.4]];
}
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
function simpson(g, a, b, n = 2000) {
  const hh = (b - a) / n; let s = g(a) + g(b);
  for (let i = 1; i < n; i++) s += g(a + i * hh) * (i % 2 ? 4 : 2);
  return s * hh / 3;
}
function campoEn(cargas, P) {
  const E = [0, 0, 0];
  for (const c of cargas) {
    const r = [P[0] - c.p[0], P[1] - c.p[1], P[2] - c.p[2]], d = Math.hypot(...r);
    for (let i = 0; i < 3; i++) E[i] += K * c.q * r[i] / d ** 3;
  }
  return Math.hypot(...E);
}
function cargasCampo(d) {
  const a = d.a, q = d.q * 1e-6;
  const C = (s, p) => ({ q: s * q, p });
  if (d.config === 'tri-iguales' || d.config === 'tri-opuestas') {
    const sB = d.config === 'tri-iguales' ? 1 : -1;
    return [[C(1, [0, 0, 0]), C(sB, [a, 0, 0])], [a / 2, a * Math.sqrt(3) / 2, 0]];
  }
  const sq = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0]]; // A, B, C, D en orden
  if (d.config === 'cuad-adyacentes') return [[C(1, sq[0]), C(1, sq[1]), C(-1, sq[2]), C(-1, sq[3])], [a / 2, a / 2, 0]];
  if (d.config === 'cuad-tres') return [[C(1, sq[0]), C(1, sq[1]), C(1, sq[2]), C(-1, sq[3])], [a / 2, a / 2, 0]];
  const arriba = sq.map(([x, y]) => [x, y, a]);
  const signos = d.config === 'cubo-iguales' ? [1, 1, 1, 1] : [1, 1, -1, -1];
  return [arriba.map((p, i) => C(signos[i], p)), [a / 2, a / 2, 0]];
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'energia' && d.sub === 'razon-nula') {
    const u = 0.1; // la escala no importa
    const pos = [[0, 0], [d.a * u, 0], [(d.a + d.b) * u, 0]];
    const U = Q => armar([{ q: 1, p: pos[0] }, { q: Q, p: pos[1] }, { q: d.m, p: pos[2] }]);
    return biseccion(U, -10, 0);
  }
  if (d.tipo === 'energia') return armar(d.q.map((q, i) => ({ q: q * 1e-6, p: geometria(d)[i] }))) * 1e3;
  if (d.tipo === 'grafica') {
    const q = biseccion(x => K * x / d.r1 - d.v1, 0, 1e-3); // la carga que hace pasar la curva por el punto
    if (d.sub === 'carga') return q * 1e9;
    const E = r => K * q / (r * r), V = r => d.v1 - simpson(E, d.r1, r);
    if (d.sub === 'v-otra') return V(d.r2);
    const hh = 1e-4 * d.r2;
    return -(V(d.r2 + hh) - V(d.r2 - hh)) / (2 * hh);
  }
  const [cargas, P] = cargasCampo(d);
  return campoEn(cargas, P) / 1e5;
}
probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.max(1, Math.abs(c.esperado.respuesta)), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad; hay energías negativas', () => {
  const vistos = new Set(), configs = new Set();
  let negativas = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.config) configs.add(d.config);
    if (d.tipo === 'energia' && p.respuesta.valor < 0) negativas++;
    const unidad = a => (/[a-zA-Z]/.test(a.texto) ? a.texto.split(' ').pop() : '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
    if (d.tipo === 'campo') assert.ok(/√|^\d+ ×/.test(p.alternativas.find(a => a.correcta).texto), `semilla ${s}: el campo no sale exacto`);
  }
  assert.deepEqual([...vistos].sort(), ['campo/cuadrado', 'campo/cubo', 'campo/triangulo', 'energia/linea', 'energia/razon-nula', 'energia/rectangulo', 'energia/triangulo',
    'grafica/carga', 'grafica/e-otra', 'grafica/v-otra']);
  assert.equal(configs.size, 6);
  assert.ok(negativas > 20, `solo ${negativas} energías negativas`);
});

test('las trampas de la admisión salen: pares dos veces, par de los extremos, 1/r² y suma de módulos', () => {
  const ids = new Set();
  for (let s = 0; s < 600; s++) for (const a of gen.generar(s).alternativas) if (a.error) ids.add(a.error.id);
  for (const id of ['CS-pares-dos-veces', 'CS-olvida-extremos', 'CS-distancia-extremos', 'CS-inverso-cuadrado', 'CS-suma-modulos', 'CS-sin-signo', 'CS-e-por-v'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('los textos no dicen «de el» ni «a el»; la pregunta no da la respuesta', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!plano(p.pregunta).includes(correcta), `semilla ${s}: la pregunta trae «${correcta}»`);
  }
});

// ---------- papel.json: estructura y recálculo con funciones propias del test ----------
const VERIFICAR = {
  // energía de un sistema en mJ: cargas en µC y posiciones [x, y] en cm
  'energia-mJ': (qs, pos) => armar(qs.map((q, i) => ({ q: q * 1e-6, p: pos[i].map(x => x / 100) }))) * 1e3,
  // razón Q/q para energía cero con q, Q, m·q en x = 0, a, a + b
  'razon-nula': (a, b, m) => biseccion(Q => armar([{ q: 1, p: [0, 0] }, { q: Q, p: [a, 0] }, { q: m, p: [a + b, 0] }]), -10, 0),
  // potencial y campo de una carga puntual leída en (r1, V1)
  'v-en': (r1, V1, r2) => V1 - simpson(r => V1 * r1 / (r * r), r1, r2),
  'e-en': (r1, V1, r2) => V1 * r1 / (r2 * r2),
  'carga-nC': (r1, V1) => biseccion(x => K * x * 1e-9 / r1 - V1, 0, 1e6),
  // campo en P (en N/C) de cargas en µC con posiciones [x, y, z] en cm
  'campo-NC': (qs, pos, P) => campoEn(qs.map((q, i) => ({ q: q * 1e-6, p: pos[i].map(x => x / 100) })), P.map(x => x / 100)),
};
test('papel.json: de 5 a 10 problemas propios, bien armados y verificados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  const ps = papel.problemas;
  assert.ok(ps.length >= 5 && ps.length <= 10, `${ps.length} problemas`);
  assert.equal(new Set(ps.map(p => p.id)).size, ps.length, 'ids repetidos');
  for (const p of ps) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(typeof p[campo] === 'string' && p[campo].length, `${p.id}: falta ${campo}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2, `${p.id}: pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length >= 1, `${p.id}: verificar`);
    const textos = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/<[a-z\/][^>]*>/i.test(textos), `${p.id}: trae HTML`);
    for (const ver of p.verificar) {
      assert.ok(VERIFICAR[ver.tipo], `${p.id}: tipo desconocido ${ver.tipo}`);
      const r = VERIFICAR[ver.tipo](...ver.args);
      assert.ok(Math.abs(r - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${p.id}: ${ver.tipo} da ${r}, se esperaba ${ver.espera}`);
    }
  }
});
