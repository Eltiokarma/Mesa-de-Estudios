// Pruebas propias de «Productos notables» (además del validador común de contenido/teoria/teoria.test.js). Las cinco ideas
// están rehechas contra el contrato (fase 2 la idea 1, 18 nov; fase 3 las otras cuatro, 18 nov) y la unidad declara
// calidad: 2.
//   - un color fijo por magnitud (cabecera de productos-notables.js): cada ficha de color dice su magnitud (m) y lleva el
//     color de def.colores. a naranja, b turquesa; violeta a las piezas del medio que se olvidan (2ab, 3a²b, los
//     rectángulos √(xy), px y qx), a los lados del tablero y al factor que vale 1; nunca carmín ni verde, tampoco en las
//     figuras ni en las mesas del laboratorio; las piezas de cada objeto con su color;
//   - cada idea cumple el contrato de calidad 2 sola y estrena sus palabras;
//   - nada antes de Predice delata su respuesta: ni el título ni la pregunta del Resumen, ni Lee, ni el glosario de la
//     idea; los ejemplos de nivel 1 no usan la situación de la predicción; las figuras de Predice y de los ejemplos no
//     muestran lo que se pide;
//   - la misión la cumple un solo caso y su «bien» no dice la predicción;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas y su respuesta cuadra con un cálculo aparte; «Así se
//     resuelve» también, y no hace la pregunta de «Ahora tú»; la letra de cada alternativa es la del valor correcto;
//   - los 60 ejemplos: cuentas rehechas aparte (aquí, con números; y en el script del scratchpad, cuentas-productos-f3.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./productos-notables.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['alg-objeto'];
const IDEAS = ['cuadrado-suma', 'suma-por-diferencia', 'cubo-binomio', 'radicales-dobles', 'racionalizar'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
const plano = x => E.texto(x === undefined || x === null ? '' : x);
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
const sinLetra = t => t.replace(/⁠/g, '').replace(/^[A-E], /, '');

function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => o.texto), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

// ---------- Colores ----------
test('la tabla de colores: a naranja, b turquesa, lo del medio violeta; sin carmín ni verde', () => {
  assert.deepEqual(def.colores, { 'primer término': 'o', 'segundo término': 'i', 'doble producto': 'f', 'piezas del medio': 'f',
    'lados del tablero': 'f', 'factor uno': 'f', 'letra de alternativa': 'f' });
  assert.ok(!Object.values(def.colores).some(c => c === 'h' || c === 'd'));
});

test('un color por magnitud: cada ficha de las cinco ideas dice su magnitud y lleva su color; a naranja y b turquesa', () => {
  for (const id of IDEAS) {
    let n = 0;
    for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
      n++;
      assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
      if (f.t === 'a') assert.equal(f.v, 'c-o', `${id} ${donde}`);
      if (f.t === 'b') assert.equal(f.v, 'c-i', `${id} ${donde}`);
    }
    assert.ok(n > 100, `${id}: ${n} fichas`);
  }
  // Los controles: a, x naranja; b, y turquesa.
  const ctl = (id, c) => idea(id).juega.controles.find(x => x.id === c).color;
  assert.equal(ctl('cuadrado-suma', 'a'), 'c-o'); assert.equal(ctl('cuadrado-suma', 'b'), 'c-i');
  assert.equal(ctl('suma-por-diferencia', 'a'), 'c-o'); assert.equal(ctl('suma-por-diferencia', 'b'), 'c-i');
  assert.equal(ctl('cubo-binomio', 'a'), 'c-o'); assert.equal(ctl('cubo-binomio', 'b'), 'c-i');
  assert.equal(ctl('radicales-dobles', 'x'), 'c-o'); assert.equal(ctl('radicales-dobles', 'y'), 'c-i');
});

// Todas las figuras de una idea, con su pieza.
function figuras(i) {
  const out = [], con = (donde, f, pieza) => out.push([donde, f, (f && f.pieza) || pieza || i.pieza]);
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => con(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  i.ejemplos.forEach((e, k) => { if (e.figura) con(`ejemplo ${k + 1}`, e.figura); });
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) con(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza);
    if (r.dibujo) con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza);
    for (const [k, p] of r.pasos.entries()) if (p.dibujo) con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza);
  }
  return out;
}
const svgDe = ([, f, pieza]) => Kit.piezas[pieza].dibujar(f.datos, f.estado || {});
test('las figuras de las cinco ideas y las mesas: sin carmín ni verde', () => {
  for (const id of IDEAS) for (const fg of figuras(idea(id))) assert.ok(!/var\(--c-[hd]\)/.test(svgDe(fg)), `${id} ${fg[0]}: carmín o verde`);
  for (const m of def.laboratorio) for (const v of Teoria.grilla(m.controles)) {
    const f = m.dibujo(v), s = Kit.piezas[m.pieza].dibujar(f.datos, f.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s), `mesa ${m.id} ${JSON.stringify(v)}`);
    for (const x of fichas(m.lectura(v))) assert.ok(x.m in def.colores && x.v === `c-${def.colores[x.m]}`, `mesa ${m.id}: «${x.t}»`);
  }
  for (const m of def.laboratorio) for (const c of m.controles) assert.ok(!['c-h', 'c-d'].includes(c.color), `mesa ${m.id}: control ${c.id}`);
});

test('las piezas de cada objeto con su color: el terreno, el triplay, el taco y la mesa', () => {
  const COLOR = { a2: 'var(--c-o)', ab: 'var(--c-f)', b2: 'var(--c-i)', costado: 'var(--c-f)', fondo: 'var(--c-f)' };
  for (const fg of figuras(idea('cuadrado-suma'))) {
    const [donde, f] = fg, s = svgDe(fg);
    if (fg[2] !== 'alg-objeto') continue;
    assert.match(s, /data-objeto="terreno"/, donde);
    for (const m of s.matchAll(/data-pieza="(\w+)"[^>]*stroke="([^"]+)"/g)) if (!f.datos.comprar || m[1] === 'a2') assert.equal(m[2], COLOR[m[1]], `${donde}: pieza ${m[1]}`);
  }
  // Triplay: la esquina turquesa; el contorno de la plancha naranja; los lados del tablero violeta.
  for (const fg of figuras(idea('suma-por-diferencia')).filter(x => x[2] === 'alg-objeto')) {
    const [donde, f] = fg, s = svgDe(fg);
    assert.match(s, /data-objeto="triplay"/, donde);
    for (const m of s.matchAll(/data-pieza="esquina"[^>]*stroke="([^"]+)"/g)) assert.equal(m[1], 'var(--c-i)', donde);
    const d = Object.assign({}, f.datos, ((f.datos.pasos || [])[(f.estado || {}).paso || 0]) || {});
    if (d.soloTablero || d.f === 1) assert.match(s, /stroke="var\(--c-f\)" stroke-width="4"/, `${donde}: lados del tablero`);
    else assert.match(s, /stroke="var\(--c-o\)" stroke-width="2.5"/, `${donde}: la plancha`);
  }
  // Taco: a³ naranja, a²b violeta, ab² en tinta, b³ turquesa.
  const CT = { a3: 'var(--c-o)', a2b: 'var(--c-f)', ab2: 'currentColor', b3: 'var(--c-i)', entero: 'currentColor' };
  for (const fg of figuras(idea('cubo-binomio')).filter(x => x[2] === 'alg-objeto')) {
    const s = svgDe(fg);
    assert.match(s, /data-objeto="taco"/, fg[0]);
    for (const m of s.matchAll(/data-pieza="(\w+)"><polygon[^>]*\/><polygon[^>]*fill="([^"]+)"/g)) assert.equal(m[2], CT[m[1]], `${fg[0]}: ${m[1]}`);
  }
  // Mesa: la plancha x naranja, la y turquesa, las dos rectangulares violeta.
  const CM = { x: 'var(--c-o)', y: 'var(--c-i)', xy: 'var(--c-f)' };
  for (const fg of figuras(idea('radicales-dobles')).filter(x => x[2] === 'alg-objeto')) {
    const s = svgDe(fg);
    assert.match(s, /data-objeto="mesa"/, fg[0]);
    for (const m of s.matchAll(/data-pieza="(\w+)"[^>]*stroke="([^"]+)"/g)) assert.equal(m[2], CM[m[1]], `${fg[0]}: plancha ${m[1]}`);
  }
  for (const fg of figuras(idea('racionalizar')).filter(x => x[2] === 'alg-objeto')) assert.match(svgDe(fg), /data-objeto="cometa"/, fg[0]);
  // La primera pantalla de cada idea (Lee) es su objeto, y las mesas cuelgan de su idea.
  for (const id of IDEAS) assert.equal(idea(id).lee.tarjetas[0].pieza, 'alg-objeto', id);
  assert.deepEqual(def.laboratorioIdeas, { 'cubo-se-abre': ['cubo-binomio'], 'rectangulo-x-p-q': ['suma-por-diferencia'] });
});

// ---------- Contrato ----------
test('la unidad en calidad 2; cada idea cumple el contrato sola y estrena sus palabras', () => {
  assert.equal(def.calidad, 2);
  const p = Teoria.problemas(def, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  const ESPERA = [['distributiva', 'doble producto', 'producto notable'], ['diferencia de cuadrados', 'identidad'],
    ['arista', 'suma de cubos', 'volumen'], ['radical doble', 'radical simple'], ['conjugado', 'denominador', 'racionalizar']];
  const porIdea = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    assert.deepEqual(porIdea[k].map(g => g.termino).sort(), ESPERA[k], i.id);
    const sub = Object.assign({}, def, { ideas: [i], glosario: porIdea[k], laboratorio: undefined, laboratorioIdeas: undefined });
    const q = Teoria.problemas(sub, { semillas: 60 });
    assert.deepEqual(q, [], `${i.id}:\n${q.join('\n')}`);
  });
  for (const g of def.glosario) assert.ok(g.simple && Array.isArray(g.ejemplos) && g.ejemplos.length >= 3, g.termino);
  assert.ok(def.glosario.length <= 30);
  // «binomio» se define en Binomio de Newton (cuarta ronda): aquí no se repite, pero se usa y el lector lo marca.
  assert.ok(!def.glosario.some(g => g.termino === 'binomio'));
  assert.ok(/binomio/.test(Glosario.texto(def)));
});

// Lo que delataría la predicción de cada idea, si apareciera antes de Predice.
const DELATA = {
  'cuadrado-suma': /\(\s*\w+\s*−\s*\w+\s*\)\s*(²|al cuadrado)|cede|vereda|25 m/,
  'suma-por-diferencia': /899|30 · 30|30²|900|1 · 1/,
  'cubo-binomio': /133|210|3ab\(a \+ b\)|no es a³ \+ b³|≠ a³ \+ b³/,
  'radicales-dobles': /−|2 − √3|√3 − 2/,
  'racionalizar': /√5 \+ √3|\)\(√|5 − 3|a − b\b|el conjugado de|por el conjugado/,
};
test('nada antes de Predice delata su respuesta: título, Resumen, Lee, glosario y el juego', () => {
  const porIdea = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    const re = DELATA[i.id], j = i.juega;
    for (const t of [i.titulo, i.pregunta, i.actividad]) assert.ok(!re.test(t), `${i.id}: ${t}`);
    for (const t of i.lee.tarjetas) assert.ok(!re.test(plano([t.titulo, t.texto, t.ecuacion || ''])), `${i.id}: ${t.titulo}`);
    for (const g of porIdea[k]) assert.ok(!re.test([g.def, g.simple, ...(g.ejemplos || [])].join(' ')), `${i.id}: ${g.termino}`);
    // El juego (se juega antes de predecir): consigna, misión, su «bien» y las lecturas.
    if (i.id !== 'cuadrado-suma' && i.id !== 'radicales-dobles') {
      for (const t of [j.consigna, plano(j.mision.texto), j.mision.bien]) assert.ok(!re.test(t), `${i.id}: ${t}`);
      for (const v of Teoria.grilla(j.controles)) assert.ok(!re.test(plano(j.lectura(v))), `${i.id}: ${plano(j.lectura(v))}`);
    }
  });
  // Radicales dobles: el juego solo arma mesas (con +); racionalizar: una sola raíz abajo.
  const rd = idea('radicales-dobles').juega;
  for (const v of Teoria.grilla(rd.controles)) assert.ok(!/−/.test(plano(rd.lectura(v))));
  assert.ok(!/−/.test(plano(rd.mision.texto) + rd.mision.bien + rd.consigna));
  for (const v of Teoria.grilla(idea('racionalizar').juega.controles)) assert.ok(!/√\d+ [+−] /.test(plano(idea('racionalizar').juega.lectura(v))));
});

test('los ejemplos de nivel 1 no usan la situación de la predicción', () => {
  const N1 = id => idea(id).ejemplos.filter(e => e.nivel === 1).map(e => plano([e.enunciado, e.datos, e.solucion.map(x => [x.texto, x.ecuacion || '']), e.respuesta]));
  for (const t of N1('cuadrado-suma')) assert.ok(!DELATA['cuadrado-suma'].test(t), t);
  // Suma por diferencia: ningún producto de dos números cercanos (31 · 29).
  for (const t of N1('suma-por-diferencia')) assert.ok(!/\b\d{2,} · \d{2,}\b/.test(t), t);
  // Cubo: no se halla a³ + b³ con la suma y el producto.
  for (const t of N1('cubo-binomio')) assert.ok(!/a \+ b = \d+ y ab = \d+/.test(t), t);
  // Radicales dobles: ninguno con menos.
  for (const t of N1('radicales-dobles')) assert.ok(!/−/.test(t), t);
  // Racionalizar: ninguno con el conjugado (una sola raíz abajo).
  for (const t of N1('racionalizar')) assert.ok(!/conjugado|\(√\d+ [+−]|√\d+ [+−] √?\d+\)/.test(t), t);
});

test('las figuras de Predice no muestran la respuesta, y lo que se pide va con «?»', () => {
  const ts = id => { const i = idea(id), pz = Kit.piezas[i.predice.pieza || i.pieza]; return textosSVG(pz.dibujar(i.predice.dibujo.datos, i.predice.dibujo.estado || {})).join(' | '); };
  const t1 = ts('cuadrado-suma');
  assert.ok(!/25|5 m(?!²)|\b5\b/.test(t1.replace(/2 m|7 m/g, '')), t1);
  const t2 = ts('suma-por-diferencia'); assert.ok(!/899|900|30/.test(t2) && t2.includes('?'), t2);
  const t3 = ts('cubo-binomio'); assert.ok(!/133|343|210/.test(t3) && t3.includes('?'), t3);
  const t4 = ts('radicales-dobles'); assert.ok(!/12\b|√3/.test(t4.replace(/^[^|]*\|[^|]*\|[^|]*\|[^|]*\|/, '')) && t4.includes('?'), t4);
  const t5 = ts('racionalizar'); assert.ok(!/√5 \+ √3/.test(t5) && t5.includes('?'), t5);
  assert.ok(!/alg-esquina/.test(P.dibujar(idea('cuadrado-suma').predice.dibujo.datos)), 'la esquina no se marca antes de responder');
});

test('las figuras de los ejemplos no muestran lo que se pide', () => {
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (!e.figura) continue;
    const pz = Kit.piezas[e.figura.pieza], ts = textosSVG(pz.dibujar(e.figura.datos, e.figura.estado || {}));
    const pide = sinLetra(plano(e.respuesta)).replace(/^(Compra|Mide|Lado:|El término es) /, '');
    const tok = pide.match(/[\d√∛][\d√∛,/]*/)[0];
    const fig = new Set(ts.join(' ').split(/[\s:;()]+/));
    assert.ok(!fig.has(tok) && !fig.has(`${tok}`.replace(/,$/, '')), `${id} ejemplo ${k + 1}: la figura muestra «${tok}»: ${ts.join(' | ')}`);
  }
});

test('cada misión la cumple un solo caso y su «bien» no dice la predicción', () => {
  const UNO = { 'cuadrado-suma': { a: 10, b: 2 }, 'suma-por-diferencia': { a: 10, b: 3, f: 1 }, 'cubo-binomio': { a: 3, b: 2, abrir: 1 },
    'radicales-dobles': { x: 5, y: 3 }, racionalizar: { d: 1, por: 'raiz' } };
  for (const id of IDEAS) {
    const j = idea(id).juega;
    assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), [UNO[id]], id);
    assert.ok(!DELATA[id].test(j.mision.bien), `${id}: ${j.mision.bien}`);
  }
  // Idea 1: el juego solo amplía; la manija de a está en la esquina del terreno de antes (11 px en diagonal = 1 m).
  const j = idea('cuadrado-suma').juega;
  for (const v of Teoria.grilla(j.controles)) assert.ok(!/−/.test(plano(j.lectura(v))));
  const [ea, eb] = j.arrastres, v = { a: 8, b: 2 }, pa = ea.donde(v), pb = eb.donde(v);
  assert.ok(Math.abs(ea.mover({ x: pa.x + 11, y: pa.y + 11 }, v).a - 9) < 1e-9);
  assert.ok(Math.abs(eb.mover({ x: pb.x + 11, y: pb.y + 11 }, v).b - 3) < 1e-9);
  // Los juegos de las ideas 2 y 3 dicen la relación con las mismas medidas que dibujan.
  const sd = idea('suma-por-diferencia').juega;
  for (const w of Teoria.grilla(sd.controles)) {
    const t = plano(sd.lectura(w));
    assert.ok(t.includes(String(w.a * w.a - w.b * w.b)), t);
    if (w.f === 1) assert.ok(t.startsWith(`${w.a + w.b} · ${w.a - w.b} =`), t);
  }
  const cb = idea('cubo-binomio').juega;
  for (const w of Teoria.grilla(cb.controles)) {
    const n = plano(cb.lectura(w)).match(/= (\d+): (\d+) \+ (\d+) \+ (\d+) \+ (\d+)/).slice(1).map(Number);
    assert.equal(n[0], (w.a + w.b) ** 3); assert.equal(n[1] + n[2] + n[3] + n[4], n[0]);
    assert.deepEqual(n.slice(1), [w.a ** 3, 3 * w.a * w.a * w.b, 3 * w.a * w.b * w.b, w.b ** 3]);
  }
});

// ---------- Cálculo aparte ----------
// Un polinomio en x escrito como texto → coeficientes por grado ({ 3: 1, 2: −15, … }).
function coefs(t) {
  const c = {};
  for (const m of t.replace(/\s/g, '').replace(/−/g, '-').matchAll(/([+-]?)(\d*)(x[²³⁴]?)?/g)) {
    if (!m[0] || (!m[2] && !m[3])) continue;
    const g = !m[3] ? 0 : m[3] === 'x' ? 1 : { '²': 2, '³': 3, '⁴': 4 }[m[3][1]];
    c[g] = (c[g] || 0) + (m[1] === '-' ? -1 : 1) * (m[2] ? Number(m[2]) : 1);
  }
  for (const k of Object.keys(c)) if (!c[k]) delete c[k];
  return c;
}
// Un número escrito con raíces («2(√5 − √2) / 3», «3∛4», «√7 + 2») → su valor, sin usar el código de la unidad.
function valor(t) {
  const js = t.replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '.')
    .replace(/(\d)([√∛(])/g, '$1*$2').replace(/\)([\d√∛(])/g, ')*$1')
    .replace(/√(\d+)/g, 'Math.sqrt($1)').replace(/∛(\d+)/g, 'Math.cbrt($1)');
  assert.ok(/^[-+*/().\d\sMathsqrcb]+$/.test(js), `no sé leer «${t}»`);
  return Function(`return ${js}`)();
}
const cerca = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y));

const CHEQUEO = {
  'suma-por-diferencia': (q, r) => {
    let m;
    if ((m = q.match(/^¿Cuánto vale (\d+) · (\d+),/))) return assert.equal(Number(r), m[1] * m[2]);
    if ((m = q.match(/^Desarrolla \((\d)x \+ (\d)\)\(\1x − \2\)\.$/))) return assert.deepEqual(coefs(r), { 2: m[1] ** 2, 0: -(m[2] ** 2) });
    if ((m = q.match(/^Desarrolla \(x ([+−]) (\d)\)\(x ([+−]) (\d)\)\.$/))) {
      const p = (m[1] === '−' ? -1 : 1) * m[2], s = (m[3] === '−' ? -1 : 1) * m[4], c = coefs(r);
      for (const x of [-3, 2, 7]) assert.ok((c[2] || 0) * x * x + (c[1] || 0) * x + (c[0] || 0) === (x + p) * (x + s), q);
      return;
    }
    if ((m = q.match(/^Si a \+ b = (\d+) y a − b = (\d+), ¿cuánto vale ab\?$/))) return assert.equal(Number(r), ((+m[1] + +m[2]) / 2) * ((m[1] - m[2]) / 2));
    if ((m = q.match(/^Si a \+ b = (\d+), a − b = (\d+) y a² \+ b² = (\d+),/))) {
      const a = (+m[1] + +m[2]) / 2, b = (m[1] - m[2]) / 2;
      assert.equal(a * a + b * b, +m[3]); return assert.equal(Number(r), a ** 4 - b ** 4);
    }
    assert.fail(q);
  },
  'cubo-binomio': (q, r) => {
    let m;
    if ((m = q.match(/^Desarrolla \(x ([+−]) (\d)\)³\.$/))) {
      const k = (m[1] === '−' ? -1 : 1) * m[2];
      return assert.deepEqual(coefs(r), { 3: 1, 2: 3 * k, 1: 3 * k * k, 0: k ** 3 });
    }
    if ((m = q.match(/^¿Cuánto vale (\d+)³,/))) return assert.equal(Number(r), m[1] ** 3);
    if ((m = q.match(/^Si a \+ b = (\d+) y ab = (\d+), ¿cuánto vale a³ \+ b³\?$/))) {
      const S = +m[1], Pp = +m[2], sol = [];
      for (let x = 1; x < S; x++) if (x * (S - x) === Pp) sol.push(x ** 3 + (S - x) ** 3);
      return assert.ok(sol.length && sol.every(v => v === Number(r)), q);
    }
    if ((m = q.match(/^Factoriza x³ ([+−]) (\d+)\.$/))) {
      const K = (m[1] === '−' ? -1 : 1) * m[2], f = r.match(/^\(x ([+−]) (\d)\)\(x² ([+−]) (\d*)x \+ (\d+)\)$/);
      assert.ok(f, r);
      const k = (f[1] === '−' ? -1 : 1) * f[2], u = (f[3] === '−' ? -1 : 1) * (f[4] ? +f[4] : 1), w = +f[5];
      for (const x of [-2, 1, 3, 5]) assert.equal((x + k) * (x * x + u * x + w), x ** 3 + K, `${q} → ${r}`);
      return;
    }
    assert.fail(q);
  },
  'radicales-dobles': (q, r) => {
    let m, v;
    if ((m = q.match(/^¿A qué es igual raíz de (\d+) ([+−]) (\d*)√(\d+)\?$/))) v = Math.sqrt(+m[1] + (m[2] === '−' ? -1 : 1) * (m[3] ? +m[3] : 1) * Math.sqrt(+m[4]));
    else if ((m = q.match(/^¿Cuánto vale raíz de (\d+) \+ 2√(\d+) ([+−]) raíz de \1 − 2√\2\?$/))) v = Math.sqrt(+m[1] + 2 * Math.sqrt(+m[2])) + (m[3] === '−' ? -1 : 1) * Math.sqrt(m[1] - 2 * Math.sqrt(+m[2]));
    else assert.fail(q);
    assert.ok(cerca(valor(r), v), `${q} → ${r}`);
    // La respuesta va sin radical doble y, con un menos, nunca negativa.
    assert.ok(!/raíz de/.test(r) && valor(r) >= 0, r);
  },
  racionalizar: (q, r) => {
    let m, v;
    if ((m = q.match(/^Racionaliza (\d+) \/ \((.+)\)\.$/))) v = m[1] / valor(m[2]);
    else if ((m = q.match(/^¿Cuánto vale 1 \/ \((.+)\) ([+−]) 1 \/ \((.+)\)\?$/))) v = 1 / valor(m[1]) + (m[2] === '−' ? -1 : 1) / valor(m[3]);
    else assert.fail(q);
    assert.ok(cerca(valor(r), v), `${q} → ${r}`);
    // Sin raíces en el denominador.
    const den = r.includes(' / ') ? r.split(' / ').pop() : '';
    assert.ok(!/[√∛]/.test(den), `${q} → ${r}`);
  },
};
for (const id of Object.keys(CHEQUEO)) test(`«Ahora tú» de ${id}: cuatro opciones distintas y la respuesta cuadra con un cálculo aparte (400 semillas)`, () => {
  const i = idea(id), tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones, bien = ops.filter(o => o.correcta);
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(bien.length, 1);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `semilla ${s}`);
    assert.ok(Array.isArray(a.datos) && a.datos.length, `semilla ${s}: sin datos`);
    for (const o of ops) if (!o.correcta) assert.ok(o.error && o.siFuera, `semilla ${s}: ${o.id}`);
    CHEQUEO[id](plano(a.pregunta), plano(bien[0].texto));
    // Ninguna incorrecta da el mismo valor que la correcta.
    if (id === 'radicales-dobles' || id === 'racionalizar') for (const o of ops) if (!o.correcta) assert.ok(!cerca(valor(plano(o.texto)), valor(plano(bien[0].texto))), `semilla ${s}: ${plano(o.texto)}`);
    tipos.add(s % 5);
  }
  assert.equal(tipos.size, 5);
});

test('«Así se resuelve» de cada idea: cuadra aparte, y «Ahora tú» nunca hace esa pregunta', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    let m, r;
    r = idea('cuadrado-suma').resuelve.generar(s); m = plano(r.enunciado).match(/mide (\d+) m de lado\. Compra una franja de (\d+) m/);
    assert.equal(plano(r.respuesta), `Compra ${(+m[1] + +m[2]) ** 2 - m[1] ** 2} m²`);
    r = idea('suma-por-diferencia').resuelve.generar(s); m = plano(r.enunciado).match(/mide (\d+) dm de lado\. Se le corta una esquina de (\d+) dm/);
    assert.equal(plano(r.respuesta), `${+m[1] + +m[2]} dm por ${m[1] - m[2]} dm: ${m[1] ** 2 - m[2] ** 2} dm²`);
    r = idea('cubo-binomio').resuelve.generar(s); m = plano(r.enunciado).match(/a (\d+) dm de una esquina.*mide (\d+) dm/);
    assert.equal(plano(r.respuesta), `Las seis del medio: ${(+m[1] + +m[2]) ** 3 - m[1] ** 3 - m[2] ** 3} dm³`);
    r = idea('radicales-dobles').resuelve.generar(s); m = plano(r.enunciado).match(/^Una mesa cuadrada de (\d+) \+ 2√(\d+) dm²/);
    const pr = plano(r.respuesta).match(/^Planchas de (\d+) y (\d+) dm²; lado √(\d+) \+ √(\d+) dm$/);
    assert.ok(pr, plano(r.respuesta));
    assert.equal(+pr[1] + +pr[2], +m[1]); assert.equal(pr[1] * pr[2], +m[2]); assert.ok(+pr[1] > +pr[2]);
    assert.ok(cerca(Math.sqrt(+pr[3]) + Math.sqrt(+pr[4]), Math.sqrt(+m[1] + 2 * Math.sqrt(+m[2]))));
    r = idea('racionalizar').resuelve.generar(s); m = plano(r.enunciado).match(/mide (\d+) m\./);
    const lado = plano(r.respuesta).match(/^Lado: (.+) m, unos/)[1];
    assert.ok(cerca(valor(lado.replace(/\/2$/, ' / 2')), m[1] / Math.SQRT2) && !/\/\s*√/.test(lado), lado);
    // «Ahora tú» pide otra cosa: nunca el objeto del ejemplo resuelto.
    for (const [id, re] of [['cuadrado-suma', /Compra/], ['suma-por-diferencia', /tablero|plancha/], ['cubo-binomio', /taco|madera/], ['radicales-dobles', /mesa|plancha/], ['racionalizar', /cometa|varilla/]]) {
      assert.ok(!re.test(plano(idea(id).ahoraTu.generar(s).pregunta)), `${id} semilla ${s}`);
    }
  }
});

// ---------- Los 60 ejemplos: cuentas rehechas aparte y la letra de cada alternativa ----------
test('ejemplos de la idea 1: cuentas rehechas aparte', () => {
  const ej = idea('cuadrado-suma').ejemplos, v = k => sinLetra(plano(ej[k].respuesta));
  assert.equal((8 + 3) ** 2, 121); assert.match(v(0), /121/);
  assert.match(v(1), /x² \+ 8x \+ 16/); assert.match(v(2), /14x/); assert.equal(31 ** 2, 961); assert.match(v(3), /961/);
  assert.equal((5 + 3) ** 2 - 5 ** 2 - 3 ** 2, 30); assert.match(v(4), /30/);
  assert.match(v(5), /9x² \+ 12x \+ 4/); assert.match(v(6), /25/); assert.equal(9 ** 2 - 40, 41); assert.match(v(7), /41/);
  assert.ok(Math.abs(2.1 ** 2 - 4.41) < 1e-9); assert.equal(15 ** 2 - 12 ** 2, 81); assert.match(v(9), /81/);
  assert.equal(Math.sqrt(34 + 30), 8); assert.equal(Math.sqrt(34 + 15), 7); assert.equal(7 ** 2 - 24, 25);
  assert.ok(Math.abs((Math.sqrt(3) + Math.sqrt(2)) ** 2 - (5 + 2 * Math.sqrt(6))) < 1e-9);
  const x = (5 + Math.sqrt(21)) / 2; assert.ok(Math.abs(x * x + 1 / (x * x) - 23) < 1e-9);
  assert.equal(13 ** 2 - 10 ** 2, 69);
});

test('ejemplos de la idea 2: cuentas rehechas aparte', () => {
  const ej = idea('suma-por-diferencia').ejemplos, v = k => sinLetra(plano(ej[k].respuesta));
  assert.equal(v(0), '11 dm por 7 dm');
  assert.deepEqual(coefs(v(1)), { 2: 1, 0: -36 });
  for (const x of [2, 5]) assert.equal((x + 7) * (x - 7), x * x - 49); assert.equal(v(2), '(x + 7)(x − 7)');
  assert.equal(12 ** 2 - 5 ** 2, 119); assert.equal(v(3), '119 dm²');
  assert.equal((7 + 3) * (7 - 3), 7 ** 2 - 3 ** 2); assert.equal(v(4), '40');
  assert.equal(52 * 48, 2496); assert.match(v(5), /2496/);
  assert.deepEqual(coefs(v(6)), { 2: 9, 0: -16 });
  assert.deepEqual(coefs(v(7)), { 2: 1, 1: 8, 0: 15 }); for (const x of [1, 4]) assert.equal((x + 5) * (x + 3), x * x + 8 * x + 15);
  assert.deepEqual(coefs(v(8)), { 2: 1, 1: 3, 0: -28 }); for (const x of [1, 4]) assert.equal((x + 7) * (x - 4), x * x + 3 * x - 28);
  assert.equal(75 ** 2 - 25 ** 2, 5000); assert.equal(v(9), '5000');
  // Nivel 3: a = 7, b = 2; (x + 1)⁴ − (x − 1)⁴ en varios x; a³ = 8, b³ = 1; −2 constante; 1001 · 999 − 1000².
  assert.equal(7 + 2, 9); assert.equal(7 - 2, 5); assert.equal(7 * 2, 14);
  for (const x of [-2, 1, 3]) assert.equal((x + 1) ** 4 - (x - 1) ** 4, 8 * x ** 3 + 8 * x);
  assert.equal(8 - 1, 7); assert.equal(64 - 1, 63);
  for (const x of [-1, 0, 5]) assert.equal((x + 1) * (x + 4) - (x + 2) * (x + 3), -2);
  assert.equal(1001 * 999 - 1000 ** 2, -1);
  const esperado = ['14', '8x³ + 8x', '8', '−2', '−1'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

test('ejemplos de la idea 3: cuentas rehechas aparte', () => {
  const ej = idea('cubo-binomio').ejemplos, v = k => sinLetra(plano(ej[k].respuesta));
  assert.equal(3 * 3 * 1, 9); assert.equal(v(0), '9 dm³');
  assert.deepEqual(coefs(v(1)), { 3: 1, 2: 6, 1: 12, 0: 8 });
  assert.equal(27 - 9, 3 * 4 * 1 + 3 * 2 * 1); assert.match(v(2), /18/);
  assert.equal(11 ** 3, 1331); assert.match(v(3), /1331/);
  assert.match(v(4), /15x²/);
  assert.deepEqual(coefs(v(5)), { 3: 1, 2: -9, 1: 27, 0: -27 });
  assert.deepEqual(coefs(v(6)), { 3: 8, 2: 12, 1: 6, 0: 1 }); for (const x of [1, 2]) assert.equal((2 * x + 1) ** 3, 8 * x ** 3 + 12 * x * x + 6 * x + 1);
  for (const x of [-1, 3]) { assert.equal((x + 2) * (x * x - 2 * x + 4), x ** 3 + 8); assert.equal((2 * x - 3) * (4 * x * x + 6 * x + 9), 8 * x ** 3 - 27); }
  assert.equal(v(7), '(x + 2)(x² − 2x + 4)'); assert.equal(v(8), '(2x − 3)(4x² + 6x + 9)');
  assert.equal(99 ** 3, 970299); assert.match(v(9), /970 299/);
  // Nivel 3, con raíces de verdad: a + b = 5, ab = 3; a + b = 4, a³ + b³ = 28; a − b = 2, ab = 15; x + 1/x = 3; a + b = 3, a² + b² = 5.
  const raices = (S, Pp) => [(S + Math.sqrt(S * S - 4 * Pp)) / 2, (S - Math.sqrt(S * S - 4 * Pp)) / 2];
  const [p1, q1] = raices(5, 3); assert.ok(cerca(p1 ** 3 + q1 ** 3, 80));
  assert.equal(3 ** 3 + 1 ** 3, 28); assert.equal(3 + 1, 4);
  assert.equal(5 ** 3 - 3 ** 3, 98); assert.equal(5 - 3, 2); assert.equal(5 * 3, 15);
  const xx = (3 + Math.sqrt(5)) / 2; assert.ok(cerca(xx ** 3 + 1 / xx ** 3, 18));
  assert.equal(1 + 8, 9); assert.equal(1 + 4, 5);
  const esperado = ['80', '3', '98', '18', '9'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

test('ejemplos de la idea 4: cuentas rehechas aparte', () => {
  const ej = idea('radicales-dobles').ejemplos, v = k => sinLetra(plano(ej[k].respuesta)), r = Math.sqrt;
  assert.ok(cerca(valor('√6 + √2'), r(6 + 2 + 2 * r(12))));
  const pares = [[1, '√3 + √2', r(5 + 2 * r(6))], [2, '√5 + 2', r(9 + 2 * r(20))], [5, '√5 − √3', r(8 - 2 * r(15))], [6, '√5 + √2', r(7 + r(40))],
    [7, '2√2 + √3', r(11 + 4 * r(6))], [9, '√5 − 1', r(6 - r(20))]];
  for (const [k, t, x] of pares) { assert.equal(v(k), t); assert.ok(cerca(valor(t), x), t); }
  assert.notEqual(6 * 2, 15);
  assert.ok(cerca(7 + 3 + 2 * r(21), (r(7) + r(3)) ** 2)); assert.equal(v(4), '10 + 2√21 dm²');
  assert.ok(cerca((r(7) + r(2)) ** 2, 9 + 2 * r(14)));
  // Nivel 3.
  assert.ok(cerca(r(5 + 2 * r(6)) + r(5 - 2 * r(6)), 2 * r(3)));
  assert.ok(cerca(r(9 - 2 * r(14)), r(7) - r(2)));
  assert.ok(cerca(r(3 + r(8)) - r(2), 1));
  assert.ok(cerca(4 * r(12 + 2 * r(35)), 4 * r(7) + 4 * r(5)));
  assert.ok(cerca(r(16 - 6 * r(7)), 3 - r(7)));
  const esperado = ['2√3', '√7 − √2', '1', '4√7 + 4√5 dm', '3 − √7'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

test('ejemplos de la idea 5: cuentas rehechas aparte', () => {
  const ej = idea('racionalizar').ejemplos, v = k => sinLetra(plano(ej[k].respuesta)), r = Math.sqrt, c = Math.cbrt;
  assert.ok(cerca(3 / r(2), 3 * r(2) / 2) && Math.abs(3 / r(2) - 2.12) < 0.005); assert.match(v(0), /3√2\/2 m/);
  const fr = [[1, 1 / r(5)], [2, 6 / r(3)], [4, r(3) / r(2)], [5, 2 / (r(3) + 1)], [6, 4 / (r(7) - r(3))], [7, 3 / (2 * r(3))], [8, 1 / c(2)]];
  for (const [k, x] of fr) { assert.ok(cerca(valor(v(k)), x), `${k + 1}: ${v(k)}`); assert.ok(!/\/\s*\(?[^)]*[√∛]/.test(v(k).split(' / ')[1] || ''), v(k)); }
  assert.ok(cerca(r(2) / 2, 1 / r(2)));
  assert.ok(cerca(4 / r(2), 2 * r(2)) && Math.abs(2 * r(2) - 2.83) < 0.005); assert.match(v(9), /2√2 m/);
  // Nivel 3.
  assert.ok(cerca(1 / (r(5) - 2) + 1 / (r(5) + 2), 2 * r(5)));
  assert.ok(cerca(1 / (r(3) - r(2)) - 1 / (r(3) + r(2)), 2 * r(2)));
  assert.ok(cerca(1 / (c(3) - c(2)), c(9) + c(6) + c(4)));
  const x = 1 / (r(2) - 1); assert.ok(cerca(x - 1 / x, 2));
  assert.ok(cerca(1 / r(3 + 2 * r(2)), r(2) - 1));
  const esperado = ['2√5', '2√2', '∛9 + ∛6 + ∛4', '2', '√2 − 1'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

test('la letra de cada alternativa es la del valor correcto, en negrita y en violeta', () => {
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (e.nivel !== 3) continue;
    const L = plano(e.respuesta).replace(/⁠/g, '').split(', ')[0];
    assert.ok(Array.isArray(e.alternativas) && /^[A-E]$/.test(L), `${id} ejemplo ${k + 1}`);
    assert.equal(plano(e.alternativas['ABCDE'.indexOf(L)]), sinLetra(plano(e.respuesta)).replace(/ dm$/, ''), `${id} ejemplo ${k + 1}: ${L}`);
    assert.equal(new Set(e.alternativas.map(plano)).size, e.alternativas.length, `${id} ejemplo ${k + 1}: alternativas repetidas`);
    const f = fichas(e.respuesta)[0];
    assert.ok(f && f.m === 'letra de alternativa' && f.v === 'c-f', `${id} ejemplo ${k + 1}`);
  }
});
