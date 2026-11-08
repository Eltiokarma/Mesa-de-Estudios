// Pruebas del generador de rumbos: las comunes (600 problemas), casos.json, papel.json y propiedades.
// El recálculo independiente no usa las tablas 3-4-5 del generador: lee los rumbos como texto, los
// convierte en ángulos reales (37° de academia = atan(3/4), 53° = atan(4/3)), suma con Math.sin y
// Math.cos y vuelve a nombrar el rumbo del resultado.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const GRAD = 180 / Math.PI;
const REAL = { 37: Math.atan2(3, 4) * GRAD, 53: Math.atan2(4, 3) * GRAD };
// 'N 37° E' → ángulo real desde el norte en sentido horario.
function angulo(r) {
  const t = r.toLowerCase();
  const puros = { norte: 0, este: 90, sur: 180, oeste: 270 };
  if (t in puros) return puros[t];
  const m = /^([ns]) (\d+)° ([eo])$/.exec(t);
  const th = REAL[m[2]] !== undefined ? REAL[m[2]] : Number(m[2]);
  if (m[1] === 'n') return m[3] === 'e' ? th : 360 - th;
  return m[3] === 'e' ? 180 - th : 180 + th;
}
const paso = (r, L) => [L * Math.sin(angulo(r) / GRAD), L * Math.cos(angulo(r) / GRAD)];
// Ángulo real → nombre de academia (36,87° se llama 37°).
function nombrar(az) {
  az = ((az % 360) + 360) % 360;
  const cerca = (a, b) => Math.abs(a - b) < 1e-6;
  for (const [g, n] of [[0, 'norte'], [90, 'este'], [180, 'sur'], [270, 'oeste'], [360, 'norte']]) if (cerca(az, g)) return n;
  let base, q;
  if (az < 90) { base = az; q = ['N', 'E']; } else if (az < 180) { base = 180 - az; q = ['S', 'E']; }
  else if (az < 270) { base = az - 180; q = ['S', 'O']; } else { base = 360 - az; q = ['N', 'O']; }
  let g = null;
  for (const [k, val] of Object.entries(REAL)) if (cerca(base, val)) g = Number(k);
  if (g === null) g = Math.round(base);
  return `${q[0]} ${g}° ${q[1]}`;
}
// Azimut de academia de un nombre (para la clave).
const azAcad = n => {
  const puros = { norte: 0, este: 90, sur: 180, oeste: 270 };
  if (n in puros) return puros[n];
  const m = /^([NS]) (\d+)° ([EO])$/.exec(n), th = Number(m[2]);
  return m[1] === 'N' ? (m[3] === 'E' ? th : 360 - th) : (m[3] === 'E' ? 180 - th : 180 + th);
};
const clave = (az, d) => `az:${azAcad(nombrar(az))}` + (d === undefined ? '' : `|d2:${Math.round(d * d)}`);
const azDe = (e, n) => Math.atan2(e, n) * GRAD;

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'distancia' || d.tipo === 'regreso') {
    let e = 0, n = 0;
    for (const t of d.tramos) { const [a, b] = paso(t.rumbo, t.largo); e += a; n += b; }
    const dist = Math.hypot(e, n);
    if (d.tipo === 'distancia') return dist;
    return clave(azDe(-e, -n), d.conDistancia ? dist : undefined);
  }
  if (d.tipo === 'moviles') {
    const [A, B] = d.moviles.map(m => paso(m.rumbo, m.rapidez * d.t));
    return Math.hypot(A[0] - B[0], A[1] - B[1]);
  }
  if (d.tipo === 'rapidez') {
    // d² = a² + b² − 2ab cos Δ: la raíz positiva de b² − 2a cosΔ·b + a² − d² = 0.
    const a = d.v1 * d.t, D = (angulo(d.rumbos[0]) - angulo(d.rumbos[1])) / GRAD;
    const c = Math.cos(D), b = a * c + Math.sqrt(a * a * c * c - a * a + d.d2);
    return b / d.t;
  }
  if (d.tipo === 'cuadrado') {
    // Esquinas con trigonometría real; el rumbo pedido se redondea al grado (36,87° → 37°).
    const B = paso(d.rumboB, d.AB), D = paso(d.rumboD, d.AD);
    const pts = { A: [0, 0], B, D, C: [B[0] + D[0], B[1] + D[1]] };
    pts.O = [pts.C[0] / 2, pts.C[1] / 2];
    const az = azDe(pts[d.hacia][0] - pts[d.desde][0], pts[d.hacia][1] - pts[d.desde][1]);
    return `az:${((Math.round(az) % 360) + 360) % 360}`;
  }
  const [P1, P2] = d.lugares.map(l => paso(l.rumbo, l.largo));
  if (d.pide === 'distancia') return Math.hypot(P2[0] - P1[0], P2[1] - P1[1]);
  return clave(azDe(P2[0] - P1[0], P2[1] - P1[1]));
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) < 1e-7 : a === b);
probarGenerador(gen, { semillas: 600, recalcular, igual });

test('salen los seis tipos, con y sin distancia en el regreso, y las dos canchas', () => {
  const tipos = new Set(), extra = new Set();
  for (let s = 0; s < 200; s++) {
    const d = gen.generar(s)._datos; tipos.add(d.tipo);
    if (d.tipo === 'regreso') extra.add('regreso-' + d.conDistancia);
    if (d.tipo === 'cuadrado') extra.add(d.forma);
    if (d.tipo === 'relativo') extra.add('relativo-' + d.pide);
  }
  assert.deepEqual([...tipos].sort(), ['cuadrado', 'distancia', 'moviles', 'rapidez', 'regreso', 'relativo']);
  for (const x of ['regreso-true', 'regreso-false', 'cuadrado', 'rectangulo', 'relativo-rumbo', 'relativo-distancia']) assert.ok(extra.has(x), `falta ${x}`);
});

test('la figura del enunciado no dibuja el recorrido: es la misma rosa en todos los problemas de un lugar', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(s);
    assert.ok(p.figura && /N 20° E/.test(p.figura.svg), `semilla ${s}: falta la rosa`);
    assert.ok(!/<line[^>]*var\(--c-d\)/.test(p.figura.svg), `semilla ${s}: la figura marca lo pedido`);
    assert.ok(p.figuraSolucion && /var\(--c-d\)/.test(p.figuraSolucion.svg));
  }
});

test('las respuestas de rumbo salen con ángulo notable o puro; los rumbos de la cancha se recalculan bien', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    const c = p.alternativas.find(a => a.correcta);
    if (typeof p.respuesta.valor === 'string') {
      const t = c.texto.replace(/^.* al /, '');
      assert.ok(/^(Norte|Este|Sur|Oeste|norte|este|sur|oeste)$/.test(t) || /^[NS] (30|37|45|53|60)° [EO]$/.test(t), `semilla ${s}: ${c.texto}`);
    }
    if (d.tipo === 'cuadrado') assert.equal(gen.calc.rumboEnCancha(d), c.texto.replace(/^[A-Z]/, x => x.toLowerCase()).replace(/^([ns]) /, (m, x) => x.toUpperCase() + ' '));
  }
});

test('en el problema de rapidez, la separación da una sola rapidez positiva (ángulo de 90° o más)', () => {
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo !== 'rapidez') continue;
    const D = Math.abs(angulo(d.rumbos[0]) - angulo(d.rumbos[1])), g = Math.min(D, 360 - D);
    assert.ok(g >= 90 - 1e-9 && g < 180, `semilla ${s}: ${g}`);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(igual(p.respuesta.valor, c.esperado.respuesta), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('papel.json: cada problema se comprueba con calc', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    assert.ok(pr.verificar && pr.verificar.length, `${pr.id}: sin verificar`);
    for (const ver of pr.verificar) {
      const r = gen.calc[ver.fn](...ver.args);
      if (typeof ver.espera !== 'object' || ver.espera === null) { assert.ok(igual(r, ver.espera) || r === ver.espera, `${pr.id}: ${ver.fn} da ${r}`); continue; }
      for (const [k, val] of Object.entries(ver.espera)) {
        if (typeof val === 'number') assert.ok(Math.abs(r[k] - val) < 1e-9, `${pr.id}: ${k} = ${r[k]}`);
        else assert.equal(r[k], val, `${pr.id}: ${k}`);
      }
    }
  }
});
