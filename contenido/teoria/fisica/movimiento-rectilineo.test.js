// Pruebas propias de «Movimiento rectilíneo uniforme» y de su partición (además del validador común de
// contenido/teoria/teoria.test.js). La idea A1 (`mru`) es la única rehecha contra el contrato (fase 2 del método, 18 nov);
// cada idea que se rehaga se suma a IDEAS_REHECHAS.
//   - la partición (18 nov, Gerson; docs/etapa4/decisiones.md): esta unidad conserva el id con `mru`,
//     `desplazamiento-distancia` y `encuentro`; la aceleración, la gráfica v–t y la caída libre viven en
//     fisica.mruv-y-caida-libre, con sus mesas y sus palabras; el catálogo, la prueba del curso y el repaso lo dicen
//     igual, y Avance.migrar lo mueve todo (nada queda en la unidad vieja ni se pierde);
//   - un color fijo por magnitud (cabecera del archivo): v naranja, t turquesa, x, x₀, Δx y D violeta; sin verde;
//   - sin magnitudes vectoriales: en una recta, v y Δx son números con signo (ningún «⃗» en la idea);
//   - la idea cumple el contrato de calidad 2 aunque la unidad entera todavía no;
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta, los rótulos no se pisan, y el juego no muestra la
//     velocidad negativa que se predice;
//   - «Ahora tú» y «Así se resuelve» cuadran con un cálculo aparte (400 semillas) y no hacen la misma pregunta.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const Avance = require('../../../nucleo/avance.js');
const RepasoTipos = require('../../../nucleo/repaso-tipos.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./movimiento-rectilineo.js');
const mruv = require('./mruv-y-caida-libre.js');
for (const r of [...def.requiere, ...mruv.requiere]) require(path.join(__dirname, '..', '..', '..', r));
const RAIZ = path.join(__dirname, '..', '..', '..');
const IDEAS_REHECHAS = ['mru'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
// Sin huecos: una opción correcta no trae siFuera, un ejemplo de nivel 1 no trae alternativas.
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/\u2060/g, '');
const leer = f => JSON.parse(fs.readFileSync(path.join(RAIZ, f), 'utf8'));

// ---------- La partición ----------
test('partición: cada unidad con sus ideas, sus mesas y sus palabras, sin repetir ninguna', () => {
  assert.equal(def.unidad, 'fisica.movimiento-rectilineo', 'la unidad vieja conserva el id');
  assert.deepEqual(def.ideas.map(i => i.id), ['mru', 'desplazamiento-distancia', 'encuentro']);
  assert.deepEqual(mruv.ideas.map(i => i.id), ['pendiente-aceleracion', 'caida-libre']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['encuentro-libre']);
  assert.deepEqual(mruv.laboratorio.map(m => m.id).sort(), ['ida-vuelta', 'pista-libre', 'recta-vt']);
  const t1 = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const g of mruv.glosario) assert.ok(!t1.has(Glosario.clave(g.termino)), `«${g.termino}» en las dos unidades`);
  assert.ok(mruv.historia && !def.historia, 'la historia de Galileo se fue con la caída libre');
});

test('partición: el catálogo pone «MRUV y caída libre» después y la piden parabólico y dinámica; la prueba y el repaso, repartidos', () => {
  const c = leer('catalogo/cursos/fisica.json'), u = id => c.unidades.find(x => x.id === id);
  const viejo = u(def.unidad), nuevo = u(mruv.unidad);
  assert.equal(viejo.nombre, 'Movimiento rectilíneo uniforme');
  assert.equal(nuevo.nombre, 'MRUV y caída libre');
  assert.deepEqual(viejo.universidades.unmsm.temas, [2]);
  assert.deepEqual(nuevo.universidades.unmsm.temas, [3]);
  assert.ok(nuevo.requiere.includes(viejo.id));
  const rama = c.ramas.find(r => r.unidades.includes(viejo.id)).unidades;
  assert.equal(rama.indexOf(nuevo.id), rama.indexOf(viejo.id) + 1);
  for (const [d, x] of [[def, viejo], [mruv, nuevo]]) for (const i of d.ideas) for (const t of i.temas) assert.ok(x.temas.includes(t), `${i.id}: ${t}`);
  for (const id of ['fisica.movimiento-parabolico-y-circular', 'fisica.dinamica']) {
    assert.ok(u(id).requiere.includes(nuevo.id), id);
    assert.ok(!u(id).requiere.includes(viejo.id), `${id}: requisito de más`);
  }
  // La prueba del curso: la recta x–t es del MRU; la cima de la pelota, de la caída libre.
  const par = id => leer('catalogo/pruebas/fisica.json').pares.find(x => x.par === id);
  assert.equal(par('fis-01').unidad, viejo.id);
  assert.equal(par('fis-02').unidad, nuevo.id);
  // El repaso: medias e ida y vuelta, del MRU; gráfica v–t y ecuación horaria, del MRUV; el bote con ángulo, de Vectores.
  assert.equal(RepasoTipos.TABLA['cinematica-medias'].media, viejo.id);
  assert.equal(RepasoTipos.TABLA['cinematica-medias'].vt, nuevo.id);
  assert.equal(RepasoTipos.TABLA['velocidad-relativa'].bote, 'fisica.vectores');
  const vr = require(path.join(RAIZ, 'plantillas/velocidad-relativa/generador.js'));
  assert.ok(!vr.tiposPorUnidad[viejo.id].includes('bote'), 'el bote que cruza con ángulo no es de esta unidad');
});

test('partición: Avance.migrar pasa a la unidad nueva todo lo de sus ideas, mesas y palabras, y nada de lo que se queda', () => {
  const V = def.unidad, N = mruv.unidad;
  const ideas = Object.fromEntries([...def.ideas, ...mruv.ideas].map((i, k) => [i.id, { casos: k + 1 }]));
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, teoria: { [V]: { ideas: JSON.parse(JSON.stringify(ideas)) } },
    coleccion: [...def.laboratorio, ...mruv.laboratorio].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m.id })),
    glosario: { [V]: Object.fromEntries([...def.glosario, ...mruv.glosario].map(g => [Glosario.clave(g.termino), 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), def.ideas.map(i => i.id).sort());
  assert.deepEqual(Object.keys(est.teoria[N].ideas).sort(), mruv.ideas.map(i => i.id).sort());
  for (const c of est.coleccion) assert.equal(c.unidad, mruv.laboratorio.some(m => m.id === c.mesa) ? N : V, c.mesa);
  assert.deepEqual(Object.keys(est.glosario[V]).sort(), def.glosario.map(g => Glosario.clave(g.termino)).sort());
  assert.deepEqual(Object.keys(est.glosario[N]).sort(), mruv.glosario.map(g => Glosario.clave(g.termino)).sort());
});

// ---------- La idea A1 ----------
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

test('la tabla de colores: velocidad naranja, tiempo turquesa, posición y desplazamiento violeta, aceleración carmín; sin verde', () => {
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', aceleración: 'h' });
  assert.ok(!Object.values(def.colores).includes('d'), 'sin verde: iría junto al naranja de v');
});

test('un color por magnitud: cada ficha de las ideas rehechas dice su magnitud y lleva su color; cada letra, el suyo', () => {
  const LETRA = { v: 'c-o', t: 'c-i', x: 'c-f', D: 'c-f' };
  let n = 0;
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t in LETRA) assert.equal(f.v, LETRA[f.t], `${donde}: la letra ${f.t}`);
  }
  assert.ok(n > 2000, `${n} fichas`);
  const c = idea('mru').juega.controles, a = idea('mru').juega.arrastres;
  assert.deepEqual([c.find(x => x.id === 'x0').color, c.find(x => x.id === 'v').color, c.find(x => x.id === 't').color], ['c-f', 'c-o', 'c-i']);
  assert.deepEqual(a.map(x => x.color), ['c-f', 'c-o']);
});

test('sin magnitudes vectoriales: la unidad lo declara con su motivo y la idea no escribe ninguna flecha «⃗»', () => {
  assert.equal(def.notacion.vectores, false);
  assert.ok(def.notacion.motivo.length > 30 && /signo/.test(def.notacion.motivo));
  for (const { donde, x } of lecturas(idea('mru'))) {
    assert.ok(!/⃗/.test(plano(x)), `${donde}: «⃗» en una recta`);
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${donde}: { vec } en una recta`);
  }
});

test('la idea A1 cumple el contrato de calidad 2 (validador común con calidad: 2, sola)', () => {
  const i = idea('mru'), glos = Glosario.porIdea(def)[0];
  assert.deepEqual(glos.map(g => g.termino).sort(), ['MRU', 'posición', 'rapidez', 'velocidad']);
  for (const g of glos) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
  const sub = Object.assign({}, def, { calidad: 2, estado: 'borrador', ideas: [i], glosario: glos, laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.equal(i.ejemplos.length, 15);
  // Los ejemplos de nivel 3 son de examen: con alternativas, y la letra de la respuesta en negrita.
  for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
    assert.ok(e.alternativas && e.alternativas.length >= 4, e.titulo);
    assert.ok(e.respuesta.some(x => x && x.negrita), `${e.titulo}: la letra en negrita`);
  }
});

// Todas las figuras de A1 con la pieza que las dibuja.
function figuras(i) {
  const out = [], P = id => id || i.pieza;
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 3 === 0)) out.push([`juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo]);
  out.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar], ['regla', i.regla.dibujo]);
  i.mira.pasos.forEach((p, k) => out.push([`mira ${k + 1}`, { pieza: P(i.mira.pieza), datos: i.mira.datos, estado: p.estado }]));
  i.ejemplos.forEach((e, k) => { if (e.figura) out.push([`ejemplo ${k + 1}`, e.figura]); });
  for (let s = 0; s < 80; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) out.push([`ahora tú ${s}`, a.dibujo]);
    if (r.dibujo) out.push([`resuelve ${s}`, r.dibujo]);
  }
  return out.map(([donde, f]) => [donde, Object.assign({ pieza: P(f.pieza) }, f)]);
}
const FIG = figuras(idea('mru'));
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('las figuras de A1: la combi en la avenida (o el sonido), sin verde ni carmín, y rótulos que caben y no se pisan', () => {
  for (const [donde, f] of FIG) {
    const P = Kit.piezas[f.pieza];
    assert.ok(['fis-combi', 'fis-sonido'].includes(f.pieza), donde);
    const s = P.dibujar(f.datos, f.estado || {});
    assert.ok(!/var\(--c-[hd]\)/.test(s), `${donde}: carmín o verde`);
    assert.match(s, /data-prueba="si"/, `${donde}: dibujo de prueba`);
    const g = P.geometria(f.datos, f.estado || {}), W = P.constantes.W, H = P.constantes.H;
    if (f.pieza === 'fis-combi') assert.equal(f.datos.vista, 'avenida', donde);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) {
      assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${donde}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
    }
  }
  assert.ok(FIG.length > 200);
});

test('el juego solo va hacia la derecha (la velocidad negativa se predice) y la misión la cumplen cinco salidas', () => {
  const j = idea('mru').juega, G = Teoria.grilla(j.controles);
  for (const v of G.filter((_, k) => k % 11 === 0)) assert.ok(j.dibujo(v).datos.v > 0 && !/−/.test(plano(j.lectura(v))), JSON.stringify(v));
  const buenas = new Set(G.filter(v => j.mision.logrado(v)).map(v => `${v.x0}+5·${v.v}`));
  assert.deepEqual([...buenas].sort(), ['0+5·20', '10+5·18', '20+5·16', '30+5·14', '40+5·12']);
  assert.ok(!j.mision.logrado(Teoria.inicio(j)), 'no está cumplida al abrir');
  assert.ok(!/−|negativ|izquierda|paradero/.test(j.mision.bien), 'el «bien» no habla de lo que se predice');
  for (const t of idea('mru').lee.tarjetas) assert.ok(!/80 m|12 m\/s|20 m\b/.test(plano(t.texto)), `«Lee» no adelanta la predicción: ${t.titulo}`);
});

const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
test('ninguna figura de Predice ni de un ejemplo delata la respuesta', () => {
  const i = idea('mru'), P = Kit.piezas['fis-combi'];
  assert.ok(!textosSVG(P.dibujar(i.predice.dibujo.datos)).includes('x'), 'Predice no marca la x final');
  assert.ok(!P.geometria(i.predice.dibujo.datos).posiciones.some(p => p.texto === 'x'), 'Predice no marca dónde termina');
  assert.equal(P.geometria(i.predice.dibujo.datos).kMax, 0, 'Predice no deja las marcas de los segundos');
  for (const [k, e] of i.ejemplos.entries()) {
    const f = e.figura, Pz = Kit.piezas[f.pieza];
    const g = Pz.geometria(f.datos, f.estado || {});
    // Los rótulos que no son la regla de metros: lugares, marcas, flecha, tiempos y los del sonido.
    const rot = g.rotulos.filter(r => !(g.numeros || []).includes(r) && r !== g.unidad).map(r => r.texto).join(' | ');
    // Lo que se pide (los números de la respuesta en el color de su magnitud) no aparece en esos rótulos.
    for (const x of fichas(e.respuesta)) {
      const nn = (x.t.match(/−?\d[\d ,]*/) || [''])[0].replace(/\s/g, '');
      if (nn) assert.ok(!rot.replace(/\s/g, '').includes(nn), `ejemplo ${k + 1}: la figura muestra «${x.t}» (${rot})`);
    }
    // Una figura con la combi en t = 0: no deja marcas de segundos (eso ya sería juntar datos).
    if (f.pieza === 'fis-combi') assert.equal(g.kMax, 0, `ejemplo ${k + 1}: marcas de segundos`);
    // El ejemplo que pide la velocidad no dibuja su flecha (su sentido es parte de la respuesta).
    if (/velocidad, con su signo/.test(plano(e.enunciado))) assert.ok(!g.flecha, `ejemplo ${k + 1}: la flecha da el signo`);
    // Lo que se pide en una figura del sonido va en tinta, con «?».
    if (f.pieza === 'fis-sonido') assert.equal(f.datos.distancia, 'D = ?');
  }
});

// ---------- Cálculo aparte (sin el código de la unidad) ----------
const num = s => Number(String(s).replace(/\s/g, '').replace('−', '-').replace(',', '.'));
const fmt = n => { const r = Math.round(n * 100) / 100; return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
test('«Ahora tú»: cuatro opciones distintas, una correcta, y la posición cuadra con un cálculo aparte (400 semillas)', () => {
  const i = idea('mru'), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), bien = plano(a.opciones.find(o => o.correcta).texto);
    assert.equal(a.opciones.length, 4, `semilla ${s}`);
    assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, 4, `semilla ${s}: opciones repetidas`);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1);
    let m, x;
    if ((m = q.match(/^Una combi sale de x₀ = ([\d ,]+) m hacia la derecha a ([\d,]+) m\/s, sin cambiar de velocidad\. ¿Dónde está a los (\d+) s\?$/))) { x = num(m[1]) + num(m[2]) * num(m[3]); vistos.add('derecha'); }
    else if ((m = q.match(/^Una combi está en x₀ = ([\d ,]+) m y va hacia el paradero a ([\d,]+) m\/s, sin cambiar de velocidad\. ¿Dónde está (\d+) s después\?$/))) { x = num(m[1]) - num(m[2]) * num(m[3]); vistos.add('paradero'); }
    else if ((m = q.match(/^Una combi pasa por x₀ = ([\d ,]+) m a (\d+) km\/h hacia la derecha y no cambia de velocidad\. ¿Dónde está (\d+) s después\?$/))) { x = num(m[1]) + num(m[2]) * 1000 / 3600 * num(m[3]); vistos.add('km/h'); }
    else if ((m = q.match(/^La posición de una combi en la avenida es x = (\d+) − (\d+) ?t, con x en metros y t en segundos\. ¿Dónde está a los (\d+) s\?$/))) { x = num(m[1]) - num(m[2]) * num(m[3]); vistos.add('ecuación'); }
    else assert.fail(`semilla ${s}: no reconozco «${q}»`);
    assert.equal(bien, `En x = ${fmt(x)} m`, `semilla ${s}: ${q}`);
    for (const o of a.opciones.filter(y => !y.correcta)) assert.ok(o.error && o.siFuera, `semilla ${s}: ${o.id}`);
  }
  assert.equal(vistos.size, 4, 'las cuatro variantes, hasta la de examen');
});

test('«Así se resuelve» pide el tiempo o la velocidad (nunca la posición, que es «Ahora tú») y cuadra aparte', () => {
  const i = idea('mru');
  for (let s = 0; s < SEMILLAS; s++) {
    const r = i.resuelve.generar(s), q = plano(r.enunciado), resp = plano(r.respuesta);
    let m;
    if ((m = q.match(/^La combi sale de x₀ = ([\d ,]+) m hacia la derecha a ([\d,]+) m\/s, sin cambiar de velocidad\. El grifo está en x = ([\d ,]+) m\. ¿Cuánto tarda en llegar\?$/))) {
      assert.equal(resp, `Tarda ${fmt((num(m[3]) - num(m[1])) / num(m[2]))} s`, `resuelve ${s}`);
    } else if ((m = q.match(/^Una combi pasa por x = (−?[\d ,]+) m y, (\d+) s después, por x = (−?[\d ,]+) m, sin cambiar de velocidad\. ¿Cuál es su velocidad\?$/))) {
      assert.equal(resp, `v = ${fmt((num(m[3]) - num(m[1])) / num(m[2]))} m/s, hacia el paradero`, `resuelve ${s}`);
    } else assert.fail(`resuelve ${s}: no reconozco «${q}»`);
    assert.ok(!/¿Dónde está/.test(q), `resuelve ${s}`);
  }
});

test('ejemplos: las cuentas de las respuestas, rehechas aparte, y la letra de cada alternativa', () => {
  const ej = idea('mru').ejemplos, r = k => plano(ej[k].respuesta);
  const pos = (x0, v, t) => x0 + v * t;
  assert.match(r(0), new RegExp(`x = ${fmt(pos(0, 15, 4))} m`));
  assert.match(r(1), new RegExp(`x = ${fmt(pos(-30, 10, 6))} m`));
  assert.match(r(2), new RegExp(`x = ${fmt(pos(90, -15, 4))} m`));
  assert.match(r(3), new RegExp(`v = ${fmt((30 - 100) / 5)} m/s`));
  assert.match(r(4), new RegExp(`${fmt(84 / 12)} s`));
  assert.match(r(5), new RegExp(`x = ${fmt(pos(0, 54 * 1000 / 3600, 8))} m`));
  assert.match(r(6), new RegExp(`x = ${fmt(pos(25, (61 - 25) / 3, 10))} m`));
  assert.match(r(7), new RegExp(`A los ${fmt(120 / 15)} s; 2 s después, en x = ${fmt(pos(120, -15, 120 / 15 + 2))} m`));
  assert.match(r(8), new RegExp(`^${12 * 2 * 60} m`));
  assert.match(r(9), new RegExp(`${pos(10, 14, 2)} m y en ${pos(10, 14, 5)} m; avanzó ${pos(10, 14, 5) - pos(10, 14, 2)} m`));
  const letra = (k, alt) => { const L = 'ABCDE'[ej[k].alternativas.indexOf(alt)]; assert.ok(L, `ejemplo ${k + 1}: «${alt}» no es alternativa`); assert.match(r(k), new RegExp(`^${L}, `), `ejemplo ${k + 1}`); };
  letra(10, `${340 * 3 / 2} m`);
  letra(11, `${340 * 4} m`);
  assert.equal(72 * 1000 / 3600 * 1.5 * 60, 1800); letra(12, '1,8 km');
  letra(13, `En x = ${pos(pos(0, 12, 10), -8, 5)} m`);
  letra(14, `En x = ${fmt(40 - 8 * 7)} m, hacia la izquierda`);
  for (const e of ej.filter(x => x.alternativas)) assert.equal(new Set(e.alternativas).size, e.alternativas.length, e.titulo);
});
