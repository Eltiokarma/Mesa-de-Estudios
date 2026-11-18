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
// La raíz cúbica con su índice de color se lee «raíz 3 de 4»: aquí se vuelve a escribir «∛4» para leerla con números.
const plano = x => E.texto(x === undefined || x === null ? '' : x).replace(/raíz 3 de (\d+)/g, '∛$1');
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
    'lados del tablero': 'f', 'factor uno': 'f', 'índice': 'i' });
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
    // Ronda 2: con el 3 a la vista, «8 + 3 · 4 + 3 · 2 + 1».
    const n = plano(cb.lectura(w)).match(/= (\d+): (\d+) \+ 3 · (\d+) \+ 3 · (\d+) \+ (\d+)/).slice(1).map(Number);
    assert.equal(n[0], (w.a + w.b) ** 3); assert.equal(n[1] + 3 * n[2] + 3 * n[3] + n[4], n[0]);
    assert.deepEqual(n.slice(1), [w.a ** 3, w.a * w.a * w.b, w.a * w.b * w.b, w.b ** 3]);
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
  const js = t.replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '.').replace(/·/g, '*')
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
    r = idea('cubo-binomio').resuelve.generar(s); m = plano(r.enunciado).match(/a (\d+) cm de una esquina.*mide (\d+) cm/);
    assert.equal(plano(r.respuesta), `Las seis del medio: ${(+m[1] + +m[2]) ** 3 - m[1] ** 3 - m[2] ** 3} cm³`);
    r = idea('radicales-dobles').resuelve.generar(s); m = plano(r.enunciado).match(/^Una mesa cuadrada de (\d+) \+ 2√(\d+) dm²/);
    const pr = plano(r.respuesta).match(/^Planchas de (\d+) y (\d+) dm²; lado √(\d+) \+ √(\d+) dm$/);
    assert.ok(pr, plano(r.respuesta));
    assert.equal(+pr[1] + +pr[2], +m[1]); assert.equal(pr[1] * pr[2], +m[2]); assert.ok(+pr[1] > +pr[2]);
    assert.ok(cerca(Math.sqrt(+pr[3]) + Math.sqrt(+pr[4]), Math.sqrt(+m[1] + 2 * Math.sqrt(+m[2]))));
    r = idea('racionalizar').resuelve.generar(s); m = plano(r.enunciado).match(/mide (\d+) dm\./);
    assert.ok(+m[1] >= 6 && +m[1] <= 15, `varilla de ${m[1]} dm`);
    const lado = plano(r.respuesta).match(/^Lado: (.+) dm, unos/)[1];
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
  assert.equal(7 + 3, 10); assert.equal(7 ** 2 - 3 ** 2, 40); assert.equal(40 / 10, 4); assert.equal(v(9), 'a − b = 4');
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
  assert.equal(3 * 3 * 1, 9); assert.equal(v(0), '9 cm³');
  assert.deepEqual(coefs(v(1)), { 3: 1, 2: 6, 1: 12, 0: 8 });
  assert.equal(27 - 9, 3 * 4 * 1 + 3 * 2 * 1); assert.match(v(2), /18/);
  assert.equal(11 ** 3, 1331); assert.match(v(3), /1331/);
  assert.match(v(4), /15x²/);
  assert.deepEqual(coefs(v(5)), { 3: 1, 2: -9, 1: 27, 0: -27 });
  assert.deepEqual(coefs(v(6)), { 3: 8, 2: 12, 1: 6, 0: 1 }); for (const x of [1, 2]) assert.equal((2 * x + 1) ** 3, 8 * x ** 3 + 12 * x * x + 6 * x + 1);
  for (const x of [-1, 3]) for (const y of [2, -5]) assert.equal((x + 2 * y) * (x * x - 2 * x * y + 4 * y * y), x ** 3 + 8 * y ** 3);
  for (const x of [-1, 3]) assert.equal((2 * x - 3) * (4 * x * x + 6 * x + 9), 8 * x ** 3 - 27);
  assert.equal(v(7), '(x + 2y)(x² − 2xy + 4y²)'); assert.equal(v(8), '(2x − 3)(4x² + 6x + 9)');
  assert.equal(101 ** 3 - 99 ** 3, 60002); assert.equal(2 * 3 * 100 ** 2 * 1 + 2 * 1, 60002); assert.match(v(9), /60 002/);
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
  assert.ok(cerca(r(9 - 2 * r(14)) * r(9 + 2 * r(14)), 5)); assert.ok(cerca(r(9 - 2 * r(14)), r(7) - r(2)));
  assert.ok(cerca(r(3 + r(8)) - r(2), 1));
  assert.ok(cerca(4 * r(12 + 2 * r(35)), 4 * r(7) + 4 * r(5)));
  assert.ok(cerca(r(16 - 6 * r(7)), 3 - r(7)));
  const esperado = ['2√3', '5', '1', '4√7 + 4√5 dm', '3 − √7'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

test('ejemplos de la idea 5: cuentas rehechas aparte', () => {
  const ej = idea('racionalizar').ejemplos, v = k => sinLetra(plano(ej[k].respuesta)), r = Math.sqrt, c = Math.cbrt;
  assert.ok(cerca(9 / r(2), 9 * r(2) / 2) && Math.abs(9 / r(2) - 6.36) < 0.005); assert.match(v(0), /9√2\/2 dm/);
  const fr = [[1, 1 / r(5)], [2, 6 / r(3)], [4, r(3) / r(2)], [5, 2 / (r(3) + 1)], [6, 4 / (r(7) - r(3))], [7, (2 + r(2)) / r(2)], [8, 1 / c(2)]];
  for (const [k, x] of fr) { assert.ok(cerca(valor(v(k)), x), `${k + 1}: ${v(k)}`); assert.ok(!/\/\s*\(?[^)]*[√∛]/.test(v(k).split(' / ')[1] || ''), v(k)); }
  assert.ok(cerca(r(2) / 2, 1 / r(2)));
  assert.ok(cerca(4 * 12 / r(2), 24 * r(2)) && Math.abs(24 * r(2) - 33.94) < 0.005); assert.match(v(9), /24√2 dm/);
  // Nivel 3.
  assert.ok(cerca(1 / (r(5) - 2) + 1 / (r(5) + 2), 2 * r(5)));
  assert.ok(cerca(1 / (r(3) - r(2)) - 1 / (r(3) + r(2)), 2 * r(2)));
  assert.ok(cerca(1 / (c(3) - c(2)), c(9) + c(6) + c(4)));
  const x = 1 / (r(2) - 1); assert.ok(cerca(x - 1 / x, 2));
  assert.ok(cerca(1 / r(3 + 2 * r(2)), r(2) - 1));
  const esperado = ['2√5', '2√2', '∛9 + ∛6 + ∛4', '2', '√2 − 1'];
  ej.slice(10).forEach((e, k) => assert.equal(v(10 + k), esperado[k]));
});

// Ronda 2 del lector en frío (18 nov): la letra va en negrita y en tinta, no en violeta (el violeta es de la pieza del medio).
test('la letra de cada alternativa es la del valor correcto, en negrita y en tinta', () => {
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (e.nivel !== 3) continue;
    const L = plano(e.respuesta).replace(/⁠/g, '').split(', ')[0];
    assert.ok(Array.isArray(e.alternativas) && /^[A-E]$/.test(L), `${id} ejemplo ${k + 1}`);
    assert.equal(plano(e.alternativas['ABCDE'.indexOf(L)]).replace(/ dm$/, ''), sinLetra(plano(e.respuesta)).replace(/ dm$/, ''), `${id} ejemplo ${k + 1}: ${L}`);
    assert.equal(new Set(e.alternativas.map(plano)).size, e.alternativas.length, `${id} ejemplo ${k + 1}: alternativas repetidas`);
    const f = e.respuesta[0];
    assert.ok(f && typeof f.negrita === 'string' && !('v' in f), `${id} ejemplo ${k + 1}`);
    for (const x of e.solucion) for (const y of [].concat(x.texto)) assert.ok(!(y && y.v && /^[A-E]⁠$/.test(y.t)), `${id} ejemplo ${k + 1}: letra con color`);
  }
});

// ---------- Correcciones del 18 nov (rutinas/auditoria/algebra.productos-notables.md, «Correcciones») ----------
// Un número o un polinomio en x escrito como texto («2√5/9», «(∛3 + ∛2)/5», «8x³ + 8x», «4(√12 + √35)», «7 m»), en x.
function num(t, x = 0) {
  let js = plano(t).replace(/\s*(m|dm|cm)$/, '').replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '.').replace(/·/g, '*')
    .replace(/√(\d+)/g, 'S($1)').replace(/∛(\d+)/g, 'C($1)').replace(/√\(/g, 'S(').replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4');
  js = js.replace(/([\dx)])(?=[xSC(])/g, '$1*').replace(/\^/g, '**');
  assert.ok(/^[-+*/().\dxSC]+$/.test(js), `no sé leer «${plano(t)}» (${js})`);
  return Function('x', 'S', 'C', `return ${js};`)(x, Math.sqrt, Math.cbrt);
}
// M2 y B1: lo que dice la explicación de cada alternativa incorrecta de nivel 3, rehecho aquí con números (no con el
// texto del resuelto), y comparado con el valor de su alternativa. Una función de x es un polinomio (se compara en 2 y 3).
const r2 = Math.sqrt, r3 = Math.cbrt, X1 = r2(2) + 1;
const TRAMPAS = {
  'cuadrado-suma|Las piezas de un terreno': { A: r2(34 + 15), C: r2(34), D: 34 + 2 * 15, E: r2(34 - 2 * 15) },
  'cuadrado-suma|El producto escondido': { A: 49 - 25, B: (49 + 25) / 2, D: (7 - 25) / 2, E: 49 + 25 },
  'cuadrado-suma|Con raíces': { A: 3 + 2, B: 5 + r2(6), D: (3 + 2) ** 2, E: 5 + 2 * r2(3 + 2) },
  'cuadrado-suma|Cuadrados de x y 1/x': { A: 5 ** 2, C: 5 ** 2 + 2, D: 5 ** 2 - 1, E: 2 * 5 },
  'cuadrado-suma|El lado de antes': { B: 69 / 6, C: 10 + 3, D: 69 / 3, E: (69 - 9) / 3 },
  'suma-por-diferencia|Suma y diferencia': { A: 9 ** 2 - 5 ** 2, B: (9 ** 2 - 5 ** 2) / 2, D: 9 * 5, E: (9 + 5) / 2 },
  'suma-por-diferencia|Cuartas potencias': { B: 0, C: x => 4 * x, D: x => 2 * x * x * 4 * x, E: x => (x ** 4 + 1) - (x ** 4 - 1) },
  'suma-por-diferencia|Sextas potencias': { B: 63 / 7, C: 63 / 7 - 8, D: 63 - 7, E: 63 / 7 / 2 },
  'suma-por-diferencia|Una diferencia constante': { B: 6 - 4, C: 0, D: 4 + 6, E: x => (x * x + 4 * x + 5) - (x * x + 6 * x + 5) },
  'suma-por-diferencia|Un número enorme': { A: 1000 ** 2 - 1000 ** 2, C: 1, D: -2 * 1, E: 2 * 1000 * 1 - 1 },
  'cubo-binomio|Suma y producto': { A: 5 ** 3, B: 5 ** 3 - 3 * 5, D: 5 ** 3 + 3 * 3 * 5, E: 3 * 3 * 5 },
  'cubo-binomio|Al revés': { B: (64 - 28) / 4, C: (64 - 28) / 3, D: 64 - 28, E: (64 - 28) / 6 },
  'cubo-binomio|Diferencia y producto': { A: 2 ** 3, C: 2 ** 3 + 3 * 15, D: 2 ** 3 - 3 * 15 * 2, E: 2 ** 3 + 15 * 2 },
  'cubo-binomio|Cubos de x y 1/x': { A: 3 ** 3, B: 3 ** 3 - 3 * 1, D: 3 * 1 * 3, E: 3 ** 3 - 1 },
  'cubo-binomio|Cuadrados y cubos': { A: 3 ** 3, B: 3 ** 3 - 3 * 2, D: 3 * 5, E: 3 * 2 * 3 },
  'radicales-dobles|Dos radicales dobles': { A: r2(5) + r2(5), C: (r2(3) + r2(2)) - (r2(3) - r2(2)), D: 0, E: r2(3) + r2(2) },
  'radicales-dobles|Un producto de radicales dobles': { A: 81 - 56, B: 7 + 2, D: r2(81 - 2 * 14), E: r2(7) - r2(2) },
  'radicales-dobles|Una resta que da entero': { B: r2(2) + 1, C: (r2(2) - 1) - r2(2), D: 3 + 2 * r2(2) - r2(2), E: 2 * (r2(2) + 1) - r2(2) },
  'radicales-dobles|El perímetro de la mesa': { B: 4 * (r2(12) + r2(35)), C: 2 * (r2(7) + r2(5)), D: r2(7) + r2(5), E: 4 * r2(35) },
  'radicales-dobles|Con número delante y resta': { A: r2(7) - 3, C: r2(15) - 1, D: r2(16) - r2(63), E: 3 + r2(7) },
  'racionalizar|Suma con conjugados': { B: (r2(5) + 2) - (r2(5) - 2), C: 0, D: 2 * r2(5) / 9, E: (r2(5) + 2) + (r2(5) + 2) },
  'racionalizar|Resta con conjugados': { A: (r2(3) + r2(2)) + (r2(3) - r2(2)), B: 0, D: 2 * r2(2) / 5, E: (r2(3) - r2(2)) - (r2(3) + r2(2)) },
  'racionalizar|Con raíces cúbicas': { A: r3(3) + r3(2), C: r3(9) - r3(6) + r3(4), D: (r3(3) + r3(2)) / 5, E: r3(9) + r3(4) },
  'racionalizar|x menos su inverso': { B: X1 + 1 / X1, C: X1 - X1, D: X1 * (1 / X1), E: (r2(2) - 1) - (r2(2) + 1) },
  'racionalizar|Un radical doble abajo': { A: r2(2) + 1, C: (r2(2) - 1) / 3, D: 1 / (r2(3) + r2(2)), E: 1 / (3 + 2 * r2(2)) },
};
test('M2 y B1: cada alternativa incorrecta de nivel 3 se explica, y lo que dice su explicación da su valor', () => {
  let n = 0;
  for (const id of IDEAS) for (const e of idea(id).ejemplos.filter(x => x.nivel === 3)) {
    const t = TRAMPAS[`${id}|${e.titulo}`], L = plano(e.respuesta).replace(/⁠/g, '').split(', ')[0];
    assert.ok(t, `${id}: «${e.titulo}» sin su tabla de trampas`);
    const texto = plano(e.solucion.map(x => x.texto)).replace(/⁠/g, '');
    for (const [k, alt] of e.alternativas.entries()) {
      const letra = 'ABCDE'[k];
      if (letra === L) continue;
      assert.ok(new RegExp(`\\bLa ${letra}\\b`).test(texto), `${id} «${e.titulo}»: la ${letra} (${plano(alt)}) no se explica`);
      assert.ok(letra in t, `${id} «${e.titulo}»: falta rehacer la ${letra}`);
      const f = t[letra];
      for (const x of typeof f === 'function' ? [2, 3] : [0]) {
        const esp = typeof f === 'function' ? f(x) : f;
        assert.ok(cerca(num(alt, x), esp), `${id} «${e.titulo}»: la ${letra} vale ${num(alt, x)} y su explicación da ${esp}`);
      }
      n++;
    }
  }
  assert.equal(n, 100);
});

test('A1: todo ejercicio que usa 3ab(a ± b) trae en Datos la identidad de la suma o de la resta de cubos', () => {
  const SUMA = 'a³ + b³ = (a + b)³ − 3ab(a + b)', RESTA = 'a³ − b³ = (a − b)³ + 3ab(a − b)';
  const usa = (sol, datos, donde) => {
    const t = plano(sol), d = plano(datos);
    if (/3ab\(a \+ b\)|3 · [\d ·]*\(x \+ 1\/x\)/.test(t)) assert.ok(d.includes(SUMA), `${donde}: ${t}`);
    if (/3ab\(a − b\)/.test(t)) assert.ok(d.includes(RESTA), `${donde}: ${t}`);
    return /3ab\(a [+−] b\)/.test(t) ? 1 : 0;
  };
  let n = 0;
  for (const id of IDEAS) for (const e of idea(id).ejemplos) n += usa(e.solucion.map(x => [x.texto, x.ecuacion || '']), e.datos, `${id} «${e.titulo}»`);
  for (let s = 0; s < SEMILLAS; s++) { const a = idea('cubo-binomio').ahoraTu.generar(s); n += usa([a.solucion.texto, a.solucion.ecuacion], a.datos, `ahora tú ${s}`); }
  assert.ok(n >= 85, `${n} ejercicios con la identidad`);
  // La regla trae las dos, cada una en su renglón, sin ± ni ∓ (M7).
  const reg = plano(idea('cubo-binomio').regla.ecuacion);
  assert.ok(reg.includes(SUMA) && reg.includes(RESTA) && !/[±∓]/.test(reg), reg);
});

test('M1 y M8: en cada idea, dos ejemplos de niveles distintos no son la misma cuenta con otros números', () => {
  // Cada número distinto se vuelve #1, #2…: «(x + 6)(x − 6)» (suma por diferencia) no es «(x + 7)(x − 4)».
  // El 2 de «A + 2√B» es parte de la forma del radical doble (con 4√6 ya hay un paso más): se deja como está.
  const forma = e => { const m = new Map(); return plano(e.enunciado).replace(/(?<![\d,])2√/g, '§√').replace(/\d+(,\d+)?/g, n => { if (!m.has(n)) m.set(n, `#${m.size + 1}`); return m.get(n); }); };
  for (const id of IDEAS) {
    const vistos = new Map();
    for (const e of idea(id).ejemplos) {
      const f = forma(e);
      if (vistos.has(f)) assert.equal(vistos.get(f), e.nivel, `${id}: «${e.titulo}» (nivel ${e.nivel}) repite «${f}» del nivel ${vistos.get(f)}`);
      vistos.set(f, e.nivel);
    }
  }
  // Las cometas de los ejemplos: una de nivel 1 (el lado) y otra de nivel 2 (el contorno), no la misma pregunta.
  const com = idea('racionalizar').ejemplos.filter(e => /cometa/.test(plano(e.enunciado)));
  assert.deepEqual(com.map(e => e.nivel), [1, 2]);
  assert.match(plano(com[1].enunciado), /contorno/);
  // Cubos: el nivel 2 de la suma de cubos pide ver el cubo primero (8y³ = (2y)³), no solo reemplazar.
  assert.match(plano(idea('cubo-binomio').ejemplos.find(e => /suma de cubos/i.test(e.titulo)).enunciado), /8y³/);
});

test('M7: cada letra y signo de la regla se dice en palabras (en la regla, su condición o la leyenda del juego)', () => {
  for (const id of IDEAS) {
    const i = idea(id), ec = plano([i.regla.ecuacion, ' ', i.regla.condicion]);
    const dicho = [i.regla.texto, i.regla.condicion, ...i.juega.leyenda.map(x => plano(x.s))].join(' | ');
    for (const l of new Set(ec.match(/(?<![\p{L}])[A-Za-z](?![\p{L}])/gu) || [])) assert.ok(new RegExp(`(?<![\\p{L}])${l}(?![\\p{L}])`, 'u').test(dicho), `${id}: «${l}» no se dice`);
    for (const sg of ['±', '∓']) if (ec.includes(sg)) assert.ok(i.regla.texto.includes(sg) && /más o menos|contrario/.test(i.regla.texto), `${id}: «${sg}» sin explicar`);
    assert.ok(!/\bC\b/.test(ec), `${id}: una C sin presentar`);
    assert.ok(!/^\s*Vale\b/.test(i.regla.condicion), `${id}: la app ya antepone «Vale si»`);
  }
  assert.match(idea('suma-por-diferencia').regla.condicion, /p y q son/);
});

test('M3, M4 y M10: la figura no junta datos, el juego no abre con una raíz exacta y el glosario no cumple la misión', () => {
  // M3: «El lado de la mesa» no rotula las planchas rectangulares con √12 (√6 · √2, lo que sale de juntar los datos).
  const e = idea('radicales-dobles').ejemplos.find(x => x.titulo === 'El lado de la mesa');
  const ts = textosSVG(P.dibujar(e.figura.datos)).join(' | ');
  assert.ok(!/√12|12 dm/.test(ts), ts);
  // M4: la lectura saca la raíz cuando el producto es un cuadrado; el juego no abre en la misión.
  const j = idea('radicales-dobles').juega;
  for (const v of Teoria.grilla(j.controles)) {
    const t = plano(j.lectura(v));
    for (const [, k] of t.matchAll(/√(\d+)/g)) assert.ok(!Number.isInteger(Math.sqrt(+k)), `${JSON.stringify(v)}: ${t}`);
  }
  const ini = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
  assert.ok(!j.mision.logrado(ini) && !Number.isInteger(Math.sqrt(ini.x * ini.y)), JSON.stringify(ini));
  // M10: ni el glosario de la idea ni sus tarjetas de «Lee» traen la mesa de la misión (8 + 2√15) resuelta.
  const k = def.ideas.indexOf(idea('radicales-dobles')), g = Glosario.porIdea(def)[k];
  for (const x of [...g.map(y => [y.def, y.simple, ...(y.ejemplos || [])].join(' ')), ...idea('radicales-dobles').lee.tarjetas.map(t => plano([t.texto, t.ecuacion || '']))])
    assert.ok(!/8 \+ 2√15|√5 \+ √3/.test(x), x);
});

test('M9 y B2: valores creíbles (taco en cm, cometas de 1 a 2 m o de 6 a 15 dm) y sin el paso hecho en los datos', () => {
  const cb = idea('cubo-binomio'), ra = idea('racionalizar');
  const limpio = x => (Array.isArray(x) ? x.map(limpio) : x === undefined || x === null ? '' : x);
  for (const x of lecturas(cb)) assert.ok(!/\bdm/.test(plano(limpio(x.x))), `cubo ${x.donde}: ${plano(limpio(x.x))}`);
  assert.ok(ra.juega.controles.find(c => c.id === 'd').max <= 2);
  for (const e of ra.ejemplos.filter(y => /cometa/.test(plano(y.enunciado)))) {
    const d = +plano(e.enunciado).match(/mide (\d+) dm/)[1];
    assert.ok(d >= 6 && d <= 15, e.titulo);
    assert.ok(!/larga/.test(plano(e.enunciado)), e.titulo);
  }
  assert.ok(!/larga/.test(ra.lee.tarjetas[0].texto));
  // «31 = 30 + 1» no va en los datos: escribir el número así es lo que se practica (B2).
  for (const id of IDEAS) {
    const i = idea(id);
    for (const e of i.ejemplos) for (const l of e.datos || []) assert.ok(!/^\d+(,\d+)? = \d+(,\d+)? [+−] \d/.test(plano(l)), `${id} «${e.titulo}»: ${plano(l)}`);
    for (let s = 0; s < 100; s++) for (const l of i.ahoraTu.generar(s).datos) assert.ok(!/^\d+(,\d+)? = \d+(,\d+)? [+−] \d/.test(plano(l)), `${id} ${s}: ${plano(l)}`);
  }
});

test('lector en frío: «Las esquinas y el taco» trae el dibujo de las piezas que nombra; el índice de la raíz cúbica en turquesa', () => {
  // Ronda 2: ni el título ni el dibujo dicen que no bastan; el dibujo marca las dos esquinas que nombra el enunciado.
  const e = idea('cubo-binomio').ejemplos.find(x => x.titulo === 'Las esquinas y el taco');
  assert.ok(e.figura && e.figura.datos.abrir === 1 && e.figura.datos.solo === 'esquinas' && !e.figura.datos.total && !e.figura.datos.rot, 'dibujo abierto, sin volúmenes');
  assert.match(plano(e.respuesta), /18 cm³/);
  // Ningún resuelto sin dibujo habla de «franjas» (idea 1): el dibujo no está.
  for (const x of idea('cuadrado-suma').ejemplos.filter(y => !y.figura)) assert.ok(!/franja/.test(plano(x.solucion.map(y => y.texto))), x.titulo);
  // La raíz cúbica de la idea 5 va con su índice de color, nunca con el signo ∛ pegado.
  const ra = idea('racionalizar'), raices = [];
  const busca = x => { if (Array.isArray(x)) x.forEach(busca); else if (x && typeof x === 'object') { if (x.raiz && x.indice) raices.push(x); Object.values(x).forEach(busca); } else if (typeof x === 'string') assert.ok(!x.includes('∛'), x); };
  busca([ra.regla.ecuacion, ra.ejemplos.map(y => [y.enunciado, y.alternativas, y.solucion.map(z => z.ecuacion), y.respuesta]), [0, 1, 2, 3, 4, 5, 8, 13].map(s => ra.ahoraTu.generar(s * 5 + 3).pregunta)]);
  assert.ok(raices.length > 20);
  for (const r of raices) assert.ok(r.indice.v === 'c-i' && r.indice.m === 'índice', JSON.stringify(r.indice));
});
