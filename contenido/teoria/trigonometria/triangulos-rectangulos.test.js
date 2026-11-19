// Pruebas propias de «Resolución de triángulos rectángulos» (docs/etapa7/propuesta-trigonometria.md): la regla de colores
// de la unidad en cada figura y cada texto, misiones de una sola salida, «El dibujo no está a escala» donde lo pedido se
// podría medir, «Ahora tú» que no repite un ejemplo, la convención del examen en los Datos y el validador con calidad 2
// (la unidad la lleva desde el cierre: lector en frío y auditor). Las cuentas se rehacen aparte (scratchpad e7-trigonometria/cuentas.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..', '..');
require(path.join(RAIZ, 'nucleo/kit/kit.js'));
const def = require('./triangulos-rectangulos.js');
for (const r of def.requiere) require(path.join(RAIZ, r));
const Teoria = require(path.join(RAIZ, 'nucleo/teoria.js'));
const curso = require(path.join(RAIZ, 'catalogo/cursos/trigonometria.json'));

const SEM = 400;
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : Object.values(x).map(plano).join('')) : String(x ?? ''));
const NO_ESC = 'El dibujo no está a escala.';

// Todas las figuras de la unidad, con dónde están y el texto del ejercicio que acompañan.
function figuras() {
  const out = [];
  const add = (donde, fig, texto) => { if (fig && fig.datos && (fig.pieza || 'trig-vista') === 'trig-vista') out.push({ donde, datos: fig.datos, texto }); };
  for (const idea of def.ideas) {
    const i = idea.id;
    (idea.lee.tarjetas || []).forEach((t, k) => t.dibujo && add(`${i} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(idea.juega.controles)) add(`${i} juego ${JSON.stringify(v)}`, idea.juega.dibujo(v));
    add(`${i} predice`, idea.predice.dibujo, plano(idea.predice.pregunta)); add(`${i} revelar`, idea.predice.revelar);
    add(`${i} mira`, { datos: idea.mira.datos });
    if (idea.regla.dibujo) add(`${i} regla`, idea.regla.dibujo);
    (idea.ejemplos || []).forEach((e, k) => e.figura && add(`${i} ejemplo ${k + 1}`, e.figura, plano(e.enunciado)));
    for (let s = 0; s < SEM; s++) {
      const r = idea.resuelve.generar(s), a = idea.ahoraTu.generar(s);
      add(`${i} resuelve ${s}`, r.dibujo, plano(r.enunciado));
      r.pasos.forEach((p, k) => p.dibujo && add(`${i} resuelve ${s} paso ${k}`, p.dibujo));
      add(`${i} ahora ${s}`, a.dibujo, plano(a.pregunta));
    }
  }
  return out;
}
const FIGS = figuras();
const ROL = { CO: 'o', CA: 'i', H: null };
const textoDe = (x, e = { final: true }) => (Array.isArray(x) && x.length && typeof x[0] === 'object' ? x[x.length - 1].t : x);

test('colores de la figura: cada lado con el color de su nombre desde el ángulo; lo pedido («?») en tinta; ángulos carmín', () => {
  const malos = [];
  for (const f of FIGS) {
    for (const l of f.datos.lados || []) {
      const t = textoDe(l.texto), pedido = t === '?' || /= \?$/.test(String(t || ''));
      if (l.color && !['o', 'i'].includes(l.color)) malos.push(`${f.donde}: un lado en ${l.color}`);
      if (pedido && l.color) malos.push(`${f.donde}: lo pedido en ${l.color}`);
      // Un lado sin rótulo puede ir en tinta (lector en frío A, 19 nov: el adyacente turquesa sin ser dato ni pedido confundía).
      const sinRotulo = t === undefined || t === null || t === '';
      if (l.rol && !pedido && l.color !== undefined && l.color !== ROL[l.rol] && !(l.rol !== 'H' && l.color === null && (l.como === 'punteada' || sinRotulo))) malos.push(`${f.donde}: ${l.rol} en ${l.color}`);
      if (l.rol === 'H' && l.color) malos.push(`${f.donde}: la hipotenusa en ${l.color}`);
    }
    for (const a of f.datos.angulos || []) if (a.color && a.color !== 'h') malos.push(`${f.donde}: un ángulo en ${a.color}`);
  }
  assert.deepEqual(malos.slice(0, 20), []);
});

test('colores del texto: solo carmín (ángulos), naranja (opuesto, alturas) y turquesa (adyacente, distancias); sin violeta ni verde', () => {
  const malos = new Set();
  const ir = (x, donde) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { x.forEach(y => ir(y, donde)); return; }
    if (typeof x.v === 'string' && x.v.startsWith('c-') && !['c-h', 'c-o', 'c-i'].includes(x.v)) malos.add(`${donde}: ${x.v} en «${x.t}»`);
    if (typeof x.color === 'string' && x.color.startsWith('c-') && !['c-h', 'c-o', 'c-i'].includes(x.color)) malos.add(`${donde}: control ${x.color}`);
    for (const v of Object.values(x)) if (v && typeof v === 'object') ir(v, donde);
  };
  for (const idea of def.ideas) {
    ir(idea, idea.id);
    for (let s = 0; s < 60; s++) { ir(idea.ahoraTu.generar(s), `${idea.id} ahora ${s}`); ir(idea.resuelve.generar(s), `${idea.id} resuelve ${s}`); }
  }
  // θ, α, β y φ siempre en carmín; CO naranja; CA turquesa.
  const fichas = [];
  const junta = x => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(junta); if (x.v && x.t) fichas.push(x); Object.values(x).forEach(junta); };
  def.ideas.forEach(junta);
  for (const x of fichas) {
    if (/^[θαβφ]$/.test(x.t)) assert.equal(x.v, 'c-h', `«${x.t}» en ${x.v}`);
    if (x.t === 'CO') assert.equal(x.v, 'c-o');
    if (x.t === 'CA') assert.equal(x.v, 'c-i');
  }
  assert.deepEqual([...malos].slice(0, 20), []);
});

test('misiones: un solo caso de la grilla las cumple, y no al abrir', () => {
  for (const idea of def.ideas) {
    const g = Teoria.grilla(idea.juega.controles), inicio = Object.fromEntries(idea.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(g.filter(v => idea.juega.mision.logrado(v)).length, 1, idea.id);
    assert.ok(!idea.juega.mision.logrado(inicio), `${idea.id}: cumplida al abrir`);
  }
});

test('«El dibujo no está a escala» en todo ejercicio con figura que pide un número (o en la predicción)', () => {
  const malos = [];
  for (const f of FIGS) {
    if (f.texto === undefined) continue;
    const pide = [...(f.datos.lados || []), ...(f.datos.angulos || [])].some(x => textoDe(x.texto) === '?' || /= \?$/.test(String(textoDe(x.texto) || '')));
    if (pide && /\d/.test(f.texto) && !/ABC|BPT| a,| a /.test(f.texto) && !f.texto.includes(NO_ESC)) malos.push(`${f.donde}: «${f.texto.slice(0, 80)}»`);
  }
  assert.deepEqual(malos.slice(0, 20), []);
});

test('«Ahora tú» no repite un ejemplo de su idea (los mismos números en el enunciado), en 400 semillas', () => {
  const nums = t => (plano(t).replace(/ /g, ' ').replace(NO_ESC, '').match(/\d+(?:,\d+)?/g) || []).sort().join('|');
  for (const idea of def.ideas) {
    const ej = new Map((idea.ejemplos || []).map(e => [nums(e.enunciado), e.titulo]).concat([[nums(idea.predice.pregunta), 'la predicción']]));
    for (let s = 0; s < SEM; s++) {
      const k = nums(idea.ahoraTu.generar(s).pregunta);
      assert.ok(!ej.has(k) || k === '', `${idea.id} ahora ${s}: repite el ejemplo «${ej.get(k)}»`);
    }
  }
});

test('Datos: 37°, 53°, 16° y 74° llevan «(convención del examen)»; ningún dato trae la respuesta ni un consejo', () => {
  const lineas = [];
  for (const idea of def.ideas) {
    lineas.push(...(idea.predice.datos || []).map(d => [idea.id, d]));
    for (const e of idea.ejemplos || []) lineas.push(...(e.datos || []).map(d => [idea.id, d]));
    for (let s = 0; s < 60; s++) {
      lineas.push(...(idea.ahoraTu.generar(s).datos || []).map(d => [idea.id, d]));
      lineas.push(...(idea.resuelve.generar(s).datos || []).map(d => [idea.id, d]));
    }
  }
  for (const [i, d] of lineas) {
    const t = plano(d).replace(/ /g, ' ');
    if (/(sen|cos|tan|cot|sec|csc) (37|53|16|74)° =/.test(t)) assert.match(t, /\(convención del examen\)/, `${i}: «${t}»`);
    assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(t), `${i}: consejo «${t}»`);
  }
});

test('nada de lo que llega después: ni tangente de una suma o diferencia, ni ley de senos o cosenos', () => {
  for (const idea of def.ideas) for (let s = 0; s < 60; s++) {
    const t = plano([idea.ahoraTu.generar(s), idea.resuelve.generar(s), idea.regla, idea.mira.pasos]);
    assert.ok(!/tan\s*\((?:α|β|θ)\s*[+−]|ley de (senos|cosenos)|sen\s*2θ/.test(t), `${idea.id} ${s}`);
  }
});

test('lleva calidad 2 y el validador no encuentra nada (400 semillas)', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const u = curso.unidades.find(x => x.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: SEM });
  assert.deepEqual(p, [], p.join('\n'));
});

// ---------- Cierre delegado (19 nov): auditoría y lectores en frío (rutinas/auditoria/trigonometria.triangulos-rectangulos.md) ----------
const V = require(path.join(RAIZ, 'nucleo/kit/piezas/trig-vista.js'));
// Texto plano con las fracciones entre paréntesis: «(4√3)/(3)».
const planoF = x => (Array.isArray(x) ? x.map(planoF).join('') : x && typeof x === 'object' ? (x.frac ? `(${planoF(x.frac[0])})/(${planoF(x.frac[1])})` : x.t !== undefined ? String(x.t) : Object.values(x).map(planoF).join('')) : String(x ?? ''));
const sinNb = t => planoF(t).replace(/\u00a0/g, ' ');
// Valor de un texto: lo que dice su «≈» si lo trae; si no, la expresión exacta («3√3», «(24 + 32√3)/3», «30°»).
function valorDe(t) {
  t = sinNb(t).replace(/^[A-E], /, '').replace(/^(φ|θ) = /, '');
  const ap = t.match(/≈ (\d+(?:,\d+)?)/); if (ap) return +ap[1].replace(',', '.');
  const e = t.replace(/ ?(m\/s|cm²|m²|cm|dm|m|s|°)$/, '').trim().replace(/,/g, '.').replace(/−/g, '-').replace(/(\d|\))√/g, '$1*√').replace(/√(\d+)/g, 'Math.sqrt($1)');
  if (/[^0-9.+\-*/() Mathsqrt]/.test(e)) return null;
  try { const v = Function(`return (${e})`)(); return Number.isFinite(v) ? v : null; } catch (er) { return null; }
}
// Los ejercicios con figura, con su respuesta (y sus alternativas, si las hay).
function ejercicios() {
  const out = [];
  for (const idea of def.ideas) {
    const add = (donde, fig, texto, resp, ops) => { if (fig && fig.datos && (fig.pieza || 'trig-vista') === 'trig-vista') out.push({ idea: idea.id, donde, datos: fig.datos, texto: sinNb(texto), resp: valorDe(resp), ops }); };
    add(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pregunta, idea.predice.opciones.find(o => o.correcta).texto, idea.predice.opciones.map(o => valorDe(o.texto)));
    idea.ejemplos.forEach((e, k) => add(`${idea.id} ejemplo ${k + 1}`, e.figura, e.enunciado, plano(e.respuesta).replace(/; .*/, ''), e.alternativas && e.alternativas.map(valorDe)));
    for (let s = 0; s < SEM; s++) {
      const r = idea.resuelve.generar(s), a = idea.ahoraTu.generar(s);
      add(`${idea.id} resuelve ${s}`, r.dibujo, r.enunciado, plano(r.respuesta));
      add(`${idea.id} ahora ${s}`, a.dibujo, a.pregunta, a.opciones.find(o => o.correcta).texto, a.opciones.map(o => valorDe(o.texto)));
    }
  }
  return out;
}
const EJS = ejercicios();

test('cierre: en una figura «no está a escala», lo pedido no se mide (un ángulo, a 6° o más; un largo, a 5 % o más)', () => {
  const malos = [], ang = (c, p, q) => { let d = Math.abs(Math.atan2(-(q[1] - c[1]), q[0] - c[0]) - Math.atan2(-(p[1] - c[1]), p[0] - c[0])) * 180 / Math.PI; return d > 180 ? 360 - d : d; };
  for (const f of EJS) {
    if (!f.texto.includes(NO_ESC) || f.resp === null) continue;
    const g = V.geometria(f.datos, {}), P = g.P, es = x => textoDe(x.texto) === '?' || /= \?$/.test(String(textoDe(x.texto) || ''));
    const pedL = (f.datos.lados || []).filter(es), pedA = (f.datos.angulos || []).filter(es);
    if (pedL.length + pedA.length !== 1) continue;
    // Con alternativas, cuenta solo si la medida queda más cerca de la correcta que de las demás.
    const delata = med => (f.ops && f.ops.filter(Number.isFinite).length > 1 ? f.ops.filter(Number.isFinite).reduce((m, x) => (Math.abs(x - med) < Math.abs(m - med) ? x : m)) === f.resp : true);
    if (pedA.length) { const a = pedA[0], d = ang(P(a.en), P(a.de), P(a.a)); if (Math.abs(d - f.resp) < 6 && delata(d)) malos.push(`${f.donde}: ${f.resp}° dibujado de ${d.toFixed(1)}°`); continue; }
    const largo = l => Math.hypot(P(l.a)[0] - P(l.de)[0], P(l.a)[1] - P(l.de)[1]);
    for (const x of (f.datos.lados || []).filter(l => l !== pedL[0] && valorDe(textoDe(l.texto)) > 0 && !/°|^1,[25] m$/.test(String(textoDe(l.texto))))) {
      const med = largo(pedL[0]) * valorDe(textoDe(x.texto)) / largo(x);
      if (Math.abs(med - f.resp) / f.resp < 0.05 && delata(med)) { malos.push(`${f.donde}: ${f.resp} medido con «${textoDe(x.texto)}» da ${med.toFixed(2)}`); break; }
    }
  }
  assert.deepEqual(malos.slice(0, 10), [], `${malos.length} figuras`);
});

test('cierre: dos ángulos hacia la misma punta: los dos lugares se dibujan separados (16° y 37° caían en el mismo punto)', () => {
  for (const f of EJS.filter(x => x.idea === 'dos-angulos')) {
    const g = V.geometria(f.datos, {}), vs = (f.datos.angulos || []).map(a => g.P(a.en));
    // Los dos lugares del suelo que miran la misma punta (los dos ángulos miden desde el pie, [0, 0]).
    if (vs.length === 2 && f.datos.angulos.every(a => a.de[0] === 0 && a.de[1] === 0)) assert.ok(Math.abs(vs[0][0] - vs[1][0]) >= 25, `${f.donde}: los dos lugares a ${Math.abs(vs[0][0] - vs[1][0]).toFixed(1)} px`);
  }
});

test('cierre: ninguna igualdad con «=» redondea (14 · 7/24 = 4,083 m era falsa); la correcta es el valor final del resuelto', () => {
  const TR = { sen: Math.sin, cos: Math.cos, tan: Math.tan };
  const ANG = g => ({ 37: Math.atan2(3, 4), 53: Math.atan2(4, 3), 16: Math.atan2(7, 24), 74: Math.atan2(24, 7) }[g] ?? g * Math.PI / 180);
  const num = x => { let e = x.trim().replace(/ ?(m\/s|cm²|m²|cm|dm|m|s)$/, ''); for (const [k, fn] of Object.entries(TR)) e = e.replace(new RegExp(`${k} (\\d+)°`, 'g'), (m, g) => `(${fn(ANG(+g))})`);
    if (/[a-zA-Zθαβφ°]/.test(e)) return null; e = e.replace(/,/g, '.').replace(/−/g, '-').replace(/·/g, '*').replace(/(\d|\))√/g, '$1*√').replace(/√(\d+)/g, 'Math.sqrt($1)');
    try { const v = Function(`return (${e})`)(); return Number.isFinite(v) ? v : null; } catch (er) { return null; } };
  const malos = [];
  for (const idea of def.ideas) for (let s = 0; s < SEM; s++) {
    const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s);
    const sol = [sinNb(a.solucion.ecuacion), ...r.pasos.map(p => sinNb(p.ecuacion))];
    for (const linea of sol) { const ps = linea.split(/ (=|≈|→) /); for (let i = 0; i + 2 < ps.length; i += 2) if (ps[i + 1] === '=') { const x = num(ps[i].split(/\(|, /).pop()), y = num(ps[i + 2]); if (x !== null && y !== null && Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x))) malos.push(`${idea.id} ${s}: «${ps[i]} = ${ps[i + 2]}»`); } }
    const ok = sinNb(a.opciones.find(o => o.correcta).texto);
    if (!sinNb([a.solucion.texto, a.solucion.ecuacion]).includes(ok.split(' ≈ ')[0].replace(/^≈ /, ''))) malos.push(`${idea.id} ahora ${s}: la correcta «${ok}» no es lo que da el resuelto`);
  }
  assert.deepEqual([...new Set(malos)].slice(0, 10), []);
});

test('cierre: el puente con la resta (idea 2): ninguna alternativa es negativa para algún ángulo agudo', () => {
  const ev = (t, th) => Function('T', `return ${sinNb(t).replace(/sen θ/g, 'Math.sin(T)').replace(/cos θ/g, 'Math.cos(T)').replace(/tan θ/g, 'Math.tan(T)').replace(/cot θ/g, '(1/Math.tan(T))').replace(/sec θ/g, '(1/Math.cos(T))').replace(/csc θ/g, '(1/Math.sin(T))').replace(/−/g, '-').replace(/^h\(/, '(').replace(/^h /, '').replace(/\) \(/g, ')*(')}`)(th);
  const idea = def.ideas.find(i => i.id === 'cateto-y-angulo');
  for (let s = 0; s < SEM; s++) {
    const a = idea.ahoraTu.generar(s);
    if (!/punta T/.test(plano(a.pregunta))) continue;
    for (const o of a.opciones) for (const th of [0.2, 0.6, 1, 1.4]) assert.ok(ev(o.texto, th) > 0, `semilla ${s}: «${o.texto}» con θ = ${th}`);
  }
});

test('cierre: en «Dos ángulos» se mira desde el suelo (personas o niños sumarían la altura de sus ojos, como en la idea 3)', () => {
  const idea = def.ideas.find(i => i.id === 'dos-angulos');
  const textos = [...idea.ejemplos.map(e => plano(e.enunciado))];
  for (let s = 0; s < SEM; s++) textos.push(plano(idea.ahoraTu.generar(s).pregunta), plano(idea.resuelve.generar(s).enunciado));
  for (const t of textos) assert.ok(!/personas|niños|Ves la punta/.test(t), t);
});

test('cierre: Lee, a escala, no dibuja el ángulo de la predicción (idea 1, 37°) ni el caso de la misión (idea 2, 60°)', () => {
  const angDe = d => { const g = V.geometria(d, {}), a = d.angulos[0], c = g.P(a.en), p = g.P(a.de), q = g.P(a.a); return Math.abs(Math.atan2(-(q[1] - c[1]), q[0] - c[0]) - Math.atan2(-(p[1] - c[1]), p[0] - c[0])) * 180 / Math.PI; };
  assert.ok(Math.abs(angDe(def.ideas[0].lee.tarjetas[0].dibujo.datos) - 37) > 5);
  assert.ok(Math.abs(angDe(def.ideas[1].lee.tarjetas[0].dibujo.datos) - 60) > 5);
});

test('cierre: los ejemplos de una idea no repiten los números de otro', () => {
  const nums = t => (sinNb(t).replace(NO_ESC, '').match(/\d+(?:,\d+)?/g) || []).sort().join('|');
  for (const idea of def.ideas) { const vistos = new Map(); idea.ejemplos.forEach((e, k) => { const n = nums(e.enunciado); if (n) { assert.ok(!vistos.has(n), `${idea.id}: el ejemplo ${k + 1} repite los números del ${vistos.get(n)}`); vistos.set(n, k + 1); } }); }
});

test('cierre: los Datos traen el valor de cada recíproca que usa el resuelto, y en una depresión, los alternos internos', () => {
  const malos = [];
  const mira = (donde, enun, datos, sol) => {
    const d = sinNb(datos), t = sinNb(sol);
    for (const m of t.matchAll(/(cot|sec|csc) (\d+)° = /g)) if (!d.includes(`${m[1]} ${m[2]}° =`)) malos.push(`${donde}: falta ${m[1]} ${m[2]}° en Datos`);
    if (/depresión/.test(sinNb(enun)) && !/alternos internos/.test(d)) malos.push(`${donde}: depresión sin «alternos internos» en Datos`);
  };
  for (const idea of def.ideas.slice(1, 4)) {
    idea.ejemplos.forEach((e, k) => mira(`${idea.id} ejemplo ${k + 1}`, e.enunciado, e.datos, e.solucion));
    for (let s = 0; s < SEM; s++) { const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s); mira(`${idea.id} ahora ${s}`, a.pregunta, a.datos, a.solucion); mira(`${idea.id} resuelve ${s}`, r.enunciado, r.datos, r.pasos.map(p => [p.texto, p.ecuacion])); }
  }
  assert.deepEqual([...new Set(malos.map(m => m.replace(/ \d+:/, ' #:')))].slice(0, 10), []);
});
