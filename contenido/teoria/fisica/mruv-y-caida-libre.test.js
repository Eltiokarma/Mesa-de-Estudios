// Pruebas propias de «MRUV y caída libre» (además del validador común de contenido/teoria/teoria.test.js). Las seis ideas
// están rehechas contra el contrato (B1 en la fase 2; B2 a B6 en la fase 3, 18 nov) y la unidad declara calidad: 2.
//   - las seis ideas de la propuesta (B1–B6), en orden, y los ids que guardan avance (`pendiente-aceleracion`,
//     `caida-libre`, las mesas `pista-libre`, `ida-vuelta` y `recta-vt` y las palabras de la partición) siguen aquí;
//   - un color fijo por magnitud (cabecera del archivo): v naranja, t turquesa, x violeta, a carmín; sin verde;
//   - sin magnitudes vectoriales: en una recta, v y a son números con signo (ningún «⃗»);
//   - cada misión se cumple como dice la propuesta (B1 de cinco maneras; B2 a B6, de una) y nada de lo que se ve antes de
//     predecir (Lee, el juego, la leyenda, la figura de Predice) adelanta la respuesta;
//   - ninguna figura de un ejemplo delata la respuesta, y los rótulos y las flechas caben y no se pisan (fis-combi y
//     fis-mruv);
//   - «Ahora tú», «Así se resuelve» y los 90 ejemplos cuadran con un cálculo aparte, que no usa el código de la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const Avance = require('../../../nucleo/avance.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./mruv-y-caida-libre.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const IDEAS_REHECHAS = ['aceleracion', 'ecuaciones-mruv', 'pendiente-aceleracion', 'graficas-xt-at', 'caida-reposo', 'caida-libre'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
// Sin huecos: una opción correcta no trae siFuera, un ejemplo de nivel 1 no trae alternativas.
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/⁠/g, '');
const P = Kit.piezas['fis-combi'], PM = Kit.piezas['fis-mruv'];

// ---------- La unidad ----------
test('las seis ideas de la propuesta, en orden, y los ids que guardan avance', () => {
  assert.equal(def.unidad, 'fisica.mruv-y-caida-libre');
  assert.deepEqual(def.ideas.map(i => i.id), ['aceleracion', 'ecuaciones-mruv', 'pendiente-aceleracion', 'graficas-xt-at', 'caida-reposo', 'caida-libre']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['La aceleración', 'Las ecuaciones del MRUV', 'La gráfica velocidad–tiempo', 'Gráficas x–t y a–t',
    'Caída libre desde el reposo', 'Lanzamiento vertical']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['pista-libre', 'ida-vuelta', 'recta-vt'], 'la pista va primera (nucleo/teoria-retos.test.js)');
  // La partición del 18 nov sigue cayendo aquí: lo que Avance.migrar trae de la unidad vieja existe en esta.
  const V = 'fisica.movimiento-rectilineo', N = def.unidad;
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1,
    teoria: { [V]: { ideas: { mru: { hecha: true }, 'pendiente-aceleracion': { hecha: true }, 'caida-libre': { casos: 2 } } } },
    coleccion: ['pista-libre', 'ida-vuelta', 'recta-vt'].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m })),
    glosario: { [V]: { aceleracion: 'sabe', 'caida libre': 'sabe', gravedad: 'repasa' } } };
  assert.equal(Avance.migrar(est), true);
  const ideas = new Set(def.ideas.map(i => i.id)), mesas = new Set(def.laboratorio.map(m => m.id)), palabras = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const id of Object.keys(est.teoria[N].ideas)) assert.ok(ideas.has(id), `idea migrada «${id}» que ya no existe`);
  for (const c of est.coleccion) { assert.equal(c.unidad, N); assert.ok(mesas.has(c.mesa), c.mesa); }
  for (const k of Object.keys(est.glosario[N])) assert.ok(palabras.has(k), `palabra migrada «${k}» que ya no está`);
});

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
// Todo lo que el alumno lee en una idea: { donde, x }.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of (i.lee.tarjetas || []).entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => [x.s, x.t]));
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 7 === 0)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => [o.texto, o.siFuera])]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion, i.regla.condicion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.titulo, e.enunciado, e.datos, e.alternativas || [], e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

test('la tabla de colores, igual a la del MRU: velocidad naranja, tiempo turquesa, posición violeta, aceleración carmín; sin verde', () => {
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', largo: 'f', aceleración: 'h' });
  // Las dos unidades del movimiento rectilíneo dan el mismo color a cada magnitud que comparten.
  const mru = require('./movimiento-rectilineo.js').colores;
  for (const [m, c] of Object.entries(def.colores)) if (m in mru) assert.equal(c, mru[m], m);
});

test('un color por magnitud: cada ficha de las ideas rehechas dice su magnitud y lleva su color; cada letra, el suyo', () => {
  const LETRA = { v: 'c-o', t: 'c-i', x: 'c-f', a: 'c-h' };
  let n = 0;
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t in LETRA) assert.equal(f.v, LETRA[f.t], `${donde}: la letra ${f.t}`);
  }
  assert.ok(n > 2000, `${n} fichas`);
  const c = idea('aceleracion').juega.controles;
  assert.deepEqual(c.map(x => x.color), ['c-o', 'c-h', 'c-i']);
  // Ninguna idea de la unidad usa ya el verde (iría junto al naranja de v).
  for (const i of def.ideas) for (const ct of i.juega.controles) assert.notEqual(ct.color, 'c-d', `${i.id}: ${ct.id} en verde`);
  for (const m of def.laboratorio) for (const ct of m.controles) assert.notEqual(ct.color, 'c-d', `${m.id}: ${ct.id} en verde`);
});

test('sin magnitudes vectoriales: la unidad lo declara con su motivo y ninguna idea escribe una flecha «⃗»', () => {
  assert.equal(def.notacion.vectores, false);
  assert.ok(def.notacion.motivo.length > 30 && /signo/.test(def.notacion.motivo));
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) {
    assert.ok(!/⃗/.test(plano(x)), `${donde}: «⃗» en una recta`);
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${donde}: { vec } en una recta`);
  }
});

test('la unidad entera cumple el contrato de calidad 2: validador común, 15 ejemplos por idea y glosario por idea', () => {
  assert.equal(def.calidad, 2);
  const p = Teoria.problemas(def, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  const glos = Glosario.porIdea(def).map(es => es.map(g => g.termino).sort());
  assert.deepEqual(glos, [['MRUV', 'aceleración', 'frenar'], ['distancia de frenado', 'ecuación horaria'], ['gráfica v–t', 'área bajo la gráfica'],
    ['gráfica a–t', 'parábola'], ['caída libre', 'gravedad'], ['altura máxima', 'lanzamiento vertical']]);
  // «Altura máxima» es del curso entero: se define aquí y Movimiento parabólico ya no la define (la marca «se explica en…»).
  const parabolico = require('./movimiento-parabolico-y-circular.js');
  assert.ok(!parabolico.glosario.some(g => g.termino === 'altura máxima'), 'Movimiento parabólico vuelve a definir «altura máxima»');
  assert.ok(!def.glosario.some(g => g.termino === 'cima'), '«cima» quedó como palabra de todos los días');
  for (const g of def.glosario) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
  assert.ok(!idea('aceleracion').regla.dibujo, 'sin dibujo propio en la regla: la idea 1 es la de nucleo/teoria-ejemplos-regla.test.js');
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const k of ['aprendizaje', 'actividad', 'pregunta']) assert.ok(i[k], `${i.id}: ${k}`);
    // Los ejemplos de nivel 3 son de examen: con alternativas, y la letra de la respuesta en negrita.
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.ok(e.alternativas && e.alternativas.length >= 4, `${i.id} ${e.titulo}`);
      assert.ok(e.respuesta.some(x => x && x.negrita), `${i.id} ${e.titulo}: la letra en negrita`);
      assert.equal(new Set(e.alternativas).size, e.alternativas.length, `${i.id} ${e.titulo}: alternativas repetidas`);
    }
    // Las letras A–E van con { negrita } donde el resuelto las nombra.
    for (const e of i.ejemplos) for (const l of e.solucion) {
      const t = plano(l.texto);
      for (const m of t.matchAll(/\b(?:La|la) ([A-E])\b/g)) assert.ok(JSON.stringify(l.texto).includes(`{"negrita":["${m[1]}"]}`), `${i.id} ${e.titulo}: la ${m[1]} sin negrita`);
    }
    // Las respuestas de examen no son todas la misma letra.
    assert.ok(new Set(i.ejemplos.filter(x => x.alternativas).map(e => plano(e.respuesta)[0])).size >= 4, `${i.id}: letras de examen`);
  }
});

// Todas las figuras de B1 con la pieza que las dibuja.
function figuras(i) {
  const out = [], Pz = id => id || i.pieza;
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 3 === 0)) out.push([`juego ${JSON.stringify(v)}`, Object.assign({ pieza: i.juega.pieza }, i.juega.dibujo(v))]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo]);
  out.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar]);
  i.mira.pasos.forEach((p, k) => out.push([`mira ${k + 1}`, { pieza: Pz(i.mira.pieza), datos: i.mira.datos, estado: p.estado }]));
  if (i.predice.pieza) { out[out.length - i.mira.pasos.length - 2][1].pieza = i.predice.pieza; out[out.length - i.mira.pasos.length - 1][1].pieza = i.predice.pieza; }
  i.ejemplos.forEach((e, k) => { if (e.figura) out.push([`ejemplo ${k + 1}`, e.figura]); });
  for (let s = 0; s < 80; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) out.push([`ahora tú ${s}`, Object.assign({ pieza: i.ahoraTu.pieza }, a.dibujo)]);
    if (r.dibujo) out.push([`resuelve ${s}`, Object.assign({ pieza: i.resuelve.pieza }, r.dibujo)]);
  }
  if (i.regla.dibujo) out.push(['regla', i.regla.dibujo]);
  return out.map(([donde, f]) => [donde, Object.assign({ pieza: Pz(f.pieza) }, f)]);
}
const FIG = figuras(idea('aceleracion')).filter(([, f]) => f.pieza === 'fis-combi');
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('las figuras de B1: la combi en la avenida, sin verde, rótulos que caben y no se pisan, y flechas dentro del lienzo', () => {
  const W = P.constantes.W, H = P.constantes.H;
  for (const [donde, f] of FIG) {
    assert.equal(f.pieza, 'fis-combi', donde);
    assert.equal(f.datos.vista, 'avenida', donde);
    const s = P.dibujar(f.datos, f.estado || {});
    assert.ok(!/var\(--c-d\)/.test(s), `${donde}: verde`);
    assert.match(s, /data-prueba="si"/, `${donde}: dibujo de prueba`);
    const g = P.geometria(f.datos, f.estado || {});
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) {
      assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${donde}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
    }
    for (const fl of [g.flecha, g.flechaA, ...g.tenues].filter(Boolean)) assert.ok(Math.min(fl.x1, fl.x2) >= 4 && Math.max(fl.x1, fl.x2) <= W - 4, `${donde}: una flecha se sale`);
    // La rapidez va del lado de la punta (si no cabe, quedaría encima de la flecha tenue del segundo anterior).
    if (g.flecha && f.datos.crece) assert.ok(g.flecha.x2 > g.flecha.x1 ? g.flecha.caja.x0 >= g.flecha.x2 : g.flecha.caja.x1 <= g.flecha.x2, `${donde}: la rapidez no cabe junto a la punta`);
    // Las flechas tenues no se montan en la del segundo siguiente.
    const fs = [...g.tenues, g.flecha].filter(Boolean).sort((p, q) => p.x1 - q.x1);
    for (let k = 1; k < fs.length; k++) if (fs[k].x2 > fs[k].x1 && fs[k - 1].x2 > fs[k - 1].x1) assert.ok(fs[k - 1].x2 <= fs[k].x1 + 1e-9, `${donde}: dos flechas de v se montan`);
    const cx = P.escala(f.datos)(g.x);
    assert.ok(cx - P.constantes.CW / 2 >= 4 && cx + P.constantes.CW / 2 <= W - 4, `${donde}: la combi se sale`);
  }
  assert.ok(FIG.length > 200);
});

test('el juego solo acelera (frenar se predice) y la misión la cumplen cinco salidas', () => {
  const j = idea('aceleracion').juega, G = Teoria.grilla(j.controles);
  for (const v of G) {
    const d = j.dibujo(v).datos, g = P.geometria(d);
    assert.ok(d.a > 0 && d.v >= 0 && g.vt >= 0, JSON.stringify(v));
    assert.ok(!d.flechaA && !g.flechaA, 'el juego no dibuja la flecha de a (su sentido al frenar es la predicción)');
    assert.ok(!/−/.test(plano(j.lectura(v))) && !/−/.test(d.flechaTexto), JSON.stringify(v));
  }
  const buenas = new Set(G.filter(v => j.mision.logrado(v)).map(v => `${v.v0}+4·${v.a}`));
  assert.deepEqual([...buenas].sort(), ['0+4·3', '2+4·2.5', '4+4·2', '6+4·1.5', '8+4·1']);
  assert.ok(!j.mision.logrado(Teoria.inicio(j)), 'no está cumplida al abrir');
  assert.ok(!/fren|−|negativ|izquierda/.test(j.mision.bien), 'el «bien» no habla de lo que se predice');
});

const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
const numeros = t => (String(t).replace(/\s/g, '').match(/[−-]?\d+(?:,\d+)?/g) || []);
const cantidades = t => (String(t).match(/[−-]?\d+(?:,\d+)?(?:\s?[a-zA-Zμ°/²]+)?/g) || []).map(x => x.replace(/\s/g, '').replace(/^-/, '−'));
test('nada de lo que se ve antes de predecir adelanta la respuesta (−3 m/s², a contra v al frenar)', () => {
  const i = idea('aceleracion');
  // Lee: no habla de frenar ni de signos negativos, y no usa los números de la predicción.
  for (const t of i.lee.tarjetas) {
    const txt = plano([t.titulo, t.texto, t.ecuacion || '']);
    assert.ok(!/fren|−\d|negativ|contrari|al revés/.test(txt), `«Lee» adelanta la predicción: ${t.titulo}`);
    assert.ok(!/\b20 m\/s|\b8 m\/s|\b3 m\/s²/.test(txt), `«Lee» usa los números de la predicción: ${t.titulo}`);
    if (t.dibujo) { const d = t.dibujo.datos; assert.ok(!(d.a < 0) && !d.flechaA, t.titulo); }
  }
  // La leyenda y la consigna no dicen nada de frenar.
  assert.ok(!/fren|−\d|negativ/.test(plano([i.juega.consigna, i.juega.leyenda.map(x => [x.s, x.t]), i.juega.voz])));
  // La figura de Predice: la combi al empezar, con su flecha de 20 m/s; sin aceleración, sin marcas ni la flecha de a.
  const d = i.predice.dibujo.datos, g = P.geometria(d, i.predice.dibujo.estado || {});
  assert.equal(g.kMax, 0);
  assert.ok(!g.flechaA && !d.a);
  const txt = textosSVG(P.dibujar(d)).join(' | ');
  assert.ok(!/−3|3 m\/s²|8 m\/s/.test(txt), `Predice muestra «${txt}»`);
  // Los datos de Predice: valores, no la fórmula (el validador revisa la forma; aquí, que no diga a = Δv/Δt).
  assert.ok(!/Δ|÷|\//.test(plano(i.predice.datos)));
  // Mira sí lo muestra, en sus últimos pasos: la flecha de a contra la de v.
  const fin = P.geometria(i.mira.datos, i.mira.pasos[i.mira.pasos.length - 1].estado);
  assert.ok(fin.flechaA && fin.flechaA.x2 < fin.flechaA.x1 && fin.flecha.x2 > fin.flecha.x1, 'en Mira, a apunta al revés que v');
  assert.ok(!P.geometria(i.mira.datos, i.mira.pasos[0].estado).flechaA, 'la flecha de a aparece cuando el texto la explica');
});

// Los rótulos de una figura que no son números de un eje ni nombres de eje (de los que la figura no puede librarse).
function rotulosDeDato(f) {
  if (f.pieza === 'fis-combi') {
    const g = P.geometria(f.datos, f.estado || {});
    return { g, rot: g.rotulos.filter(r => !(g.numeros || []).includes(r) && r !== g.unidad && r !== g.mas && r !== g.menos).map(r => r.texto) };
  }
  const g = PM.geometria(f.datos, f.estado || {});
  return { g, rot: g.rotulos.filter(r => r.tipo !== 'numero' && r.tipo !== 'nombre').map(r => r.texto) };
}
test('ninguna figura de un ejemplo delata la respuesta', () => {
  let n = 0;
  for (const i of def.ideas) for (const [k, e] of i.ejemplos.entries()) {
    if (!e.figura) continue;
    n++;
    // Cantidades con su unidad: «20 m/s» de un dato no delata «20 m» de la respuesta.
    const { g, rot } = rotulosDeDato(e.figura), enFigura = new Set(rot.flatMap(cantidades));
    for (const x of fichas(e.respuesta)) for (const nn of cantidades(x.t)) {
      assert.ok(!enFigura.has(nn), `${i.id} ejemplo ${k + 1}: la figura muestra «${nn}» (${rot.join(' | ')})`);
    }
    if (e.figura.pieza !== 'fis-combi') continue;
    assert.equal(g.kMax, 0, `${i.id} ejemplo ${k + 1}: marcas de segundos (eso ya sería juntar datos)`);
    // Si se pide la aceleración, la figura no dibuja su flecha: su sentido es parte de la respuesta.
    if (/aceleración/.test(plano(e.enunciado).split('¿').slice(1).join(''))) assert.ok(!g.flechaA, `${i.id} ejemplo ${k + 1}: la flecha de a da el signo`);
  }
  assert.ok(n >= 60, `${n} ejemplos con figura`);
  // El ejemplo 9 de B1 no trae la regla de metros: en la unidad el 0 es el paradero, y el grifo no está ahí.
  assert.equal(idea('aceleracion').ejemplos[8].figura.pieza, 'fis-mruv');
  assert.equal(idea('aceleracion').ejemplos[8].figura.datos.vista, 'combi');
});

// ---------- Cálculo aparte (sin el código de la unidad) ----------
const num = s => Number(String(s).replace(/\s/g, '').replace('−', '-').replace(',', '.'));
const fmt = n => { const r = Math.round(n * 100) / 100; return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
const N = '(−?[\\d ,]+)';
test('«Ahora tú»: cuatro opciones distintas, una correcta, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('aceleracion'), vistos = new Set(), casos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), bien = plano(a.opciones.find(o => o.correcta).texto);
    assert.equal(a.opciones.length, 4, `semilla ${s}`);
    assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, 4, `semilla ${s}: opciones repetidas`);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1);
    assert.ok(a.datos && a.datos.length >= 2, `semilla ${s}: sin datos`);
    casos.add(q);
    let m, esperado;
    if ((m = q.match(new RegExp(`^Una combi (?:pasa por el paradero a ${N} m/s y acelera parejo|arranca del paradero y acelera parejo): (\\d+) s después va a ${N} m/s\\. ¿Cuál es su aceleración\\?$`)))) {
      const v0 = m[1] === undefined ? 0 : num(m[1]); esperado = `${fmt((num(m[3]) - v0) / num(m[2]))} m/s²`; vistos.add('acelera');
      assert.ok(num(m[3]) <= 20, `semilla ${s}: rapidez de avenida`);
    } else if ((m = q.match(new RegExp(`^Una combi va a ${N} m/s hacia la derecha y frena parejo: (\\d+) s después va a ${N} m/s\\. ¿Cuál es su aceleración\\?$`)))) {
      esperado = `${fmt((num(m[3]) - num(m[1])) / num(m[2]))} m/s²`; vistos.add('frena');
      assert.ok(bien.startsWith('−'), `semilla ${s}: al frenar hacia el +, a es negativa`);
    } else if ((m = q.match(new RegExp(`^Una combi pasa por el grifo a ${N} m/s hacia la derecha, con a = ${N} m/s²\\. ¿Qué velocidad tiene (\\d+) s después\\?$`)))) {
      const vf = num(m[1]) + num(m[2]) * num(m[3]); esperado = `${fmt(vf)} m/s`; vistos.add(num(m[2]) < 0 ? 'v-frena' : 'v-acelera');
      assert.ok(vf > 0, `semilla ${s}: no llega a detenerse`);
    } else if ((m = q.match(/^Una moto arranca del semáforo y llega a (\d+) km\/h en (\d+) s; después, en (\d+) s más, llega a (\d+) km\/h\. ¿Cuál es su aceleración media en (el segundo tramo|todo el viaje)\?$/))) {
      const v1 = num(m[1]) * 1000 / 3600, v2 = num(m[4]) * 1000 / 3600, t1 = num(m[2]), t2 = num(m[3]);
      esperado = `${fmt(m[5] === 'el segundo tramo' ? (v2 - v1) / t2 : v2 / (t1 + t2))} m/s²`; vistos.add(m[5]);
      // Promediar las aceleraciones de los tramos (el error típico) da otro número.
      assert.ok(Math.abs((v1 / t1 + (v2 - v1) / t2) / 2 - v2 / (t1 + t2)) >= 0.2, `semilla ${s}`);
      assert.ok(a.datos.some(d => /km/.test(plano(d))), `semilla ${s}: la equivalencia de km/h`);
    } else assert.fail(`semilla ${s}: no reconozco «${q}»`);
    assert.equal(bien, esperado, `semilla ${s}: ${q}`);
    for (const o of a.opciones.filter(y => !y.correcta)) assert.ok(o.error && o.siFuera, `semilla ${s}: ${o.id}`);
  }
  assert.deepEqual([...vistos].sort(), ['acelera', 'el segundo tramo', 'frena', 'todo el viaje', 'v-acelera', 'v-frena'], 'todas las variantes, hasta la de examen');
  assert.ok(casos.size > 150, `${casos.size} preguntas distintas`);
});

test('«Así se resuelve» pide el tiempo o la velocidad del inicio (nunca a ni la velocidad final, que son «Ahora tú») y cuadra aparte', () => {
  const i = idea('aceleracion');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado), resp = plano(r.respuesta);
    let m;
    if ((m = q.match(new RegExp(`^La combi (?:pasa por el paradero a ${N} m/s y acelera|arranca del paradero y acelera) con a = ${N} m/s²\\. ¿Cuánto tarda en llegar a ${N} m/s\\?$`)))) {
      const v0 = m[1] === undefined ? 0 : num(m[1]);
      assert.equal(resp, `Tarda ${fmt((num(m[3]) - v0) / num(m[2]))} s`, `resuelve ${s}`);
    } else if ((m = q.match(new RegExp(`^La combi frena con a = ${N} m/s² y, (\\d+) s después de pasar por el grifo, va a ${N} m/s\\. ¿A qué velocidad pasó por el grifo\\?$`)))) {
      assert.equal(resp, `v₀ = ${fmt(num(m[3]) - num(m[1]) * num(m[2]))} m/s`, `resuelve ${s}`);
    } else assert.fail(`resuelve ${s}: no reconozco «${q}»`);
    assert.ok(!/¿Cuál es su aceleración|¿Qué velocidad tiene/.test(q), `resuelve ${s}`);
  }
});

test('ejemplos: las cuentas de las respuestas, rehechas aparte, y la letra de cada alternativa', () => {
  const ej = idea('aceleracion').ejemplos, r = k => plano(ej[k].respuesta), kmh = k => k * 1000 / 3600;
  const acel = (v0, v, t) => (v - v0) / t;
  assert.match(r(0), new RegExp(`a = ${fmt(acel(0, 10, 5))} m/s²`));
  assert.match(r(1), new RegExp(`v = ${fmt(3 + 2 * 5)} m/s`));
  assert.match(r(2), new RegExp(`a = ${fmt(acel(15, 0, 5))} m/s²`));
  assert.match(r(3), new RegExp(`Tarda ${fmt(10 / 2.5)} s`));
  assert.match(r(4), new RegExp(`a = ${fmt(acel(4, 13, 3))} m/s²`));
  assert.equal(acel(4, 7, 1), acel(10, 13, 1), 'el velocímetro sube lo mismo cada segundo');
  assert.match(r(5), new RegExp(`a = ${fmt(acel(0, kmh(54), 5))} m/s²`));
  assert.match(r(6), new RegExp(`a = ${fmt(acel(kmh(72), kmh(36), 4))} m/s²`));
  assert.match(r(7), new RegExp(`^${fmt(18 - 2 * 6)} m/s a los 6 s; se detiene a los ${fmt(18 / 2)} s`));
  assert.match(r(8), new RegExp(`v₀ = ${fmt(14 - 1.5 * 6)} m/s`));
  assert.match(r(9), new RegExp(`a = ${fmt(acel(-10, -16, 3))} m/s²`));
  const letra = (k, alt) => { const L = 'ABCDE'[ej[k].alternativas.indexOf(alt)]; assert.ok(L, `ejemplo ${k + 1}: «${alt}» no es alternativa`); assert.match(r(k), new RegExp(`^${L}, `), `ejemplo ${k + 1}`); };
  letra(10, `${fmt(acel(0, kmh(36), 4))} m/s² y ${fmt(acel(kmh(36), kmh(72), 5))} m/s²`);
  letra(11, fmt(acel(0, 0, 18)));
  letra(12, `+${fmt(acel(-25, -10, 5))} m/s²`);
  letra(13, `${fmt(-3)} m/s², a los ${fmt(18 / 3)} s`);
  letra(14, `${fmt(acel(0, kmh(90), 10) * 4 * 3.6)} km/h`);
  // Los distractores de examen salen de errores que el resuelto nombra.
  assert.ok(ej[10].alternativas.includes(`${fmt(kmh(36) / 4)} m/s² y ${fmt(kmh(72) / 5)} m/s²`), 'K4: 20 ÷ 5 sin restar');
  assert.ok(ej[10].alternativas.includes(`${fmt(36 / 4)} m/s² y ${fmt(36 / 5)} m/s²`), 'U1: en km/h');
  assert.ok(ej[11].alternativas.includes(`${fmt(15 / 18)} m/s²`) && ej[11].alternativas.includes(`${fmt((3 + 0 - 5) / 3)} m/s²`));
  assert.ok(ej[14].alternativas.includes(`${fmt(90 / 10)} km/h`));
  for (const e of ej.filter(x => x.alternativas)) assert.equal(new Set(e.alternativas).size, e.alternativas.length, e.titulo);
  // Las respuestas de examen no son todas la misma letra.
  assert.ok(new Set(ej.filter(x => x.alternativas).map(e => plano(e.respuesta)[0])).size >= 4);
});

test('la predicción y su Mira cuadran aparte: de 20 a 8 m/s en 4 s', () => {
  const i = idea('aceleracion'), c = i.predice.opciones.find(o => o.correcta);
  assert.equal(plano(c.texto), `${fmt((8 - 20) / 4)} m/s²`);
  assert.equal(plano(i.predice.opciones.find(o => o.error === 'K4').texto), `+${fmt(8 / 4)} m/s²`);
  const g = P.geometria(i.mira.datos, { corte: 4 });
  assert.ok(Math.abs(g.x - (20 * 4 - 3 * 16 / 2)) < 1e-9 && Math.abs(g.vt - 8) < 1e-9, 'la combi del Mira está donde dicen las cuentas');
});

// ---------- Ideas B2 a B6 (fase 3, 18 nov) ----------
const W = 320;
const todasLasFiguras = () => def.ideas.flatMap(i => figuras(i).map(([d, f]) => [`${i.id} ${d}`, f]));
test('las figuras de las seis ideas: puras, de prueba, sin verde, rótulos que caben y no se pisan, líneas dentro de su gráfica', () => {
  const vistas = new Set();
  let n = 0;
  for (const [donde, f] of todasLasFiguras()) {
    const Pz = Kit.piezas[f.pieza];
    assert.ok(Pz, `${donde}: pieza ${f.pieza}`);
    const s = Pz.dibujar(f.datos, f.estado || {});
    assert.equal(s, Pz.dibujar(f.datos, f.estado || {}), `${donde}: no es pura`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), `${donde}: NaN`);
    assert.ok(!/var\(--c-d\)/.test(s), `${donde}: verde`);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${donde}: color fijo`);
    assert.match(s, /data-prueba="si"/, `${donde}: dibujo de prueba`);
    const g = Pz.geometria(f.datos, f.estado || {}), H = f.pieza === 'fis-mruv' ? g.H : P.constantes.H;
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${donde}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
    if (f.pieza === 'fis-mruv') {
      vistas.add(f.datos.vista);
      for (const p of g.planos || []) for (const [x, y] of p.lineas) assert.ok(x >= p.R.x0 - 1 && x <= p.R.x1 + 1 && y >= p.R.y0 - 1 && y <= p.R.y1 + 1, `${donde}: una línea sale de su gráfica`);
      for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= W - 4 && o.y0 >= 2 && o.y1 <= H - 2, `${donde}: ${o.nombre} se sale`);
    } else {
      const cx = P.escala(f.datos)(g.x);
      assert.ok(cx - P.constantes.CW / 2 >= 4 && cx + P.constantes.CW / 2 <= W - 4, `${donde}: la combi se sale`);
    }
    n++;
  }
  assert.deepEqual([...vistas].sort(), ['alcance', 'combi', 'grafica', 'pabellon', 'pista', 'regla', 'tres']);
  assert.ok(n > 1500, `${n} figuras`);
});

test('cada misión se cumple como dice la propuesta y no al abrir', () => {
  const sin = (v, k) => JSON.stringify(Object.fromEntries(Object.entries(v).filter(([c]) => !k.includes(c))));
  const casos = (id, fuera) => { const j = idea(id).juega; return [...new Set(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)).map(v => sin(v, fuera)))]; };
  assert.deepEqual(casos('ecuaciones-mruv', ['t']), ['{"a":-2}']);
  assert.deepEqual(casos('pendiente-aceleracion', ['t']), ['{"ta":5,"vt":10}']);
  assert.deepEqual(casos('graficas-xt-at', ['t']), ['{"a":2}']);
  assert.deepEqual(casos('caida-reposo', ['t']), ['{"tc":0.2}']);
  assert.deepEqual(casos('caida-libre', ['t']), ['{"v0":10}']);
  for (const i of def.ideas) assert.ok(!i.juega.mision.logrado(Teoria.inicio(i.juega)), `${i.id}: cumplida al abrir`);
  // Lo que la misión pide es lo que el motor dibuja: 25 m de frenado, 100 m a los 12,5 s, alcance a los 10 s, 20 cm y 5 m.
  assert.equal(10 * 10 / (2 * 2), 25);
  assert.equal(10 * 5 / 2 + 10 * (12.5 - 5), 100);
  assert.equal(2 * 10 * 10 / 2, 10 * 10);
  assert.ok(Math.abs(100 * 10 * 0.2 * 0.2 / 2 - 20) < 1e-9);
  assert.equal(10 * 10 / (2 * 10), 5);
  const pista = idea('pendiente-aceleracion').juega.dibujo({ ta: 5, vt: 10, t: 14 }).datos;
  assert.ok(Math.abs(pista.x - 100) < 1e-9, 'el atleta llega a la meta');
  assert.ok(Math.abs(idea('caida-reposo').juega.dibujo({ tc: 0.2, t: 0.3 }).datos.cae - 20) < 1e-9, 'la regla cayó 20 cm');
});

test('nada de lo que se ve antes de predecir adelanta la respuesta (B2 a B6)', () => {
  const antes = i => plano([i.lee.tarjetas.map(t => [t.titulo, t.texto, t.ecuacion || '']), i.juega.consigna, i.juega.voz, i.juega.mision.texto, i.juega.mision.bien, i.juega.leyenda.map(x => [x.s, x.t])]);
  const lect = i => Teoria.grilla(i.juega.controles).filter((_, k) => k % 5 === 0).map(v => plano(i.juega.lectura(v))).join(' | ');
  const B2 = idea('ecuaciones-mruv'), B3 = idea('pendiente-aceleracion'), B4 = idea('graficas-xt-at'), B5 = idea('caida-reposo'), B6 = idea('caida-libre');
  assert.ok(!/100 m|cuatro|doble|20 m\/s/.test(antes(B2)), 'B2');
  for (const v of Teoria.grilla(B2.juega.controles)) assert.equal(B2.juega.dibujo(v).datos.v, 10, 'en el juego de B2 la combi llega siempre a 10 m/s');
  assert.ok(!/rest|negativ|bajo el eje|retroced|hacia atrás|−/.test(antes(B3)), 'B3');
  for (const v of Teoria.grilla(B3.juega.controles).filter((_, k) => k % 7 === 0)) for (const c of B3.juega.dibujo(v).datos.grafica.curvas) for (const p of c.puntos) if (p) assert.ok(p[1] >= 0, 'en el juego de B3 v nunca es negativa');
  assert.ok(!/\b5 s\b|misma velocidad|igual de rápid|igual velocidad/.test(antes(B4)), 'B4');
  assert.ok(!/m\/s/.test(lect(B4)), 'la lectura de B4 solo da posiciones');
  assert.ok(!/pese|masa|pesad|a la vez|juntas|misma g/.test(antes(B5)), 'B5');
  assert.ok(!/g =|10 m\/s²|aceleraci/.test(antes(B6)), 'B6');
  for (const v of Teoria.grilla(B6.juega.controles)) assert.ok(!B6.juega.dibujo(v).datos.g, 'el juego de B6 no dibuja la flecha de g');
  assert.ok(!B6.predice.dibujo.datos.g && B6.predice.revelar.datos.g, 'la flecha de g aparece al revelar');
  // Las figuras de Predice no muestran la respuesta.
  assert.ok(!/100/.test(textosSVG(Kit.piezas['fis-combi'].dibujar(B2.predice.dibujo.datos)).filter(t => !/^\d+$/.test(t)).join(' ')));
  assert.ok(!B3.predice.dibujo.datos.areas.some(a => a.rotulo), 'B3: las áreas sin número');
  assert.ok(!(B4.predice.dibujo.datos.tangentes || []).length && B4.predice.revelar.datos.tangentes.length, 'B4: la inclinación igual aparece al revelar');
  assert.ok(B5.predice.dibujo.datos.pelotas.every(p => p.y === 5), 'B5: las dos todavía en la ventana');
});

test('las predicciones de B2 a B6 cuadran aparte', () => {
  const bien = i => plano(idea(i).predice.opciones.find(o => o.correcta).texto);
  const a = 10 * 10 / (2 * 25);   // el freno del juego: 25 m a 10 m/s
  assert.equal(bien('ecuaciones-mruv'), `${fmt(20 * 20 / (2 * a))} m`);
  assert.equal(bien('pendiente-aceleracion'), `${fmt(4 * 3 - 1.5 * 4)} m`);
  assert.equal(bien('graficas-xt-at'), `A los ${fmt(10 / 2)} s`);
  assert.equal(2 * 10 / 2, 10, 'el alcance del juego, a los 10 s');
  assert.equal(bien('caida-reposo'), 'Llegan a la vez');
  assert.equal(bien('caida-libre'), '10 m/s², hacia abajo');
  for (const id of IDEAS_REHECHAS) assert.equal(new Set(idea(id).predice.opciones.map(o => o.error).filter(Boolean)).size, idea(id).predice.opciones.length - 1, `${id}: un código por opción`);
});

// Reconoce la pregunta con un patrón y calcula aparte la respuesta: [patrón, (m) => texto esperado, etiqueta].
const n2 = s => num(s);
const raiz = x => Math.sqrt(x);
const ORD = { primer: 1, segundo: 2, tercer: 3, cuarto: 4, quinto: 5, sexto: 6, séptimo: 7 };
const FORMAS = {
  acelera: { xt: 'Una curva que se empina cada vez más', vt: 'Una recta inclinada que sube', at: 'Una horizontal sobre el eje t' },
  frena: { xt: 'Una curva que se va aplanando', vt: 'Una recta inclinada que baja', at: 'Una horizontal bajo el eje t' },
  pareja: { xt: 'Una recta inclinada que sube', vt: 'Una horizontal sobre el eje t', at: 'Una horizontal sobre el mismo eje t, en 0' },
};
const MOV = t => (/acelera parejo$/.test(t) ? 'acelera' : /frena parejo/.test(t) ? 'frena' : 'pareja');
const AHORA = {
  'ecuaciones-mruv': [
    [new RegExp(`^Una combi va a ${N} m/s y frena con a = ${N} m/s² hasta parar\\. ¿Cuántos metros recorre hasta detenerse\\?$`), m => `${fmt(n2(m[1]) ** 2 / (-2 * n2(m[2])))} m`, 'frenado'],
    [new RegExp(`^Una combi pasa por el grifo a ${N} m/s y (?:acelera|frena) parejo: (\\d+) s después va a ${N} m/s\\. ¿Cuánto avanzó en ese tiempo\\?$`), m => `${fmt((n2(m[1]) + n2(m[3])) / 2 * n2(m[2]))} m`, 'media'],
    [new RegExp(`^El grifo está a ${N} m del paradero\\. Una combi pasa por el grifo a ${N} m/s y acelera con a = ${N} m/s²\\. ¿A qué distancia del paradero está (\\d+) s después\\?$`), m => `${fmt(n2(m[1]) + n2(m[2]) * n2(m[4]) + n2(m[3]) * n2(m[4]) ** 2 / 2)} m`, 'horaria'],
    [new RegExp(`^Una combi va a (\\d+) km/h y frena con a = ${N} m/s² hasta detenerse\\. ¿Cuál es su distancia de frenado\\?$`), m => `${fmt((n2(m[1]) / 3.6) ** 2 / (-2 * n2(m[2])))} m`, 'km/h'],
    [new RegExp(`^Una combi a (\\d+) km/h necesita ${N} m para frenar hasta parar\\. Con el mismo freno, ¿cuánto necesita a (\\d+) km/h\\?$`), m => `${fmt(n2(m[2]) * (n2(m[3]) / n2(m[1])) ** 2)} m`, 'proporción'],
    [/^La posición de una combi es x = (\d+) \+ (\d+)t − (\d*)t al cuadrado \(en m y s\)\. ¿Qué velocidad tiene a los (\d+) s\?$/, m => `${fmt(n2(m[2]) - 2 * (m[3] ? n2(m[3]) : 1) * n2(m[4]))} m/s`, 'velocidad en x(t)'],
    [/^La posición de una combi es x = (\d+) \+ (\d+)t − (\d*)t al cuadrado \(en m y s\)\. ¿Cuál es su desplazamiento entre t = (\d+) s y t = (\d+) s\?$/, m => {
      const x = t => n2(m[1]) + n2(m[2]) * t - (m[3] ? n2(m[3]) : 1) * t * t; return `${fmt(x(n2(m[5])) - x(n2(m[4])))} m`; }, 'desplazamiento en x(t)'],
  ],
  'pendiente-aceleracion': [
    [new RegExp(`^En la gráfica v–t, la velocidad de una combi pasa en línea recta de ${N} m/s a ${N} m/s en (\\d+) s\\. ¿Cuánto avanzó\\?$`), m => `${fmt((n2(m[1]) + n2(m[2])) / 2 * n2(m[3]))} m`, 'trapecio'],
    [new RegExp(`^La gráfica v–t de una combi es una recta de ${N} m/s a ${N} m/s en (\\d+) s\\. ¿Cuál es su aceleración\\?$`), m => `${fmt((n2(m[2]) - n2(m[1])) / n2(m[3]))} m/s²`, 'pendiente'],
    [new RegExp(`^Un mototaxi va a ${N} m/s durante (\\d+) s y retrocede a ${N} m/s durante (\\d+) s\\. (¿Qué distancia recorrió en total\\?|¿Cuál es su desplazamiento\\?)$`), m => {
      const A1 = n2(m[1]) * n2(m[2]), A2 = n2(m[3]) * n2(m[4]); return `${fmt(/distancia/.test(m[5]) ? A1 + A2 : A1 - A2)} m`; }, 'signo'],
    [new RegExp(`^Un tren sale del reposo y acelera con ${N} m/s²; después frena con ${N} m/s² y para en la estación siguiente, a ${N} m\\. ¿Cuál es el menor tiempo del viaje\\?$`), m => `${fmt(2 * raiz(n2(m[3]) / n2(m[1])))} s`, 'tiempo mínimo'],
    [new RegExp(`^La gráfica v–t de una combi es una recta que pasa por \\((\\d+) s; ${N} m/s\\) y \\((\\d+) s; ${N} m/s\\)\\. ¿Cuánto valía su velocidad en t = 0\\?$`), m => {
      const a = (n2(m[4]) - n2(m[2])) / (n2(m[3]) - n2(m[1])); return `${fmt(n2(m[2]) - a * n2(m[1]))} m/s`; }, 'v₀'],
    [new RegExp(`^Una ciclista va a ${N} m/s y frena parejo hasta detenerse\\. En su gráfica v–t, el área bajo la recta es ${N} m\\. ¿Cuál es su aceleración\\?$`), m => `${fmt(-(n2(m[1]) ** 2) / (2 * n2(m[2])))} m/s²`, 'a desde el área'],
  ],
  'graficas-xt-at': [
    [new RegExp(`^Una combi va a ${N} m/s y su gráfica a–t es una horizontal en ${N} m/s² durante (\\d+) s\\. ¿Qué velocidad tiene al final\\?$`), m => `${fmt(n2(m[1]) + n2(m[2]) * n2(m[3]))} m/s`, 'área a–t'],
    [/^Una combi (.+)\. ¿Cómo es su gráfica (x–t|v–t|a–t)\?$/, m => FORMAS[MOV(m[1])][m[2].replace('–', '')], 'forma'],
    [new RegExp(`^Un mototaxi pasa por el paradero a ${N} m/s justo cuando una combi arranca de ahí con ${N} m/s²\\. ¿Cuándo tienen la misma velocidad\\?$`), m => `${fmt(n2(m[1]) / n2(m[2]))} s`, 'misma v'],
    [new RegExp(`^Una combi parte del reposo\\. Su gráfica a–t vale ${N} m/s² durante (\\d+) s, 0 durante (\\d+) s y ${N} m/s² durante (\\d+) s\\. ¿Qué distancia recorre\\?$`), m => {
      // se integra paso a paso, sin las fórmulas de la unidad
      let v = 0, x = 0; const dt = 1e-4;
      for (const [a, T] of [[n2(m[1]), n2(m[2])], [0, n2(m[3])], [n2(m[4]), n2(m[5])]]) for (let k = 0; k < Math.round(T / dt); k++) { const v2 = v + a * dt; x += (v + v2) / 2 * dt; v = v2; }
      return `${fmt(x)} m`; }, 'a–t por tramos'],
    [new RegExp(`^Un mototaxi pasa por el grifo a ${N} m/s\\. En ese instante, una combi arranca del paradero, ${N} m detrás, con ${N} m/s²\\. ¿Qué distancia recorre el mototaxi hasta que lo alcanzan\\?$`), m => {
      const vm = n2(m[1]), D = n2(m[2]), a = n2(m[3]), t = (vm + raiz(vm * vm + 2 * a * D)) / a; return `${fmt(vm * t)} m`; }, 'alcance desde atrás'],
  ],
  'caida-reposo': [
    [new RegExp(`^Sueltas una piedra desde un puente y llega al río en ${N} s\\. ¿Desde qué altura cayó\\?$`), m => `${fmt(5 * n2(m[1]) ** 2)} m`, 'altura'],
    [new RegExp(`^Sueltas una pelota desde ${N} m de altura\\. ¿Cuánto tarda en llegar al suelo\\?$`), m => `${fmt(raiz(n2(m[1]) / 5))} s`, 'tiempo'],
    [new RegExp(`^Una maceta cae desde una azotea a ${N} m de la vereda\\. ¿Con qué rapidez llega a la vereda\\?$`), m => `${fmt(raiz(20 * n2(m[1])))} m/s`, 'rapidez'],
    [new RegExp(`^Se sueltan a la vez una esfera de (\\d+) kg desde ${N} m y otra de (\\d+) kg desde ${N} m\\. ¿Cuántos segundos después de la primera llega la segunda\\?$`), m => `${fmt(raiz(n2(m[4]) / 5) - raiz(n2(m[2]) / 5))} s`, 'dos esferas'],
    [new RegExp(`^Sueltas una piedra en un pozo seco de ${N} m\\. ¿Cuánto después de soltarla oyes el golpe en el fondo\\?$`), m => `${fmt(raiz(n2(m[1]) / 5) + n2(m[1]) / 340)} s`, 'pozo'],
    [/^Se suelta una piedra desde un acantilado alto\. ¿Cuánto cae durante el (\S+) segundo, entre t = (\d+) s y t = (\d+) s\?$/, m => {
      const k = ORD[m[1]]; assert.equal(k, n2(m[3])); assert.equal(k - 1, n2(m[2])); return `${fmt(5 * k * k - 5 * (k - 1) ** 2)} m`; }, 'n-ésimo segundo'],
  ],
  'caida-libre': [
    [new RegExp(`^Se lanza una pelota hacia arriba con v0 = ${N} m/s\\. ¿Cuánto tarda en llegar a la cima\\?$`), m => `${fmt(n2(m[1]) / 10)} s`, 'subida'],
    [new RegExp(`^Se lanza una pelota hacia arriba con v0 = ${N} m/s\\. ¿Qué altura máxima alcanza\\?$`), m => `${fmt(n2(m[1]) ** 2 / 20)} m`, 'altura máxima'],
    [new RegExp(`^Se lanza una pelota hacia arriba con v0 = ${N} m/s\\. Con el eje hacia arriba, ¿qué velocidad tiene en t = ${N} s\\?$`), m => `${fmt(n2(m[1]) - 10 * n2(m[2]))} m/s`, 'velocidad'],
    [new RegExp(`^Desde una azotea a ${N} m del patio, lanzas una pelota hacia arriba con ${N} m/s\\. ¿Cuánto tarda en llegar al patio\\?$`), m => {
      const h = n2(m[1]), v0 = n2(m[2]); return `${fmt((v0 + raiz(v0 * v0 + 20 * h)) / 10)} s`; }, 'azotea'],
    [new RegExp(`^Desde lo alto de un edificio de ${N} m sueltas una piedra y, a la vez, desde el suelo lanzan una pelota hacia arriba con ${N} m/s, en la misma vertical\\. ¿Cuándo se encuentran\\?$`), m => {
      const H = n2(m[1]), v0 = n2(m[2]), t = H / v0; assert.ok(t < raiz(H / 5) && t < v0 / 5, 'se encuentran en el aire'); return `${fmt(t)} s`; }, 'encuentro'],
    [new RegExp(`^Lanzas una pelota hacia arriba con ${N} m/s y la atrapas a la misma altura\\. ¿Cuánto tiempo estuvo en el aire\\?$`), m => `${fmt(n2(m[1]) / 5)} s`, 'vuelo'],
  ],
};
test('«Ahora tú» de B2 a B6: opciones distintas, una correcta, datos, y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  for (const [id, pats] of Object.entries(AHORA)) {
    const i = idea(id), vistos = new Set(), casos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), bien = plano(a.opciones.find(o => o.correcta).texto);
      assert.ok(a.opciones.length >= 3 && a.opciones.length <= 4, `${id} ${s}: ${a.opciones.length} opciones`);
      assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, a.opciones.length, `${id} ${s}: opciones repetidas`);
      assert.equal(a.opciones.filter(o => o.correcta).length, 1);
      assert.ok(a.datos && a.datos.length >= 2, `${id} ${s}: sin datos`);
      for (const o of a.opciones.filter(y => !y.correcta)) assert.ok(o.error && o.siFuera, `${id} ${s}: ${o.id}`);
      casos.add(q);
      const p = pats.find(([re]) => re.test(q));
      assert.ok(p, `${id} ${s}: no reconozco «${q}»`);
      assert.equal(bien, p[1](q.match(p[0])), `${id} ${s}: ${q}`);
      vistos.add(p[2]);
      if (/km\/h/.test(q)) assert.ok(a.datos.some(d => /km/.test(plano(d))), `${id} ${s}: la equivalencia de km/h`);
      if (/pozo/.test(q)) assert.ok(a.datos.some(d => /340/.test(plano(d))), `${id} ${s}: la rapidez del sonido`);
    }
    assert.deepEqual([...vistos].sort(), pats.map(x => x[2]).sort(), `${id}: todas las variantes, hasta la de examen`);
    assert.ok(casos.size >= 30, `${id}: ${casos.size} preguntas distintas`);
  }
});

const RESUELVE = {
  'ecuaciones-mruv': [
    [new RegExp(`^Frente al colegio, una combi va a ${N} m/s y frena parejo hasta detenerse ${N} m más adelante\\. ¿Cuál es su aceleración\\?$`), m => `a = ${fmt(-(n2(m[1]) ** 2) / (2 * n2(m[2])))} m/s²`],
    [new RegExp(`^Frente al colegio, una combi va a ${N} m/s y frena parejo hasta detenerse ${N} m más adelante\\. ¿Cuánto tarda en detenerse\\?$`), m => `Tarda ${fmt(2 * n2(m[2]) / n2(m[1]))} s`],
  ],
  'pendiente-aceleracion': [
    [new RegExp(`^Un atleta acelera parejo desde el reposo hasta ${N} m/s en (\\d+) s y sigue a esa rapidez (\\d+) s más\\. ¿Cuánto avanza en total\\?$`), m => `Avanza ${fmt(n2(m[1]) * n2(m[2]) / 2 + n2(m[1]) * n2(m[3]))} m`],
    [new RegExp(`^La gráfica v–t de una ciclista que frena es una recta de ${N} m/s a 0 en (\\d+) s\\. ¿Qué distancia recorre mientras frena\\?$`), m => `Recorre ${fmt(n2(m[1]) * n2(m[2]) / 2)} m`],
  ],
  'graficas-xt-at': [
    [new RegExp(`^Un mototaxi pasa por el paradero a ${N} m/s justo cuando una combi arranca de ahí con a = ${N} m/s²\\. ¿Cuándo y dónde la combi lo alcanza\\?$`), m => {
      const t = 2 * n2(m[1]) / n2(m[2]); return `A los ${fmt(t)} s, en ${fmt(n2(m[1]) * t)} m`; }],
    [new RegExp(`^Una combi va a ${N} m/s\\. Su gráfica a–t vale ${N} m/s² durante (\\d+) s y luego ${N} m/s² durante (\\d+) s\\. ¿Qué velocidad tiene al final\\?$`), m => `v = ${fmt(n2(m[1]) + n2(m[2]) * n2(m[3]) + n2(m[4]) * n2(m[5]))} m/s`],
  ],
  'caida-reposo': [
    [new RegExp(`^Una piedra soltada desde un puente llega al río a ${N} m/s\\. ¿Desde qué altura cayó\\?$`), m => `h = ${fmt(n2(m[1]) ** 2 / 20)} m`],
    [new RegExp(`^Atrapas una regla que suelta tu compañero cuando ya cayó ${N} cm\\. ¿Cuál es tu tiempo de reacción\\?$`), m => `Unos ${fmt(raiz(2 * n2(m[1]) / 100 / 10))} s`],
  ],
  'caida-libre': [
    [new RegExp(`^Pateas una pelota hacia arriba con ${N} m/s\\. ¿Qué rapidez tiene cuando pasa por ${N} m al subir\\?$`), m => `v = ${fmt(raiz(n2(m[1]) ** 2 - 20 * n2(m[2])))} m/s`],
    [new RegExp(`^Pateas una pelota hacia arriba con ${N} m/s\\. ¿A qué altura está a los ${N} s\\?$`), m => `y = ${fmt(n2(m[1]) * n2(m[2]) - 5 * n2(m[2]) ** 2)} m`],
  ],
};
test('«Así se resuelve» de B2 a B6: cuadra aparte y no repite ninguna pregunta de «Ahora tú»', () => {
  for (const [id, pats] of Object.entries(RESUELVE)) {
    const i = idea(id), vistos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const r = i.resuelve.generar(s), q = plano(r.enunciado);
      const k = pats.findIndex(([re]) => re.test(q));
      assert.ok(k >= 0, `${id} resuelve ${s}: no reconozco «${q}»`);
      assert.equal(plano(r.respuesta), pats[k][1](q.match(pats[k][0])), `${id} resuelve ${s}: ${q}`);
      vistos.add(k);
      assert.ok(!AHORA[id].some(([re]) => re.test(q)), `${id} resuelve ${s}: es una pregunta de «Ahora tú»`);
      assert.ok(r.datos && r.datos.length >= 2, `${id} resuelve ${s}: sin datos`);
    }
    assert.equal(vistos.size, pats.length, `${id}: las dos variantes`);
  }
});

// Las respuestas de los 75 ejemplos de B2 a B6, rehechas aparte. Para los de examen, también qué letra es la buena.
test('ejemplos de B2 a B6: las cuentas, rehechas aparte, y la letra de cada alternativa', () => {
  const R = (id, k) => plano(idea(id).ejemplos[k].respuesta);
  const letra = (id, k, alt) => { const e = idea(id).ejemplos[k], L = 'ABCDE'[e.alternativas.indexOf(alt)]; assert.ok(L, `${id} ${k + 1}: «${alt}» no es alternativa`); assert.match(R(id, k), new RegExp(`^${L}(,|$)`), `${id} ejemplo ${k + 1}`); };
  const q = (id, k, re) => assert.match(R(id, k), re, `${id} ejemplo ${k + 1}`);
  // B2: las ecuaciones del MRUV.
  let id = 'ecuaciones-mruv';
  q(id, 0, new RegExp(`Δx = ${fmt((6 + 14) / 2 * 5)} m`));
  q(id, 1, new RegExp(`${fmt(12 ** 2 / (2 * 3))} m`));
  q(id, 2, new RegExp(`x = ${fmt(2 * 6 ** 2 / 2)} m`));
  q(id, 3, new RegExp(`v = ${fmt(raiz(5 ** 2 + 2 * 2 * 36))} m/s`));
  q(id, 4, new RegExp(`${fmt(2 * 45 / 15)} s`));
  q(id, 5, new RegExp(`${fmt((54 / 3.6) ** 2 / (2 * 2.5))} m`));
  q(id, 6, new RegExp(`a = ${fmt(-(20 ** 2) / (2 * 50))} m/s²; tarda ${fmt(20 / (20 ** 2 / (2 * 50)))} s`));
  q(id, 7, new RegExp(`x = ${fmt(10 + 8 * 3 + 9)} m y v = ${fmt(8 + 2 * 3)} m/s`));
  q(id, 8, new RegExp(`${fmt(25 - 4)} m`));
  { const t = (-4 + raiz(16 + 240)) / 2; q(id, 9, new RegExp(`${fmt(t)} s`)); }
  letra(id, 10, `${fmt(8 * 2 ** 2)} m`); letra(id, 11, `${fmt(20 ** 2 / 10)} m`);
  letra(id, 12, `${fmt(6 - 2 * 2)} m/s`);
  { const x = t => 4 + 6 * t - t * t; letra(id, 13, `${fmt(x(4) - x(1))} m`); assert.ok(idea(id).ejemplos[13].alternativas.includes(`${fmt(x(3) - x(1) + x(3) - x(4))} m`), 'la distancia recorrida es un distractor'); }
  letra(id, 14, `${fmt(25 - 16)} m`);
  assert.ok(idea(id).ejemplos[11].alternativas.includes(`${fmt(72 ** 2 / 10).replace(/ /g, ' ')} m`) || idea(id).ejemplos[11].alternativas.includes('518,4 m'), 'U1: en km/h');
  // B3: la gráfica v–t.
  id = 'pendiente-aceleracion';
  q(id, 0, new RegExp(`a = ${fmt((14 - 2) / 4)} m/s²`)); q(id, 1, new RegExp(`${fmt(5 * 8)} m`)); q(id, 2, new RegExp(`${fmt(4 * 8 / 2)} m`));
  q(id, 3, new RegExp(`a = ${fmt(-12 / 6)} m/s²`)); q(id, 4, new RegExp(`Δx = ${fmt(-2 * 5)} m`));
  q(id, 5, new RegExp(`a = ${fmt(6 / 6)} m/s² y Δx = ${fmt(7 * 6)} m`)); q(id, 6, new RegExp(`${fmt(9 * 3 / 2 + 9 * 5)} m`));
  q(id, 7, new RegExp(`Δx = ${fmt(24 - 6)} m; recorrió ${fmt(24 + 6)} m`)); q(id, 8, new RegExp(`${fmt((12 * 4 / 2 + 12 * 2) / 6)} m/s`));
  q(id, 9, new RegExp(`Δx = ${fmt(8 * 4 / 2 - 4 * 2 / 2)} m`));
  letra(id, 10, `${fmt(2 * raiz(400 / 1))} s`); letra(id, 11, `${fmt(10 - 2 * 2)} m/s y ${fmt((6 + 18) / 2 * 6)} m`);
  letra(id, 12, `${fmt(-12 / (2 * 36 / 12))} m/s²`); letra(id, 13, `${fmt(6 * 3 / 2 - 4 * 2 / 2)} m y ${fmt(6 * 3 / 2 + 4 * 2 / 2)} m`);
  letra(id, 14, `${fmt(2 * (12 - 100 / 10))} s`);
  // B4: gráficas x–t y a–t.
  id = 'graficas-xt-at';
  q(id, 0, new RegExp(`Δv = ${fmt(3 * 4)} m/s`)); q(id, 1, /^a = 0/); q(id, 2, new RegExp(`${fmt(-12 / 4)} m/s²`)); q(id, 3, new RegExp(`${fmt(12 / 3)} s`));
  q(id, 4, new RegExp(`v = ${fmt(4 + 2 * 5)} m/s`)); q(id, 5, new RegExp(`v = ${fmt(2 * 3 + 0 * 4)} m/s`));
  q(id, 6, new RegExp(`A los ${fmt(2 * 6 / 1.5)} s, en ${fmt(6 * 2 * 6 / 1.5)} m`)); q(id, 7, new RegExp(`a = ${fmt(2 * 24 / 16)} m/s²`));
  q(id, 8, new RegExp(`v = ${fmt(10 - 2 * 3)} m/s`)); q(id, 9, new RegExp(`${fmt(8 * 6 - 6 * 6)} m`));
  letra(id, 10, `${fmt(8 * 2 / 2 + 8 * 3 + 8 * 4 / 2)} m`);
  { const t = (8 + raiz(64 + 80)) / 2; letra(id, 11, `${fmt(8 * t)} m`); assert.ok(idea(id).ejemplos[11].alternativas.includes(`${fmt(t * t)} m`), 'la distancia de la combi es un distractor'); }
  letra(id, 12, `${fmt(12 * 6 - 6 * 6)} m`);
  letra(id, 13, 'x–t se aplana; v–t baja; a–t horizontal bajo el eje');
  letra(id, 14, `${fmt(2 * 2)} m/s², horizontal`);
  // B5: caída libre desde el reposo.
  id = 'caida-reposo';
  q(id, 0, new RegExp(`h = ${fmt(5 * 9)} m`)); q(id, 1, new RegExp(`${fmt(10 * 1)} m/s`)); q(id, 2, new RegExp(`${fmt(raiz(3.2 / 5))} s`));
  q(id, 3, new RegExp(`${fmt(5 * 0.01 * 100)} cm`)); q(id, 4, new RegExp(`${fmt(raiz(1.8 / 5))} s`)); q(id, 5, new RegExp(`${fmt(raiz(0.2 / 5))} s`));
  q(id, 6, new RegExp(`${fmt(raiz(20 * 20))} m/s`)); q(id, 7, new RegExp(`${fmt(raiz(20 * 45) * 3.6)} km/h`)); q(id, 8, new RegExp(`${fmt(45 - 20)} m`));
  q(id, 9, new RegExp(`${fmt(raiz(2 * 20 / 5))} s`));
  letra(id, 10, `${fmt(raiz(45 / 5) - raiz(20 / 5))} s`); letra(id, 11, `${fmt(raiz(45 / 5) + 45 / 340)} s`);
  letra(id, 12, `${fmt(raiz(20 * 40))} m/s`);
  { let n = 1; while (5 * (2 * n - 1) !== 25) n++; letra(id, 13, `${fmt(5 * n * n)} m`); }
  letra(id, 14, `${fmt(5 * 2 * 2)} m`);
  // B6: lanzamiento vertical.
  id = 'caida-libre';
  q(id, 0, new RegExp(`${fmt(15 / 10)} s`)); q(id, 1, new RegExp(`H = ${fmt(144 / 20)} m`)); q(id, 2, new RegExp(`v = ${fmt(20 - 30)} m/s`));
  q(id, 3, new RegExp(`${fmt(2 * 8 / 10)} s`)); q(id, 4, /a = −10 m\/s²/); q(id, 5, new RegExp(`${fmt(raiz(20 * 20))} m/s; sube en ${fmt(2)} s`));
  q(id, 6, new RegExp(`${fmt(20 * 3 - 5 * 9)} m, bajando`)); q(id, 7, new RegExp(`v = −${fmt(raiz(400 - 300))} m/s`));
  q(id, 8, new RegExp(`A los ${fmt(15 / 5)} s, con −${fmt(15)} m/s`)); q(id, 9, new RegExp(`H = ${fmt((72 / 3.6) ** 2 / 20)} m`));
  letra(id, 10, `${fmt((10 + raiz(100 + 300)) / 10)} s`);
  letra(id, 11, `${fmt(40 / 20)} s, a ${fmt(40 - 5 * 4)} m`);
  letra(id, 12, 'v = 0 y a = 10 m/s², hacia abajo');
  letra(id, 13, `${fmt(10 * 4 / 2)} m/s y ${fmt((10 * 4 / 2) ** 2 / 20)} m`);
  { const d = raiz(25 * 25 - 4 * 5 * 30), t1 = (25 - d) / 10, t2 = (25 + d) / 10; letra(id, 14, `${fmt(t1)} s y ${fmt(t2)} s`); }
});

test('los ids que guardan avance siguen en su lugar: las dos ideas, las tres mesas y los controles de las mesas', () => {
  for (const id of ['pendiente-aceleracion', 'caida-libre']) assert.ok(idea(id), id);
  const m = id => def.laboratorio.find(x => x.id === id);
  assert.deepEqual(m('recta-vt').controles.map(c => c.id), ['v0', 'a', 't']);
  assert.deepEqual(m('ida-vuelta').controles.map(c => c.id), ['v2', 't2', 't']);
  assert.deepEqual(m('pista-libre').controles.map(c => c.id), ['v0', 'a', 't']);
  assert.deepEqual(idea('caida-libre').juega.controles.map(c => c.id), ['v0', 't'], 'caida-libre conserva v0 y t');
});
