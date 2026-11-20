// Prueba propia de «Ángulos en posición normal» (Etapa 8): lo que el validador común no mira. Colores por magnitud en
// figuras y textos, misiones de una sola salida, predicciones que el juego no muestra, «Ahora tú» que no repite ejemplos
// ni la predicción, cada distractor con el valor de su error, letras repartidas en el nivel 3 y nada de las unidades que
// siguen (la paridad de «Reducción» y el radio 1 de «Circunferencia trigonométrica»). Las cuentas completas se rehicieron
// aparte (scratchpad e8-trigonometria/cuentas.js, 7475 comprobaciones en 400 semillas).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..', '..', '..');
const Kit = require(path.join(RAIZ, 'nucleo/kit/kit.js'));
const Teoria = require(path.join(RAIZ, 'nucleo/teoria.js'));
const def = require('./angulos-en-posicion-normal.js');

const aplana = x => (Array.isArray(x) ? x.map(aplana).join('') : x && typeof x === 'object' ? (x.negrita ? aplana(x.negrita) : x.frac ? `${aplana(x.frac[0])}/${aplana(x.frac[1])}` : 't' in x ? String(x.t) : Object.values(x).map(aplana).join(' ')) : String(x ?? ''));
const plano = x => aplana(x).replace(/ /g, ' ');
const idea = id => def.ideas.find(i => i.id === id);
const R = g => g * Math.PI / 180;
const raz = (fn, x, y) => { const r = Math.hypot(x, y), p = { sen: [y, r], cos: [x, r], tan: [y, x], cot: [x, y], sec: [r, x], csc: [r, y] }[fn]; return Math.abs(p[1]) < 1e-9 ? null : p[0] / p[1]; };
function num(t) {
  t = String(t).trim().replace(/^≈\s*/, '');
  if (/no está definida/i.test(t)) return null;
  const s = t.replace(/−/g, '-');
  let m = s.match(/^(-?)(\d*)√(\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]) / +m[4];
  m = s.match(/^(-?)(\d*)√(\d+)$/); if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.sqrt(+m[3]);
  m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return +m[1] / +m[2];
  return +s.replace(',', '.');
}

// Todas las figuras de la unidad, con dónde están.
function figuras() {
  const out = [];
  const add = (d, f) => { if (f && f.datos) out.push([d, f.datos]); };
  for (const i of def.ideas) {
    i.lee.tarjetas.forEach((t, k) => add(`${i.id} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(i.juega.controles)) add(`${i.id} juego`, i.juega.dibujo(v));
    add(`${i.id} predice`, i.predice.dibujo); add(`${i.id} revelar`, i.predice.revelar); add(`${i.id} mira`, { datos: i.mira.datos }); add(`${i.id} regla`, i.regla.dibujo);
    i.ejemplos.forEach((e, k) => add(`${i.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 60; s++) { add(`${i.id} ahora ${s}`, i.ahoraTu.generar(s).dibujo); add(`${i.id} resuelve ${s}`, i.resuelve.generar(s).dibujo); }
  }
  return out;
}

test('lleva calidad 2 (cerrada el 20 nov tras el lector en frío y el auditor)', () => {
  assert.equal(def.calidad, 2);
});

test('colores de la unidad en las figuras: x turquesa y horizontal, y naranja y vertical, ángulos carmín, r en tinta; sin verde', () => {
  for (const [d, f] of figuras()) {
    for (const s of f.segmentos || []) {
      const hor = Math.abs(s.de[1] - s.a[1]) < 1e-9 && Math.abs(s.de[1]) < 1e-9, ver = Math.abs(s.de[0] - s.a[0]) < 1e-9 && Math.abs(s.de[1]) < 1e-9;
      if (s.color === 'i') assert.ok(hor, `${d}: un tramo turquesa que no es la abscisa`);
      if (s.color === 'o') assert.ok(ver, `${d}: un tramo naranja que no es la ordenada`);
      assert.notEqual(s.color, 'd', `${d}: verde`);
    }
    for (const a of f.arcos || []) assert.equal(a.color, 'h', `${d}: un arco de ángulo que no es carmín`);
    for (const r of f.rotulos || []) assert.ok([undefined, 'h', 'f', 'i'].includes(r.color), `${d}: rótulo en ${r.color}`);
    for (const p of f.puntos || []) assert.equal(p.color, undefined, `${d}: el punto P va en tinta`);
  }
});

test('colores en los textos: θ, α y β en carmín; nada en verde; la razón pedida de las respuestas en violeta', () => {
  const visto = [];
  const recorre = (x, d) => {
    if (Array.isArray(x)) return x.forEach(y => recorre(y, d));
    if (x && typeof x === 'object') {
      if (x.v) { assert.notEqual(x.v, 'c-d', `${d}: verde`); if (/^[θαβ]$/.test(x.t)) assert.equal(x.v, 'c-h', `${d}: ${x.t} sin carmín`); visto.push(x.v); }
      Object.values(x).forEach(y => recorre(y, d));
    }
  };
  for (const i of def.ideas) {
    recorre([i.lee, i.juega.consigna, i.juega.leyenda, i.predice, i.mira.pasos, i.regla.ecuacion], i.id);
    i.ejemplos.forEach((e, k) => { recorre([e.enunciado, e.datos, e.solucion, e.respuesta], `${i.id} ej ${k + 1}`); });
    for (let s = 0; s < 30; s++) { recorre(i.ahoraTu.generar(s), `${i.id} ahora ${s}`); recorre(i.resuelve.generar(s), `${i.id} resuelve ${s}`); }
  }
  assert.ok(visto.includes('c-f') && visto.includes('c-o') && visto.includes('c-i'));
});

test('misiones: una sola salida en la grilla y ninguna al abrir', () => {
  for (const i of def.ideas) {
    const g = Teoria.grilla(i.juega.controles), ini = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(g.filter(v => i.juega.mision.logrado(v)).length, 1, i.id);
    assert.ok(!i.juega.mision.logrado(ini), `${i.id}: cumplida al abrir`);
  }
});

test('las predicciones piden lo que el juego no mostró', () => {
  const lecturas = i => Teoria.grilla(i.juega.controles).map(v => plano(i.juega.lectura(v))).join(' | ');
  assert.ok(!/cos/.test(lecturas(idea('razones-coordenadas'))), 'el juego de la casa no da el coseno');
  assert.ok(!/tan/.test(lecturas(idea('signos-cuadrante'))), 'la rueda no da la tangente');
  assert.ok(!/tan/.test(lecturas(idea('cuadrantales'))), 'la veleta no da la tangente');
  assert.ok(Math.min(...Teoria.grilla(idea('giro-horario').juega.controles).map(v => v.g)) > -300, 'el minutero no llega a −300°');
  assert.ok(!/sen|cos/.test(lecturas(idea('coterminales-negativos'))), 'la bicicleta no da razones');
  // Y las respuestas, con el punto o el ángulo de verdad.
  const ok = i => idea(i).predice.opciones.find(o => o.correcta).texto;
  assert.ok(Math.abs(num(ok('razones-coordenadas')) - raz('cos', -12, 5)) < 1e-12);
  assert.ok(Math.tan(R(225)) > 0 && ok('signos-cuadrante') === 'Positivo');
  assert.ok(Math.abs(Math.cos(R(90))) < 1e-12 && ok('cuadrantales') === 'No está definida');
  assert.ok(Math.cos(R(-300)) > 0 && Math.sin(R(-300)) > 0 && ok('giro-horario') === 'En el I');
  assert.ok(Math.abs(Math.cos(R(780)) - num(ok('coterminales-negativos'))) < 1e-12);
});

test('«Ahora tú» no repite un ejemplo ni la predicción, y no es «Así se resuelve» (400 semillas)', () => {
  const nums = t => (plano(t).match(/\d+(?:,\d+)?/g) || []).filter(x => x !== '0').sort().join('|');
  for (const i of def.ideas) {
    const previos = new Set(i.ejemplos.map(e => nums(e.enunciado)).concat([nums(i.predice.pregunta)]).filter(Boolean));
    const res = new Set(Array.from({ length: 4 }, (_, s) => plano(i.resuelve.generar(s).enunciado)));
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), k = nums(c.pregunta);
      assert.ok(!k || !previos.has(k), `${i.id} semilla ${s}: repite los números de un ejemplo o de la predicción (${plano(c.pregunta)})`);
      if (s < 12) assert.ok(!res.has(plano(c.pregunta)), `${i.id} semilla ${s}: es un caso de «Así se resuelve»`);
      assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length, `${i.id} semilla ${s}: opciones repetidas`);
      const vals = c.opciones.map(o => num(o.texto)).filter(v => v !== null && Number.isFinite(v));
      assert.equal(new Set(vals.map(v => v.toFixed(9))).size, vals.length, `${i.id} semilla ${s}: dos opciones valen lo mismo`);
    }
  }
});

test('idea 1: cada distractor de «una razón de P» vale lo que dice su error (400 semillas)', () => {
  const i = idea('razones-coordenadas');
  for (let s = 0; s < 400; s += 3) {
    const c = i.ahoraTu.generar(s), m = plano(c.pregunta).match(/P\((−?\d+), (−?\d+)\)\. ¿Cuánto vale (\w+) θ/);
    if (!m) continue;
    const x = num(m[1]), y = num(m[2]), fn = m[3];
    const esp = { c: raz(fn, x, y), 'sin-signo': raz(fn, Math.abs(x), Math.abs(y)), inversa: 1 / raz(fn, x, y),
      cruza: raz({ sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' }[fn], x, y), longitud: fn === 'sen' ? y : x };
    for (const o of c.opciones) assert.ok(Math.abs(num(o.texto) - esp[o.id]) < 1e-9, `semilla ${s} ${o.id}: ${o.texto}`);
  }
});

test('nivel 3 de los ejemplos: 4 o 5 alternativas, una sola con el valor correcto y la letra repartida (cada una 5 veces)', () => {
  const letras = {};
  for (const i of def.ideas) for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
    assert.ok(e.alternativas.length >= 4 && e.alternativas.length <= 5, e.titulo);
    const r = plano(e.respuesta), l = r.match(/^([A-E]),/);
    const k = l ? 'ABCDE'.indexOf(l[1]) : e.alternativas.findIndex(a => a === r.trim());
    assert.ok(k >= 0, `${e.titulo}: no se sabe cuál es su alternativa`);
    letras['ABCDE'[k]] = (letras['ABCDE'[k]] || 0) + 1;
  }
  assert.deepEqual(letras, { A: 5, B: 5, C: 5, D: 5, E: 5 });
});

test('nada de las unidades que siguen: ni la paridad, ni el radio 1, ni el ángulo de referencia', () => {
  for (const i of def.ideas) {
    const t = plano([i.lee, i.juega.consigna, i.predice, i.mira.pasos, i.regla, i.ejemplos.map(e => [e.enunciado, e.datos, e.solucion])]);
    assert.ok(!/sen\(−θ\) = −sen θ|cos\(−θ\) = cos θ/.test(t), `${i.id}: la paridad es de «Reducción»`);
    assert.ok(!/radio 1\b|circunferencia trigonométrica|ángulo de referencia/i.test(t), `${i.id}: adelanta una unidad`);
  }
});

test('la pieza de la unidad es trig-pos y la unidad la pide (con trig-plano antes)', () => {
  assert.deepEqual(def.requiere, ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/trig-pos.js']);
  for (const i of def.ideas) assert.equal(i.pieza, 'trig-pos');
  assert.ok(Kit.piezas['trig-pos']);
});

// ---------- Cierre (20 nov): lo que encontraron el auditor y los lectores en frío (rutinas/auditoria y rutinas/frio) ----------
const raiz = (x, y) => Math.hypot(x, y);
const ejeVal = (fn, g) => { const x = Math.round(Math.cos(R(g))), y = Math.round(Math.sin(R(g))); return raz(fn, x, y); };

test('cierre: en los ejes, ninguna explicación dice «el tamaño 1 está bien» si la razón vale 0 (400 semillas)', () => {
  for (const id of ['cuadrantales', 'giro-horario']) for (let s = 0; s < 400; s++) {
    const c = idea(id).ahoraTu.generar(s), q = plano(c.pregunta), m = q.match(/(\w+) θ\?$/) && q.match(/θ = (−?\d+)°/) || q.match(/¿Cuánto vale (\w+)\((−\d+)°\)/);
    if (!m) continue;
    const fn = q.match(/¿Cuánto vale (\w+)/)[1], g = +m[m.length - 1].replace('−', '-');
    if (ejeVal(fn, g) !== 0) continue;
    for (const o of c.opciones) assert.ok(!/tamaño 1 está bien/.test(plano(o.siFuera || '')), `${id} ${s}: ${fn} ${g}° vale 0 y dice «${plano(o.siFuera)}»`);
  }
});

test('cierre: con múltiplos de θ, «sin los signos de los puntos» deja el signo de la expresión (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const c = idea('cuadrantales').ahoraTu.generar(s), q = plano(c.pregunta), m = q.match(/^Si θ = (\d+)°, calcula E = \((.+)\)\/\((.+)\)\.$/);
    if (!m) continue;
    const Th = +m[1], dd = m[3].match(/ \+ (\d+)$/), d = dd ? +dd[1] : 0;
    const terms = t => [...t.replace(/ \+ \d+$/, '').matchAll(/([+−] )?(\d+ )?(sen|cos|tan|sec|csc|cot) (\(θ\/2\)|\(3θ\/2\)|\dθ|θ)/g)]
      .map(z => ({ c: (z[1] && z[1][0] === '−' ? -1 : 1) * (z[2] ? +z[2] : 1), fn: z[3], k: { '(θ/2)': 0.5, '(3θ/2)': 1.5, 'θ': 1 }[z[4]] || +z[4][0] }));
    const abs = ts => ts.reduce((a, t) => a + t.c * Math.abs(ejeVal(t.fn, Th * t.k)), 0);
    const o = c.opciones.find(x => x.id === 'signo');
    if (o) assert.ok(Math.abs(num(o.texto) - abs(terms(m[2])) / (abs(terms(m[3])) + d)) < 1e-9, `${s}: «${o.texto}» en ${q}`);
  }
});

test('cierre: la idea de los coterminales practica giros negativos (predicción, Mira, regla, juego y «Así se resuelve»)', () => {
  const i = idea('coterminales-negativos');
  assert.match(plano(i.predice.pregunta), /cos\(−\d+°\)/);
  assert.ok(i.mira.datos.arcos.some(a => a.a < -360), 'Mira: un giro de más de una vuelta hacia atrás');
  assert.ok(i.regla.dibujo.datos.arcos.some(a => a.a < 0), 'la regla dibuja un coterminal negativo');
  assert.ok(i.juega.controles.find(c => c.id === 'n').inicio < 0, 'el juego abre con vueltas hacia atrás');
  assert.match(plano(i.resuelve.generar(0).enunciado), /con −\d+°/);
  // la predicción se responde con coordenadas: −660° y 60° son coterminales y cos 60° = 1/2
  assert.equal(num(plano(i.predice.opciones.find(o => o.correcta).texto)), Math.round(Math.cos(R(-660)) * 1e9) / 1e9);
});

test('cierre: textos que los lectores no entendieron', () => {
  const todo = JSON.stringify(def);
  for (const malo of ['queda donde con', 'hay dos números', 'resta mal', 'número de la casa', 'El juego llegó hasta', 'en su eje y el eje x', 'misma abscisa abajo', "'y = 0 va arriba"])
    assert.ok(!todo.includes(malo), `sigue «${malo}»`);
  assert.match(plano(idea('razones-coordenadas').juega.mision.texto), /r = 5/);
  assert.ok(!/^Sigue/.test(idea('giro-horario').regla.condicion), '«Vale si Sigue…»');
  assert.match(plano(idea('cuadrantales').regla.condicion), /a = r/);
  assert.ok(idea('signos-cuadrante').regla.dibujo.datos.rotulos.every(r => /> 0$/.test(r.texto)), 'la regla de signos dice que son las positivas');
});

test('cierre: figuras que ayudan sin regalar', () => {
  // Mira de la idea 4: el minutero se ve en cada cuarto de vuelta
  const m4 = idea('giro-horario').mira.datos;
  for (const k of [1, 2, 3]) assert.ok(m4.segmentos.some(s => s.desde === k && s.hasta === k && s.grosor === 'variable'), `Mira 4, paso ${k}: sin minutero`);
  // el juego del reloj abre con el minutero fuera del eje x
  assert.notEqual(idea('giro-horario').juega.controles[0].inicio % 180, 0);
  // «Así se resuelve» de los coterminales: arriba, la rueda sin girar; el giro aparece en las cuentas
  for (let s = 0; s < 8; s++) { const r = idea('coterminales-negativos').resuelve.generar(s); assert.equal((r.dibujo.datos.arcos || []).length, 0); assert.ok(r.pasos.some(p => p.dibujo && p.dibujo.datos.arcos.length)); }
  // «Así se resuelve» de las ideas 2 y 3 dibuja sus ángulos
  for (let s = 0; s < 6; s++) {
    const r2 = idea('signos-cuadrante').resuelve.generar(s), gs = plano(r2.enunciado).match(/\d+(?=°)/g).map(Number);
    assert.deepEqual(r2.dibujo.datos.rayos.map(x => x.ang), gs);
    const r3 = idea('cuadrantales').resuelve.generar(s);
    assert.ok(r3.dibujo.datos.puntos.length >= 2, 'idea 3: los ángulos sobre sus ejes');
  }
  // antes de girar, P lo dice
  assert.equal(idea('coterminales-negativos').ejemplos[2].figura.datos.puntos[0].rotulo, 'P al empezar');
});

test('cierre: el papel de circunferencia-trig no le da a esta unidad lo de «Reducción», y 37° lleva la convención', () => {
  const pap = require(path.join(RAIZ, 'plantillas/circunferencia-trig/papel.json')).problemas;
  for (const q of pap.filter(q => (q.unidades || []).includes(def.unidad))) {
    const t = [q.enunciado, ...q.pasos].join(' ');
    assert.ok(!/[Rr]educe|sen\(−|cos\(−|−sen|−cos/.test(t), `${q.id}: usa reducción o paridad`);
    if (/(?<![\d,])(37|53)°/.test(t)) assert.match(q.enunciado, /convención del examen/, `${q.id}: 37° sin la convención`);
  }
});
