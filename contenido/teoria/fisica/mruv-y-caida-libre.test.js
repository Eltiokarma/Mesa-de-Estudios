// Pruebas propias de «MRUV y caída libre» (además del validador común de contenido/teoria/teoria.test.js). La idea B1
// (`aceleracion`) es la única rehecha contra el contrato (fase 2 del método, 18 nov); cada idea que se rehaga se suma a
// IDEAS_REHECHAS.
//   - las seis ideas de la propuesta (B1–B6), en orden, y los ids que guardan avance (`pendiente-aceleracion`,
//     `caida-libre`, las mesas `pista-libre`, `ida-vuelta` y `recta-vt` y las palabras de la partición) siguen aquí;
//   - un color fijo por magnitud (cabecera del archivo): v naranja, t turquesa, x violeta, a carmín; sin verde;
//   - sin magnitudes vectoriales: en una recta, v y a son números con signo (ningún «⃗» en la idea);
//   - la idea cumple el contrato de calidad 2 aunque la unidad entera todavía no;
//   - la misión se cumple de cinco maneras y nada de lo que se ve antes de predecir (Lee, el juego, la leyenda, la figura
//     de Predice) muestra una combi que frena ni el signo de su aceleración;
//   - ninguna figura de un ejemplo delata la respuesta, y los rótulos y las flechas caben y no se pisan;
//   - «Ahora tú» y «Así se resuelve» cuadran con un cálculo aparte (400 semillas) y no hacen la misma pregunta.
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
const IDEAS_REHECHAS = ['aceleracion'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
// Sin huecos: una opción correcta no trae siFuera, un ejemplo de nivel 1 no trae alternativas.
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/⁠/g, '');
const P = Kit.piezas['fis-combi'];

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
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', aceleración: 'h' });
  assert.deepEqual(def.colores, require('./movimiento-rectilineo.js').colores, 'las dos unidades del movimiento rectilíneo usan los mismos');
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

test('sin magnitudes vectoriales: la unidad lo declara con su motivo y la idea no escribe ninguna flecha «⃗»', () => {
  assert.equal(def.notacion.vectores, false);
  assert.ok(def.notacion.motivo.length > 30 && /signo/.test(def.notacion.motivo));
  for (const { donde, x } of lecturas(idea('aceleracion'))) {
    assert.ok(!/⃗/.test(plano(x)), `${donde}: «⃗» en una recta`);
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${donde}: { vec } en una recta`);
  }
});

test('la idea B1 cumple el contrato de calidad 2 (validador común con calidad: 2, sola)', () => {
  const i = idea('aceleracion'), glos = Glosario.porIdea(def)[0];
  assert.deepEqual(glos.map(g => g.termino).sort(), ['MRUV', 'aceleración', 'frenar']);
  for (const g of glos) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: glos, laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.equal(i.ejemplos.length, 15);
  assert.ok(!i.regla.dibujo, 'sin dibujo propio en la regla: la idea 1 es la de nucleo/teoria-ejemplos-regla.test.js');
  // Los ejemplos de nivel 3 son de examen: con alternativas, y la letra de la respuesta en negrita.
  for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
    assert.ok(e.alternativas && e.alternativas.length >= 4, e.titulo);
    assert.ok(e.respuesta.some(x => x && x.negrita), `${e.titulo}: la letra en negrita`);
  }
  // Las letras A–E van con { negrita } (negrita y tinta, sin violeta) donde el resuelto las nombra.
  for (const e of i.ejemplos) for (const l of e.solucion) {
    const t = plano(l.texto);
    for (const m of t.matchAll(/\b(?:La|la) ([A-E])\b/g)) assert.ok(JSON.stringify(l.texto).includes(`{"negrita":["${m[1]}"]}`), `${e.titulo}: la ${m[1]} sin negrita`);
  }
});

// Todas las figuras de B1 con la pieza que las dibuja.
function figuras(i) {
  const out = [], Pz = id => id || i.pieza;
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 3 === 0)) out.push([`juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo]);
  out.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar]);
  i.mira.pasos.forEach((p, k) => out.push([`mira ${k + 1}`, { pieza: Pz(i.mira.pieza), datos: i.mira.datos, estado: p.estado }]));
  i.ejemplos.forEach((e, k) => { if (e.figura) out.push([`ejemplo ${k + 1}`, e.figura]); });
  for (let s = 0; s < 80; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) out.push([`ahora tú ${s}`, a.dibujo]);
    if (r.dibujo) out.push([`resuelve ${s}`, r.dibujo]);
  }
  return out.map(([donde, f]) => [donde, Object.assign({ pieza: Pz(f.pieza) }, f)]);
}
const FIG = figuras(idea('aceleracion'));
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

test('ninguna figura de un ejemplo delata la respuesta', () => {
  for (const [k, e] of idea('aceleracion').ejemplos.entries()) {
    if (!e.figura) continue;
    const g = P.geometria(e.figura.datos, e.figura.estado || {});
    // Los rótulos que no son la regla de metros: lugares, flechas y marcas.
    const rot = g.rotulos.filter(r => !(g.numeros || []).includes(r) && r !== g.unidad && r !== g.mas && r !== g.menos).map(r => r.texto);
    const enFigura = new Set(rot.flatMap(numeros));
    for (const x of fichas(e.respuesta)) for (const nn of numeros(x.t)) {
      assert.ok(!enFigura.has(nn), `ejemplo ${k + 1}: la figura muestra «${nn}» (${rot.join(' | ')})`);
    }
    assert.equal(g.kMax, 0, `ejemplo ${k + 1}: marcas de segundos (eso ya sería juntar datos)`);
    // Si se pide la aceleración, la figura no dibuja su flecha: su sentido es parte de la respuesta.
    if (/aceleración/.test(plano(e.enunciado).split('¿').slice(1).join(''))) assert.ok(!g.flechaA, `ejemplo ${k + 1}: la flecha de a da el signo`);
  }
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
