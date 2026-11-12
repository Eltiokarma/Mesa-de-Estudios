// Pruebas del generador «El flujo que va y vuelve»: casos.json (verificados aparte), papel.json y un
// recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, topeEscala } = require('../../nucleo/probar-generador.js');

// ---------- Camino independiente ----------
// No se usan ΔΦ = 2BA, Φ = BA·cos ωt ni ε = NBAω. El flujo sale del producto escalar entre el campo
// (un vector) y la normal de la espira, que se hace girar o se deja quieta según el caso, y con el
// área que queda dentro del campo. La carga se suma tramo a tramo como corriente por tiempo a lo largo
// de 2000 pasos del proceso; la fem es la derivada numérica del flujo; la frecuencia se cuenta con
// los cambios de signo de la fem en 2 s; la expresión se arma con lo que vale el flujo en t = 0 y en
// un cuarto de vuelta.
const flujo = (Bv, A, th) => A * (Bv[0] * Math.cos(th) + Bv[1] * Math.sin(th));
const omegaDe = d => (d.rpm ? d.rpm / 60 : d.f ? d.f : d.w / (2 * Math.PI)) * 2 * Math.PI; // vueltas/s por rad/vuelta
const angulo0 = d => (d.inicio === 'paralelo' ? -Math.PI / 2 : 0);

function cargaNumerica(d) {
  const n = 2000, dt = d.dt / n;
  const estado = s => { // s de 0 a 1 a lo largo del proceso
    if (d.modo === 'campo') return flujo([d.B * Math.cos(Math.PI * s), 0], d.A, 0);
    if (d.modo === 'giro180') return flujo([d.B, 0], d.A, Math.PI * s);
    if (d.modo === 'giro90') return flujo([d.B, 0], d.A, Math.PI / 2 * s);
    if (d.modo === 'apaga') return flujo([d.B * (1 - s), 0], d.A, 0);
    return flujo([d.B, 0], d.A * (1 - s), 0); // saca: cada vez menos área dentro del campo
  };
  let Q = 0;
  for (let k = 0; k < n; k++) {
    const eps = -d.N * (estado((k + 1) / n) - estado(k / n)) / dt;
    Q += eps / d.R * dt;
  }
  return Math.abs(Q) * 1000;
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'carga') return cargaNumerica(d);
  if (d.tipo === 'femmedia') {
    let F1, F2;
    if (d.sub === 'campo') {
      const B2 = d.modo === 'invierte' ? -d.B2 : d.B2;
      F1 = flujo([d.B1, 0], d.A, 0); F2 = flujo([B2, 0], d.A, 0);
    } else { F1 = flujo([d.B, 0], d.A, 0); F2 = flujo([d.B, 0], d.A, d.modo * Math.PI / 180); }
    return d.N * Math.abs(F2 - F1) / d.dt;
  }
  if (d.sub === 'frecuencia') {
    const Phi = d.modo === 'phi' ? t => d.amp * Math.cos(d.k * Math.PI * t) : t => flujo([1, 0], 1, d.rpm / 60 * 2 * Math.PI * t);
    const L = 2, n = 400000, t0 = 1.234e-6, hh = 1e-7;
    let cambios = 0, prev = null;
    for (let i = 0; i <= n; i++) {
      const t = t0 + L * i / n, e = -(Phi(t + hh) - Phi(t - hh)) / (2 * hh);
      if (prev !== null && (e > 0) !== (prev > 0)) cambios++;
      prev = e;
    }
    return cambios / (2 * L);
  }
  const w = omegaDe(d), th = t => w * t + angulo0(d);
  if (d.sub === 'instante') return flujo([d.B, 0], d.A, th(d.t)) * 1000;
  if (d.sub === 'femmax') {
    const T = 2 * Math.PI / w, n = 20000, hh = T * 1e-7;
    let max = 0;
    for (let i = 0; i < n; i++) {
      const t = T * i / n, e = d.N * Math.abs(flujo([d.B, 0], d.A, th(t + hh)) - flujo([d.B, 0], d.A, th(t - hh))) / (2 * hh);
      max = Math.max(max, e);
    }
    return max;
  }
  // expresión: en t = 0, ¿flujo cero (seno) o máximo (coseno)? La amplitud sale de dos instantes.
  const T = 2 * Math.PI / w, f0 = flujo([d.B, 0], d.A, th(0)), f1 = flujo([d.B, 0], d.A, th(T / 4));
  return `${Math.abs(f0) < 1e-12 ? 'sen' : 'cos'}:${Math.hypot(f0, f1)}:${w}`;
}

function parecido(a, b) {
  if (typeof a === 'string' || typeof b === 'string') {
    const [fa, ...na] = String(a).split(':'), [fb, ...nb] = String(b).split(':');
    return fa === fb && na.length === nb.length && na.every((x, i) => Math.abs(+x - +nb[i]) <= 1e-6 * Math.abs(+nb[i]));
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

const TIPOS = ['armonico/expresion', 'armonico/femmax', 'armonico/frecuencia', 'armonico/instante', 'carga/anular', 'carga/invertir', 'femmedia/campo', 'femmedia/giro'];
const unidad = t => (t.startsWith('Φ = ') ? 'Wb' : t.replace(/ × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/, '').replace(/^[−\d ,π/]+/, ''));
test('salen todos los tipos y subtipos; las alternativas llevan la misma unidad', () => {
  const vistos = new Set(), modos = new Set();
  let negativos = 0, cm2 = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.modo) modos.add(d.sub + '/' + d.modo);
    if (d.inicio) modos.add(d.sub + '/' + d.inicio);
    if (typeof p.respuesta.valor === 'number' && p.respuesta.valor < 0) negativos++;
    if (d.cm2) cm2++;
    const alt = p.alternativas;
    assert.equal(new Set(alt.map(a => unidad(a.texto))).size, 1, `semilla ${s}: unidades distintas (${alt.map(a => a.texto)})`);
    assert.ok(alt.every(a => !/NaN|Infinity|undefined/.test(a.texto)), `semilla ${s}`);
  }
  assert.deepEqual([...vistos].sort(), TIPOS);
  for (const m of ['invertir/campo', 'invertir/giro180', 'anular/apaga', 'anular/saca', 'anular/giro90', 'expresion/paralelo', 'expresion/perpendicular',
    'instante/paralelo', 'instante/perpendicular', 'frecuencia/phi', 'frecuencia/rpm', 'campo/sube', 'campo/baja', 'campo/invierte', 'giro/90', 'giro/180']) assert.ok(modos.has(m), `falta ${m}`);
  assert.ok(negativos > 5 && cm2 > 200, `negativos: ${negativos}, cm²: ${cm2}`);
});

test('con la espira paralela al campo en t = 0, la expresión correcta es un seno y siempre sale la trampa del coseno', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.sub !== 'expresion') continue;
    const correcta = p.alternativas.find(a => a.correcta).texto;
    assert.ok(correcta.includes(d.inicio === 'paralelo' ? 'sen(' : 'cos('), `semilla ${s}: ${correcta}`);
    assert.ok(p.alternativas.some(a => a.error && a.error.id === 'IN-fase-cero'), `semilla ${s}: falta la trampa de la fase`);
  }
});

test('la pregunta no trae la respuesta y los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const correcta = p.alternativas.find(a => a.correcta).texto;
    if (correcta.includes(' ')) assert.ok(!(plano(p.enunciado) + plano(p.pregunta)).includes(correcta), `semilla ${s}: la pregunta dice «${correcta}»`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b|\b1 vueltas\b/.test(todo), `semilla ${s}`);
    for (const seg of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof seg === 'object') assert.ok(p.variables[seg.v], `semilla ${s}: variable ${seg.v} sin color`);
  }
});

// ---------- Lápiz y papel ----------
const PAPEL = {
  carga: ([N, A, B, R, veces]) => N * veces * B * A / R,
  flujo: ([B, A, w, t, fn]) => B * A * (fn === 'sen' ? Math.sin(w * t) : Math.cos(w * t)),
  femmax: ([N, B, A, rpm]) => N * B * A * 2 * Math.PI * rpm / 60,
  frecuencia: ([rpm]) => rpm / 60,
  femmedia: ([N, A, dB, dt]) => N * A * dB / dt,
  phi: ([amp, k]) => ({ emax: amp * k * Math.PI, f: k / 2 }),
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
      assert.ok(r >= 1 / topeEscala(a) - 1e-12 && r <= topeEscala(a) + 1e-9, `semilla ${s}: «${a.texto}» frente a «${c.texto}»`);
    }
    if (cifras(c.texto) < Math.min(...p.alternativas.filter(a => !a.correcta).map(a => cifras(a.texto)))) redonda++;
  }
  assert.ok(redonda / 600 < 0.1, `la correcta es la única redonda en ${redonda} de 600`);
});
test('nunca se queda sin problema (semillas 0 a 2000 y de texto)', () => {
  for (const s of [...Array(2001).keys(), 'entrada-1', 'salida-3', 'alternativas-0', 'alternativas-599']) assert.ok(gen.generar(s).alternativas.length >= 4, `semilla ${s}`);
});
