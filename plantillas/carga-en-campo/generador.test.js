// Pruebas del generador «La carga que gira en el imán»: casos.json (verificados aparte), papel.json y
// un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Camino independiente ----------
// No se usan r = mv/(qB) ni T = 2πm/(qB): se integra la ley de fuerza F = q·(E + v × B) con RK4,
// en pasos que giran la velocidad 0,002 rad (0,01 rad dentro de las bisecciones), y se miden en la trayectoria el periodo (cuando la
// velocidad perpendicular ha girado 2π), el diámetro (la mayor distancia al punto de entrada en el
// plano perpendicular al campo) y el avance a lo largo del campo en una vuelta. Lo que se despeja
// (masa, voltaje, rapidez) se busca por bisección sobre la simulación. El campo de la espira se
// suma con Biot y Savart en 4000 tramos; la corriente del riel sale de Kirchhoff por bisección.
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const suma = (a, b, k = 1) => a.map((x, i) => x + k * b[i]);
function vuelta(q, m, v0, B, paso = 0.002) {
  const Bv = [0, 0, B], acc = v => cruz(v, Bv).map(x => x * q / m);
  const vp = Math.hypot(v0[0], v0[1]), dt = paso * vp / (Math.abs(q) * vp * B / m);
  let x = [0, 0, 0], v = v0.slice(), t = 0, giro = 0, dmax = 0;
  for (;;) {
    const k1v = acc(v), k1x = v;
    const k2v = acc(suma(v, k1v, dt / 2)), k2x = suma(v, k1v, dt / 2);
    const k3v = acc(suma(v, k2v, dt / 2)), k3x = suma(v, k2v, dt / 2);
    const k4v = acc(suma(v, k3v, dt)), k4x = suma(v, k3v, dt);
    const nv = v.map((s, i) => s + dt / 6 * (k1v[i] + 2 * k2v[i] + 2 * k3v[i] + k4v[i]));
    const nx = x.map((s, i) => s + dt / 6 * (k1x[i] + 2 * k2x[i] + 2 * k3x[i] + k4x[i]));
    let d = Math.atan2(nv[1], nv[0]) - Math.atan2(v[1], v[0]);
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    d = Math.abs(d);
    if (giro + d >= 2 * Math.PI) {
      const f = (2 * Math.PI - giro) / d;
      return { T: t + f * dt, diametro: dmax, avance: x[2] + f * (nx[2] - x[2]) };
    }
    giro += d; t += dt; x = nx; v = nv;
    dmax = Math.max(dmax, Math.hypot(x[0], x[1]));
  }
}
function biseccion(g, a, b, log = false) {
  let ga = g(a);
  for (let i = 0; i < 45; i++) {
    const mm = log ? Math.sqrt(a * b) : (a + b) / 2, gm = g(mm);
    if ((gm > 0) === (ga > 0)) { a = mm; ga = gm; } else b = mm;
  }
  return log ? Math.sqrt(a * b) : (a + b) / 2;
}
function campoEspira(R, I, n = 4000) { // Biot y Savart en el centro
  let Bz = 0;
  for (let k = 0; k < n; k++) {
    const a = 2 * Math.PI * (k + 0.5) / n, da = 2 * Math.PI / n;
    const pos = [R * Math.cos(a), R * Math.sin(a), 0], dl = [-R * Math.sin(a) * da, R * Math.cos(a) * da, 0];
    const rv = pos.map(s => -s), r = Math.hypot(...rv);
    Bz += 1e-7 * I * cruz(dl, rv)[2] / r ** 3;
  }
  return Bz;
}
const SEN = { 30: 0.5, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2 };
const COS = { 30: Math.sqrt(3) / 2, 37: 0.8, 53: 0.6, 60: 0.5 };
const PROTON = { m: 1.6e-27, q: 1.6e-19 };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'radio' && d.sub === 'radio') return vuelta(d.q, d.m, [d.v, 0, 0], d.B).diametro / 2 * 100;
  if (d.tipo === 'radio') {
    const rad = v => vuelta(PROTON.q, PROTON.m, [v, 0, 0], 1).diametro / 2;
    if (d.modo === 'v') return rad(d.v2) / rad(d.v1);
    const vK = K => Math.sqrt(2 * K * 1.6e-16 / PROTON.m);
    return rad(vK(d.K2)) / rad(vK(d.K1));
  }
  if (d.tipo === 'periodo' && d.sub === 'periodo') return vuelta(d.q, d.m, [d.v, 0, 0], d.B).T;
  if (d.tipo === 'periodo' && d.sub === 'masa') {
    const objetivo = d.t / d.n;
    return biseccion(m => vuelta(d.q, m, [1e5, 0, 0], d.B, 0.01).T - objetivo, 1e-31, 1e-22, true);
  }
  if (d.tipo === 'periodo') {
    const T = (v, B) => vuelta(PROTON.q, PROTON.m, [v, 0, 0], B).T;
    return d.modo === 'v' ? d.T0 * T(d.k * 1e5, 1) / T(1e5, 1) : d.T0 * T(1e5, d.k) / T(1e5, 1);
  }
  if (d.tipo === 'helice') {
    const w = vuelta(d.q, d.m, [d.v * SEN[d.angulo], 0, d.v * COS[d.angulo]], d.B);
    if (d.sub === 'paso') return w.avance * 100;
    return `${Math.abs(w.avance) > 0 ? 'helice' : 'circunferencia'}:${w.diametro / 2 * 100}`;
  }
  if (d.tipo === 'potencial') {
    // Energía: el trabajo |q|·V se lo lleva la carga como ½·m·v² (el campo eléctrico la empuja desde el reposo).
    const rDeV = (V, paso) => vuelta(d.q, d.m, [Math.sqrt(2 * d.q * V / d.m), 0, 0], d.B, paso).diametro / 2;
    if (d.sub === 'radio') return rDeV(d.V) * 100;
    return biseccion(V => rDeV(V, 0.01) - d.r, 1e-3, 1e9, true);
  }
  if (d.tipo === 'cruzados') {
    // Fuerza total cero: E (en y) + v (en x) × B (en z), por componentes.
    if (d.sub === 'campo') { const E = Math.abs(cruz([d.v, 0, 0], [0, 0, d.B])[1]); return d.pide === 'E' ? E : E * d.d; } // ΔV = ∫E·dl entre placas
    const E = [0, d.dV / d.d, 0];
    return biseccion(v => E[1] + cruz([v, 0, 0], [0, 0, d.B])[1], 1, 1e10, true);
  }
  if (d.tipo === 'riel') {
    const I = biseccion(i => d.eps - i * d.R, 0, 1000);
    const F = Math.hypot(...cruz([0, d.L, 0], [0, 0, d.B]).map(x => x * I));
    return d.sub === 'fuerza' ? F : F / d.m;
  }
  const B1 = campoEspira(d.R, 1);
  if (d.sub === 'voltaje') return d.B / B1 * d.Ral;
  return d.V / d.Ral * B1;
}

function parecido(a, b) {
  if (typeof a === 'string' || typeof b === 'string') {
    const [fa, na] = String(a).split(':'), [fb, nb] = String(b).split(':');
    return fa === fb && Math.abs(+na - +nb) <= 1e-4 * Math.abs(+nb);
  }
  return Math.abs(a - b) <= 1e-4 * Math.max(Math.abs(a), Math.abs(b));
}
probarGenerador(gen, { semillas: 600, recalcular, igual: parecido });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.ok(parecido(p.respuesta.valor, c.esperado.respuesta), `da ${p.respuesta.valor}`);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia * Math.abs(c.esperado.respuesta), `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const TIPOS = ['cruzados/campo', 'cruzados/rapidez', 'espira/campo', 'espira/voltaje', 'helice/paso', 'helice/radio', 'periodo/cambio', 'periodo/masa',
  'periodo/periodo', 'potencial/radio', 'potencial/voltaje', 'radio/cociente', 'radio/radio', 'riel/aceleracion', 'riel/fuerza'];
const unidad = t => t.replace(/^(Hélice|Circunferencia) de /, '').replace(/ × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '').replace(/^[−\d ,π/√]+/, '').replace(/ de radio$/, '');
test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set();
  let mT = 0, diam = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.mT) mT++;
    if (d.diametro) diam++;
    const alt = p.alternativas;
    assert.equal(new Set(alt.map(a => unidad(a.texto))).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    assert.ok(alt.every(a => !/NaN|Infinity|undefined/.test(a.texto)), `semilla ${s}`);
  }
  assert.deepEqual([...vistos].sort(), TIPOS);
  assert.ok(mT > 60 && diam > 5, `mT: ${mT}, diámetros: ${diam}`);
});

test('en la hélice salen las dos formas de trayectoria entre las opciones', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'helice' || p._datos.sub !== 'radio') continue;
    const textos = p.alternativas.map(a => a.texto);
    assert.ok(textos.some(t => t.startsWith('Hélice')) && textos.some(t => t.startsWith('Circunferencia')), `semilla ${s}`);
    assert.ok(p.alternativas.find(a => a.correcta).texto.startsWith('Hélice'));
  }
});

test('la pregunta no trae la respuesta y los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const correcta = p.alternativas.find(a => a.correcta).texto;
    // En «periodo/cambio» con otra rapidez, la respuesta es el dato: esa es la trampa.
    if (correcta.includes(' ') && p._datos.modo !== 'v') assert.ok(!(plano(p.enunciado).replace(/\(µ0[^)]*\)/, '') + plano(p.pregunta)).includes(correcta), `semilla ${s}: la pregunta dice «${correcta}»`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
    for (const seg of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof seg === 'object') assert.ok(p.variables[seg.v], `semilla ${s}: variable ${seg.v} sin color`);
  }
});

// ---------- Lápiz y papel ----------
const PAPEL = {
  radio: ([m, q, v, B]) => m * v / (q * B),
  periodo: ([m, q, B]) => 2 * Math.PI * m / (q * B),
  razon: ([a, b]) => b / a,
  voltaje: ([m, q, r, B]) => (q * B * r) ** 2 / (2 * m * q),
  helice: ([m, q, v, sen, cos, B]) => ({ r: m * v * sen / (q * B), paso: v * cos * 2 * Math.PI * m / (q * B) }),
  cruzados: ([v, B, d]) => ({ E: v * B, dV: v * B * d }),
  riel: ([eps, R, L, B]) => B * (eps / R) * L,
  espira: ([R, Ral, B]) => 2 * R * B / (4 * Math.PI * 1e-7) * Ral,
};
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) || Math.abs(a - b) <= 1e-12 * Math.max(Math.abs(a), Math.abs(b));
test('papel.json: de 5 a 10 problemas propios, completos y verificados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  const ps = papel.problemas;
  assert.ok(ps.length >= 5 && ps.length <= 10, `${ps.length} problemas`);
  assert.equal(new Set(ps.map(x => x.id)).size, ps.length, 'ids repetidos');
  for (const x of ps) {
    for (const k of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(typeof x[k] === 'string' && x[k], `${x.id}: falta ${k}`);
    assert.ok(Array.isArray(x.pasos) && x.pasos.length, `${x.id}: sin pasos`);
    assert.ok(Array.isArray(x.verificar) && x.verificar.length, `${x.id}: sin verificar`);
    assert.ok(![x.enunciado, x.respuesta, ...x.pasos].some(t => /<[a-z/]/i.test(t)), `${x.id}: tiene HTML`);
    for (const vf of x.verificar) {
      const r = PAPEL[vf.tipo](vf.args);
      if (typeof vf.espera === 'number') assert.ok(cerca(r, vf.espera), `${x.id}: da ${r}, espera ${vf.espera}`);
      else for (const k of Object.keys(vf.espera)) assert.ok(cerca(r[k], vf.espera[k]), `${x.id}.${k}: da ${r[k]}, espera ${vf.espera[k]}`);
    }
  }
});

// ---------- Forma de las alternativas ----------
// Sin distractores absurdos (de 1/20 a 20 veces la correcta), la correcta no se reconoce por ser la
// única «redonda» (la de menos cifras significativas), y el generador no se queda sin problema.
const cifras = t => { const m = t.replace(/ × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '').match(/\d[\d ,]*/); if (!m) return 9; return m[0].replace(/[ ,]/g, '').replace(/^0+/, '').replace(/0+$/, '').length || 1; };
test('alternativas sin absurdos y con la misma limpieza que la correcta (600 semillas)', () => {
  let redonda = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta);
    const ids = p.alternativas.filter(a => a.error).map(a => a.error.id);
    assert.equal(new Set(ids).size, ids.length, `semilla ${s}: un id repetido (${ids})`);
    const textos = p.alternativas.map(a => a.texto).filter(t => !t.startsWith('Φ'));
    assert.ok(textos.every(t => t.includes('π')) || textos.every(t => !t.includes('π')), `semilla ${s}: π disparejo (${textos})`);
    if (typeof c.valor === 'number') for (const a of p.alternativas) {
      const r = Math.abs(a.valor / c.valor);
      assert.ok(r >= 1 / 20 - 1e-12 && r <= 20 + 1e-9, `semilla ${s}: «${a.texto}» frente a «${c.texto}»`);
    }
    if (cifras(c.texto) < Math.min(...p.alternativas.filter(a => !a.correcta).map(a => cifras(a.texto)))) redonda++;
  }
  assert.ok(redonda / 600 < 0.1, `la correcta es la única redonda en ${redonda} de 600`);
});
test('nunca se queda sin problema (semillas 0 a 2000 y de texto)', () => {
  for (const s of [...Array(2001).keys(), 'entrada-1', 'salida-3', 'alternativas-0', 'alternativas-599']) assert.ok(gen.generar(s).alternativas.length >= 4, `semilla ${s}`);
});
