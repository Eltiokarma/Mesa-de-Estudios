// Pruebas propias de «Movimiento rectilíneo uniforme» y de su partición (además del validador común de
// contenido/teoria/teoria.test.js). Las cinco ideas (A1 `mru`, A2 `grafica-xt`, A3 `desplazamiento-distancia`, A4
// `encuentro` y A5 `velocidad-relativa`) están rehechas contra el contrato (fases 2 y 3 del método, 18 nov) y la unidad
// declara calidad: 2.
//   - la partición (18 nov, Gerson; docs/etapa4/decisiones.md): esta unidad conserva el id con `mru`,
//     `desplazamiento-distancia` y `encuentro`; la aceleración, la gráfica v–t y la caída libre viven en
//     fisica.mruv-y-caida-libre, con sus mesas y sus palabras; el catálogo, la prueba del curso y el repaso lo dicen
//     igual, y Avance.migrar lo mueve todo (nada queda en la unidad vieja ni se pierde);
//   - un color fijo por magnitud (cabecera del archivo): v naranja, t turquesa, x, x₀, Δx y D violeta; sin verde;
//   - sin magnitudes vectoriales: en una recta, v y Δx son números con signo (ningún «⃗» en la idea);
//   - la unidad cumple el contrato de calidad 2 (validador común con los temas del catálogo);
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta, los rótulos no se pisan, y ningún juego muestra lo
//     que su predicción pregunta (la velocidad negativa, la recta fuera del cero, la vuelta más rápida, el alcance, el río);
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
const IDEAS_REHECHAS = ['mru', 'grafica-xt', 'desplazamiento-distancia', 'encuentro', 'velocidad-relativa'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;
// Sin huecos: una opción correcta no trae siFuera, un ejemplo de nivel 1 no trae alternativas.
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/\u2060/g, '');
const leer = f => JSON.parse(fs.readFileSync(path.join(RAIZ, f), 'utf8'));

// ---------- La partición ----------
test('partición: cada unidad con sus ideas, sus mesas y sus palabras, sin repetir ninguna', () => {
  assert.equal(def.unidad, 'fisica.movimiento-rectilineo', 'la unidad vieja conserva el id');
  assert.deepEqual(def.ideas.map(i => i.id), ['mru', 'grafica-xt', 'desplazamiento-distancia', 'encuentro', 'velocidad-relativa']);
  assert.deepEqual(mruv.ideas.map(i => i.id), ['aceleracion', 'ecuaciones-mruv', 'pendiente-aceleracion', 'graficas-xt-at', 'caida-reposo', 'caida-libre']);
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
  // Lo que la unidad vieja tenía de MRUV (18 nov): dos ideas y tres palabras; las ideas y palabras nuevas de MRUV
  // (aceleracion, ecuaciones-mruv…, «MRUV», «frenar») nunca estuvieron en la unidad vieja.
  const IDEAS_IDAS = ['pendiente-aceleracion', 'caida-libre'], PALABRAS_IDAS = ['aceleración', 'caída libre', 'gravedad'].map(Glosario.clave);
  const viejasN = mruv.ideas.filter(i => IDEAS_IDAS.includes(i.id));
  const glosN = mruv.glosario.filter(g => PALABRAS_IDAS.includes(Glosario.clave(g.termino)));
  const ideas = Object.fromEntries([...def.ideas, ...viejasN].map((i, k) => [i.id, { casos: k + 1 }]));
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, teoria: { [V]: { ideas: JSON.parse(JSON.stringify(ideas)) } },
    coleccion: [...def.laboratorio, ...mruv.laboratorio].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m.id })),
    glosario: { [V]: Object.fromEntries([...def.glosario, ...glosN].map(g => [Glosario.clave(g.termino), 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), def.ideas.map(i => i.id).sort());
  assert.deepEqual(Object.keys(est.teoria[N].ideas).sort(), [...IDEAS_IDAS].sort());
  for (const c of est.coleccion) assert.equal(c.unidad, mruv.laboratorio.some(m => m.id === c.mesa) ? N : V, c.mesa);
  assert.deepEqual(Object.keys(est.glosario[V]).sort(), def.glosario.map(g => Glosario.clave(g.termino)).sort());
  assert.deepEqual(Object.keys(est.glosario[N]).sort(), [...PALABRAS_IDAS].sort());
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

test('la tabla de colores: velocidad naranja, tiempo turquesa, posición, desplazamiento y largo violeta, aceleración carmín; sin verde', () => {
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', largo: 'f', aceleración: 'h' });
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
  assert.ok(n > 8000, `${n} fichas`);
  const c = idea('mru').juega.controles, a = idea('mru').juega.arrastres;
  assert.deepEqual([c.find(x => x.id === 'x0').color, c.find(x => x.id === 'v').color, c.find(x => x.id === 't').color], ['c-f', 'c-o', 'c-i']);
  assert.deepEqual(a.map(x => x.color), ['c-f', 'c-o']);
});

test('sin magnitudes vectoriales: la unidad lo declara con su motivo y ninguna idea escribe una flecha «⃗»', () => {
  assert.equal(def.notacion.vectores, false);
  assert.ok(def.notacion.motivo.length > 30 && /signo/.test(def.notacion.motivo));
  for (const id of IDEAS_REHECHAS) for (const { donde, x } of lecturas(idea(id))) {
    assert.ok(!/⃗/.test(plano(x)), `${donde}: «⃗» en una recta`);
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${donde}: { vec } en una recta`);
  }
});

test('la unidad entera cumple el contrato de calidad 2, con los temas del catálogo', () => {
  assert.equal(def.calidad, 2);
  const temas = leer('catalogo/cursos/fisica.json').unidades.find(u => u.id === def.unidad).temas;
  const p = Teoria.problemas(def, { temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  const glos = Glosario.porIdea(def);
  assert.deepEqual(glos[0].map(g => g.termino).sort(), ['MRU', 'posición', 'rapidez', 'velocidad']);
  assert.deepEqual(glos.slice(1).map(l => l.map(g => g.termino)), [['gráfica x–t', 'pendiente', 'instante'], ['velocidad media', 'rapidez media'],
    ['encuentro', 'alcance'], ['velocidad relativa', 'sistema de referencia']]);
  for (const g of def.glosario) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    // Los ejemplos de nivel 3 son de examen: con alternativas, y la letra de la respuesta en negrita.
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      assert.ok(e.alternativas && e.alternativas.length >= 4, `${i.id}: ${e.titulo}`);
      assert.ok(e.respuesta.some(x => x && x.negrita), `${i.id} ${e.titulo}: la letra en negrita`);
      assert.equal(new Set(e.alternativas).size, e.alternativas.length, e.titulo);
    }
  }
  // Los ids que guardan avance se conservan (propuesta §1): las ideas y la mesa del encuentro.
  for (const id of ['mru', 'desplazamiento-distancia', 'encuentro']) assert.ok(idea(id), id);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['encuentro-libre']);
  assert.deepEqual(def.laboratorio[0].controles.map(c => c.id).slice(0, 3), ['d', 'va', 'vb']);
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

// ---------- Las ideas A2 a A5 ----------
// Todas las figuras de una idea, con la pieza con que las dibuja el lector (app/teoria.js): la del momento o la de la idea.
function figurasDe(i) {
  const out = [], P = (...ps) => ps.find(Boolean) || i.pieza, j = i.juega;
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 5 === 0)) out.push([`juego ${JSON.stringify(v)}`, j.dibujo(v), P(j.pieza)]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo, P(t.pieza)]);
  out.push(['predice', i.predice.dibujo, P(i.predice.pieza)], ['revelar', i.predice.revelar, P(i.predice.pieza)]);
  const fr = Teoria.figuraRegla(i);
  out.push(['regla', { datos: fr.datos, estado: fr.estado }, fr.pieza]);
  i.mira.pasos.forEach((p, k) => out.push([`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, P(i.mira.pieza)]));
  i.ejemplos.forEach((e, k) => { if (e.figura) out.push([`ejemplo ${k + 1}`, e.figura, e.figura.pieza]); });
  for (let s = 0; s < 80; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) out.push([`ahora tú ${s}`, a.dibujo, P(i.ahoraTu.pieza)]);
    if (r.dibujo) out.push([`resuelve ${s}`, r.dibujo, P(i.resuelve.pieza)]);
  }
  return out;
}
const NUEVAS = ['grafica-xt', 'desplazamiento-distancia', 'encuentro', 'velocidad-relativa'];
const caja = s => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);

test('las figuras de A2 a A5: la pieza que nombra el dibujo es la que lo dibuja, dibujos de prueba, y rótulos que caben y no se pisan', () => {
  let n = 0;
  for (const id of NUEVAS) for (const [donde, f, pieza] of figurasDe(idea(id))) {
    n++;
    if (f.pieza) assert.equal(f.pieza, pieza, `${id} ${donde}: el dibujo pide ${f.pieza} y el lector usa ${pieza}`);
    const P = Kit.piezas[pieza], s = P.dibujar(f.datos, f.estado || {}), [W, H] = caja(s);
    assert.match(s, /data-prueba="si"/, `${id} ${donde}`);
    assert.ok(!/var\(--c-d\)/.test(s), `${id} ${donde}: verde`);
    assert.ok(!/var\(--c-h\)/.test(s), `${id} ${donde}: carmín (aquí no hay aceleración)`);
    const g = P.geometria(f.datos, f.estado || {});
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= H - 4 + 1e-9, `${id} ${donde}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) {
      assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${id} ${donde}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
    }
  }
  assert.ok(n > 500, `${n} figuras`);
});

// Los números que una figura escribe, sin los de la regla ni los de los ejes (que son la escala, no un dato).
function numerosFigura(f) {
  const P = Kit.piezas[f.pieza], g = P.geometria(f.datos, f.estado || {});
  const fuera = new Set([...(g.numeros || []), ...(g.numT || []), ...(g.numX || []), g.unidad, g.nombreX, g.nombreT].filter(Boolean));
  return g.rotulos.filter(r => !fuera.has(r)).map(r => r.texto).join(' | ');
}
test('ninguna figura de Predice ni de un ejemplo de A2 a A5 delata la respuesta', () => {
  // Predice: la figura no trae lo que se pide.
  const tx = id => numerosFigura(Object.assign({ pieza: idea(id).predice.pieza || idea(id).pieza }, idea(id).predice.dibujo));
  assert.ok(!/4 m\/s|Δx|Δt/.test(tx('grafica-xt')), 'A2: ni la pendiente ni el escalón');
  assert.ok(!/3 m\/s|40 s|t =/.test(tx('desplazamiento-distancia')), 'A3: ni la rapidez media ni el tiempo total');
  assert.ok(!/alcance|150/.test(tx('encuentro')), 'A4: ni el lugar del alcance');
  assert.ok(!/7 m\/s|orilla/.test(tx('velocidad-relativa').replace('respecto al agua', '')), 'A5: ni la rapidez desde la orilla');
  assert.equal(COMBI_G(idea('encuentro').predice.dibujo).t, 0, 'A4: los dos al empezar el reloj');
  for (const id of NUEVAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (!e.figura) continue;
    const rot = numerosFigura(e.figura).replace(/\s/g, '');
    for (const x of fichas(e.respuesta)) {
      const nn = (x.t.match(/−?\d[\d ,]*/) || [''])[0].replace(/\s/g, '');
      if (nn && !/^(0|1)$/.test(nn)) assert.ok(!rot.includes(nn) || DATO(e, nn), `${id} ejemplo ${k + 1}: la figura muestra «${x.t}» (${rot})`);
    }
    // Lo que se pide de la otra combi en la ventana va con «?» y sin flecha.
    if (e.figura.pieza === 'fis-ventana' && e.figura.datos.rotuloRel) assert.equal(e.figura.datos.rotuloRel, '?');
  }
});
const COMBI_G = f => Kit.piezas['fis-combi'].geometria(f.datos, f.estado || {});
// Un número de la respuesta que ya es un dato del enunciado puede estar en la figura (la rapidez dada, por ejemplo).
const DATO = (e, nn) => plano(e.enunciado).replace(/\s/g, '').includes(nn);

test('ningún juego muestra lo que su predicción pregunta, y cada misión la cumplen solo los casos que debe', () => {
  const G = id => Teoria.grilla(idea(id).juega.controles), j = id => idea(id).juega;
  // A2: todas las rectas del juego salen del cero (la predicción es una que no sale de ahí); la misión, solo v = 15 m/s.
  for (const v of G('grafica-xt')) assert.deepEqual(j('grafica-xt').dibujo(v).datos.lineas[0].puntos[0], [0, 0]);
  assert.deepEqual([...new Set(G('grafica-xt').filter(v => j('grafica-xt').mision.logrado(v)).map(v => v.v))], [15]);
  // A3: la vuelta va igual de rápido que la ida (la predicción vuelve a 6 m/s); la misión, solo volviendo 20 m.
  for (const v of G('desplazamiento-distancia').filter((_, k) => k % 13 === 0)) {
    const ts = j('desplazamiento-distancia').dibujo(v).datos.tramos.filter(Boolean);
    assert.ok(ts.every(x => x.texto === '2 m/s'), JSON.stringify(v));
  }
  assert.deepEqual([...new Set(G('desplazamiento-distancia').filter(v => j('desplazamiento-distancia').mision.logrado(v)).map(v => v.r))], [20]);
  // A4: siempre de frente (la predicción es un alcance); la misión, con 5 y 3 o 10 y 6 m/s.
  for (const v of G('encuentro').filter((_, k) => k % 17 === 0)) assert.ok(j('encuentro').dibujo(v).datos.segundo.v < 0, JSON.stringify(v));
  assert.deepEqual([...new Set(G('encuentro').filter(v => j('encuentro').mision.logrado(v)).map(v => `${v.va}:${v.vb}`))].sort(), ['10:6', '5:3']);
  // A5: dos combis en la carretera, ningún río; la misión, solo con B a 15 m/s.
  assert.equal(j('velocidad-relativa').pieza, 'fis-ventana');
  assert.deepEqual([...new Set(G('velocidad-relativa').filter(v => j('velocidad-relativa').mision.logrado(v)).map(v => v.vb))], [15]);
  for (const id of NUEVAS) assert.ok(!j(id).mision.logrado(Teoria.inicio(j(id))), `${id}: cumplida al abrir`);
  // «Lee» no adelanta las respuestas de las predicciones.
  const lee = id => idea(id).lee.tarjetas.map(t => plano(t.texto)).join(' ');
  assert.ok(!/4 m\/s|12 m/.test(lee('grafica-xt')));
  assert.ok(!/3 m\/s|6 m\/s|promedio/.test(lee('desplazamiento-distancia')));
  assert.ok(!/15 s|resta/.test(lee('encuentro')));
  assert.ok(!/río|7 m\/s|suma/.test(lee('velocidad-relativa')));
});

// ---------- Cálculo aparte (sin el código de la unidad), A2 a A5 ----------
const n2 = s => num(String(s).replace(/\s/g, ''));
function revisarAhoraTu(id, casos, esperados) {
  const i = idea(id), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), bien = plano(a.opciones.find(o => o.correcta).texto);
    assert.equal(a.opciones.length, 4, `${id} semilla ${s}: ${a.opciones.length} opciones`);
    assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, 4, `${id} semilla ${s}: opciones repetidas`);
    assert.equal(a.opciones.filter(o => o.correcta).length, 1);
    for (const o of a.opciones.filter(y => !y.correcta)) assert.ok(o.error && o.siFuera, `${id} semilla ${s}: ${o.id}`);
    let hecho = false;
    for (const [nombre, re, calc] of casos) {
      const m = q.match(re);
      if (!m) continue;
      assert.equal(bien, calc(m.slice(1).map(n2), m.slice(1)), `${id} semilla ${s}: ${q}`);
      vistos.add(nombre); hecho = true; break;
    }
    if (!hecho) assert.fail(`${id} semilla ${s}: no reconozco «${q}»`);
    assert.ok(a.datos && a.datos.length, `${id} semilla ${s}: sin datos`);
  }
  assert.deepEqual([...vistos].sort(), esperados.sort(), `${id}: todas las variantes, hasta la de examen`);
}
const N = '(−?[\\d ,]+)';
test('A2 «Ahora tú»: velocidad con signo de dos puntos, la recta que sigue y dos rectas con signo, cuadran aparte', () => {
  revisarAhoraTu('grafica-xt', [
    ['pendiente', new RegExp(`^La recta x–t de un mototaxi pasa por \\(${N} s; ${N} m\\) y \\(${N} s; ${N} m\\)\\. ¿Qué velocidad lleva(, con su signo)?\\?$`), ([t1, x1, t2, x2], raw) => {
      // «Con su signo» solo si la recta baja (lector en frío, 18 nov: si sube, ninguna opción lleva signo).
      assert.equal(!!raw[4], x2 < x1, 'con su signo solo cuando baja');
      return `${fmt((x2 - x1) / (t2 - t1))} m/s`;
    }],
    ['sigue', new RegExp(`^La gráfica x–t de una combi es una recta de \\(0 s; ${N} m\\) a \\(${N} s; ${N} m\\), y ahí se corta\\. Si sigue igual, ¿dónde estará a los ${N} s\\?$`), ([x0, t1, x1, T]) => `En x = ${fmt(x0 + (x1 - x0) / t1 * T)} m`],
    ['dos', new RegExp(`^En la gráfica x–t, la recta de una combi va de \\(0 s; 0 m\\) a \\(${N} s; ${N} m\\) y la de un mototaxi, de \\(0 s; ${N} m\\) a \\(${N} s; ${N} m\\)\\. ¿Qué velocidades tienen\\?$`), ([t, xa, X, t2, xb]) => `Combi: ${fmt(xa / t)} m/s; mototaxi: ${fmt((xb - X) / t2)} m/s`],
  ], ['pendiente', 'sigue', 'dos']);
});
test('A3 «Ahora tú»: rapidez y velocidad media de ida y vuelta, dos tramos y la mitad del recorrido, cuadran aparte', () => {
  revisarAhoraTu('desplazamiento-distancia', [
    ['rapidez', new RegExp(`^Corres ${N} m hasta la valla a ${N} m/s y vuelves ${N} m a ${N} m/s, por el mismo carril\\. ¿Cuál es tu rapidez media\\?$`), ([L, v1, L2, v2]) => `${fmt((L + L2) / (L / v1 + L2 / v2))} m/s`],
    ['velocidad', new RegExp(`^Corres ${N} m hasta la valla a ${N} m/s y vuelves ${N} m a ${N} m/s, por el mismo carril\\. ¿Cuál es tu velocidad media\\?$`), ([L, v1, L2, v2]) => `${fmt((L - L2) / (L / v1 + L2 / v2))} m/s`],
    ['tramos', new RegExp(`^Una combi va ${N} s a ${N} m/s y después ${N} s a ${N} m/s, hacia el mismo lado\\. ¿Cuál es su rapidez media en todo el viaje\\?$`), ([t1, v1, t2, v2]) => `${fmt((v1 * t1 + v2 * t2) / (t1 + t2))} m/s`],
    // La mitad del camino D a v1 (tiempo D/v1); la otra mitad, en dos tiempos iguales τ: D = (v2 + v3)·τ.
    ['mitad', new RegExp(`^Un ciclista hace la mitad de su recorrido a ${N} m/s\\. Del resto, la mitad del tiempo va a ${N} m/s y la otra mitad a ${N} m/s\\. ¿Cuál es su rapidez media\\?$`), ([v1, v2, v3]) => { const D = 1, tau = D / (v2 + v3); return `${fmt(2 * D / (D / v1 + 2 * tau))} m/s`; }],
  ], ['rapidez', 'velocidad', 'tramos', 'mitad']);
});
test('A4 «Ahora tú»: cruce, alcance, el que salió antes y el alcance en km/h, cuadran aparte', () => {
  revisarAhoraTu('encuentro', [
    ['cruce', new RegExp(`^Una combi sale del paradero a ${N} m/s y, a la vez, un mototaxi viene de frente desde ${N} m a ${N} m/s\\. ¿Cuándo se cruzan\\?$`), ([va, D, vb]) => `A los ${fmt(D / (va + vb))} s`],
    ['alcance', new RegExp(`^Un mototaxi va ${N} m delante de una combi, a ${N} m/s; la combi lo sigue a ${N} m/s, hacia el mismo lado\\. ¿Cuándo lo alcanza\\?$`), ([D, vb, va]) => `A los ${fmt(D / (va - vb))} s`],
    ['antes', new RegExp(`^Un mototaxi sale del paradero a ${N} m/s\\. ${N} s después sale una combi del mismo paradero, a ${N} m/s, por el mismo camino\\. ¿Cuánto tarda la combi en alcanzarlo\\?$`), ([vb, dt, va]) => `Tarda ${fmt(vb * dt / (va - vb))} s`],
    ['kmh', new RegExp(`^Un mototaxi a ${N} km/h va ${N} m delante de una combi a ${N} km/h, hacia el mismo lado\\. ¿Cuánto tarda la combi en alcanzarlo\\?$`), ([kb, D, ka]) => `Tarda ${fmt(D / ((ka - kb) * 1000 / 3600))} s`],
  ], ['cruce', 'alcance', 'antes', 'kmh']);
});
test('A5 «Ahora tú»: dos combis, de frente, el río y el bote de ida y vuelta, cuadran aparte', () => {
  revisarAhoraTu('velocidad-relativa', [
    ['mismo', new RegExp(`^Tu combi va a ${N} m/s y la del carril de al lado, a ${N} m/s, las dos hacia el lado \\+\\. ¿Con qué velocidad la ves desde tu ventana\\?$`), ([a, b]) => `${fmt(b - a)} m/s`],
    ['frente', new RegExp(`^Tu combi va a ${N} m/s hacia el lado \\+ y otra viene de frente a ${N} m/s\\. ¿Con qué velocidad la ves desde tu ventana\\?$`), ([a, w]) => `${fmt(-w - a)} m/s`],
    ['rio', new RegExp(`^Un bote rema río (arriba|abajo) a ${N} m/s respecto al agua; la corriente va a ${N} m/s\\. ¿Cuánto tarda en recorrer ${N} m de orilla\\?$`),
      ([, u, c, L], raw) => `${fmt(L / (raw[0] === 'arriba' ? u - c : u + c))} s`],
    ['ida', new RegExp(`^Un bote rema a ${N} m/s respecto al agua en un río que corre a ${N} m/s\\. Sube ${N} m río arriba y vuelve\\. ¿Cuánto dura todo el viaje\\?$`), ([u, c, L]) => `${fmt(L / (u - c) + L / (u + c))} s`],
  ], ['mismo', 'frente', 'rio', 'ida']);
});

test('«Así se resuelve» de A2 a A5 no pregunta lo de «Ahora tú» y cuadra con un cálculo aparte (400 semillas)', () => {
  const casos = {
    'grafica-xt': [
      [new RegExp(`^La recta x–t de una combi pasa por \\(${N} s; ${N} m\\) y \\(${N} s; ${N} m\\)\\. ¿Dónde estaba a los 0 s\\?$`), ([t1, x1, t2, x2]) => `Estaba en x₀ = ${fmt(x1 - (x2 - x1) / (t2 - t1) * t1)} m`],
      [new RegExp(`^La recta x–t de una combi pasa por \\(${N} s; ${N} m\\) y \\(${N} s; ${N} m\\)\\. Si sigue igual, ¿a qué instante pasa por x = ${N} m\\?$`), ([t1, x1, t2, x2, X]) => `A los ${fmt(t1 + (X - x1) / ((x2 - x1) / (t2 - t1)))} s`],
    ],
    'desplazamiento-distancia': [
      [new RegExp(`^Una combi va y vuelve por una avenida recta, con velocidad constante entre lectura y lectura\\. A los 0, ${N}, ${N} y ${N} s está en 0, ${N}, ${N} y ${N} m\\. ¿Su rapidez media y su velocidad media\\?$`),
        ([, , T3, a, b, c]) => `${fmt((a + (b - a) + (b - c)) / T3)} m/s y ${fmt(c / T3)} m/s`],
    ],
    encuentro: [
      [new RegExp(`^Una combi sale del paradero a ${N} m/s y, a la vez, un mototaxi viene de frente desde ${N} m a ${N} m/s\\. ¿A qué distancia del paradero se cruzan\\?$`), ([va, D, vb]) => `A ${fmt(va * D / (va + vb))} m del paradero`],
      [new RegExp(`^Un mototaxi va ${N} m delante de una combi, a ${N} m/s; la combi lo sigue a ${N} m/s\\. ¿A qué distancia de donde salió la combi lo alcanza\\?$`), ([D, vb, va]) => `A ${fmt(va * D / (va - vb))} m de donde salió`],
    ],
    'velocidad-relativa': [
      [new RegExp(`^Desde tu combi, que va a ${N} m/s, la del carril de al lado parece ir hacia (atrás|adelante) a ${N} m/s\\. ¿Cuál es su velocidad, medida desde la carretera\\?$`),
        ([vA, , w], raw) => `${fmt(vA + (raw[1] === 'atrás' ? -w : w))} m/s, hacia el mismo lado que tú`],
      [new RegExp(`^Remando igual, un bote recorre ${N} m de orilla río abajo en ${N} s y los mismos ${N} m río arriba en ${N} s\\. ¿Cuánto vale la corriente\\?$`), ([L, t1, , t2]) => `La corriente va a ${fmt((L / t1 - L / t2) / 2)} m/s`],
    ],
  };
  for (const id of NUEVAS) {
    const vistos = new Set(), preguntas = new Set();
    for (let s = 0; s < 60; s++) preguntas.add(plano(idea(id).ahoraTu.generar(s).pregunta).replace(/−?\d[\d ,]*/g, '#'));
    for (let s = 0; s < SEMILLAS; s++) {
      const r = idea(id).resuelve.generar(s), q = plano(r.enunciado), resp = plano(r.respuesta);
      const k = casos[id].findIndex(([re]) => re.test(q));
      assert.ok(k >= 0, `${id} resuelve ${s}: no reconozco «${q}»`);
      const m = q.match(casos[id][k][0]);
      assert.equal(resp, casos[id][k][1](m.slice(1).map(n2), m.slice(1)), `${id} resuelve ${s}: ${q}`);
      assert.ok(!preguntas.has(q.replace(/−?\d[\d ,]*/g, '#')), `${id} resuelve ${s}: la misma pregunta que «Ahora tú»`);
      vistos.add(k);
    }
    assert.equal(vistos.size, casos[id].length, id);
  }
});

// ---------- Correcciones de la auditoría y del lector en frío (18 nov) ----------
// A2: las reglas de A4 y A5 usan el eje con signo de la unidad (una sola fórmula, cada v con su signo) y traen la línea
// que las traduce al «±» de la academia, como la idea 1.
test('A2: las reglas de encuentros y del río son las del eje con signo y traducen al «±» de la academia, como la idea 1', () => {
  const r = id => idea(id).regla, ec = id => plano(r(id).ecuacion);
  assert.match(r('mru').texto, /academia escribe x = x₀ ± v · t/);
  assert.match(ec('encuentro'), /te = D \/ \(vA − vB\)/);
  assert.ok(!/vA \+ vB|v_A \+ v_B/.test(ec('encuentro')), 'de frente no se escriben las rapideces con letras de velocidad');
  assert.match(r('encuentro').texto, /signo/);
  assert.match(r('encuentro').texto, /academia/);
  assert.match(ec('velocidad-relativa'), /v = u \+ c/);
  assert.ok(!/u − c/.test(ec('velocidad-relativa')), 'río arriba no es otra fórmula: u lleva su signo');
  assert.match(r('velocidad-relativa').texto, /academia escribe u ± c/);
  assert.match(r('velocidad-relativa').condicion, /signo/);
  // La cuenta con signo da lo mismo que la de la academia, de frente y al alcance, río abajo y río arriba.
  const te = (D, vA, vB) => D / (vA - vB);
  assert.equal(te(100, 6, -4), 100 / (6 + 4));
  assert.equal(te(30, 8, 5), 30 / (8 - 5));
  assert.equal(Math.abs(-4 + 1.5), 4 - 1.5);
});

// M5: los datos de una predicción no dicen el signo o el sentido que mide su distractor.
test('M5: los datos de Predice no dan el signo ni el sentido que se predice', () => {
  for (const i of def.ideas) for (const d of i.predice.datos || []) assert.ok(!/sentido negativo|van hacia el mismo lado|mismo lado/.test(plano(d)), `${i.id}: «${plano(d)}»`);
  assert.deepEqual(idea('mru').predice.datos.map(plano), ['El paradero está en x = 0; + hacia la derecha y − hacia la izquierda.']);
});

// M10: la letra correcta de los ejemplos de examen se reparte entre la A y la E (ninguna pasa del 40 %).
test('M10: la letra correcta de los 25 ejemplos de nivel 3 se reparte entre la A y la E', () => {
  const cuenta = {};
  let n = 0;
  for (const i of def.ideas) for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
    const L = fichasNegrita(e.respuesta)[0];
    assert.ok(/^[A-E]$/.test(L), `${i.id} ${e.titulo}: «${L}»`);
    cuenta[L] = (cuenta[L] || 0) + 1; n++;
  }
  assert.equal(n, 25);
  assert.deepEqual(Object.keys(cuenta).sort(), ['A', 'B', 'C', 'D', 'E'], JSON.stringify(cuenta));
  for (const [L, k] of Object.entries(cuenta)) assert.ok(k <= 0.4 * n, `${L} en ${k} de ${n}`);
});
const fichasNegrita = x => (Array.isArray(x) ? x.flatMap(fichasNegrita) : x && typeof x === 'object' && x.negrita ? [plano(x.negrita)] : []);

// M4: en un ejercicio con alternativas, los móviles no se llaman A ni B (son las letras de las alternativas).
test('M4: los ejercicios con alternativas nombran los móviles con palabras, no con A y B', () => {
  const conLetra = t => /\b(?:combi|placa|móvil|recta de|la de|el|la) [AB]\b|^[AB]:|; [AB]:/.test(t);
  for (const i of def.ideas) {
    for (const e of i.ejemplos.filter(x => x.alternativas)) {
      for (const t of [plano(e.enunciado), ...e.alternativas]) assert.ok(!conLetra(t), `${i.id} ${e.titulo}: «${t}»`);
    }
    for (let s = 0; s < 60; s++) {
      const a = i.ahoraTu.generar(s);
      for (const t of [plano(a.pregunta), ...a.opciones.map(o => plano(o.texto))]) assert.ok(!conLetra(t), `${i.id} semilla ${s}: «${t}»`);
    }
  }
});

// M1, M2, B1: rapideces posibles por sujeto (ciclista, combi, columna, bote, niño…), en los ejemplos, la predicción,
// «Así se resuelve» y «Ahora tú» (400 semillas). La tabla es la de la práctica (plantillas/fis-mru/topes.js).
test('medidas posibles: ninguna rapidez pasa el tope de su sujeto (tabla común con la práctica, 400 semillas)', () => {
  const Topes = require('../../../plantillas/fis-mru/topes.js');
  const malas = [], ver = (donde, x) => { for (const m of Topes.revisar(plano(x))) malas.push(`${donde}: ${m.sujeto} a ${m.texto} (tope ${m.tope} m/s)`); };
  for (const i of def.ideas) {
    ver(`${i.id} predice`, i.predice.pregunta);
    for (const e of i.ejemplos) ver(`${i.id} ${e.titulo}`, e.enunciado);
    for (let s = 0; s < SEMILLAS; s++) { ver(`${i.id} ahora tú ${s}`, i.ahoraTu.generar(s).pregunta); ver(`${i.id} resuelve ${s}`, i.resuelve.generar(s).enunciado); }
  }
  assert.deepEqual(malas, []);
  // La tabla sí atrapa lo que encontró la auditoría.
  assert.equal(Topes.revisar('Un ciclista hace la mitad de su recorrido a 8 m/s y luego va a 28 m/s.').length, 1);
  assert.equal(Topes.revisar('Una columna desfila a 11 m/s. Un ciclista va a 12 m/s.')[0].sujeto, 'columna');
  assert.equal(Topes.revisar('la combi A va a 108 km/h')[0].sujeto, 'combi');
  assert.deepEqual(Topes.revisar('Un mototaxi a 36 km/h va 100 m delante de una combi a 72 km/h.'), []);
});

// M6: «el que salió antes» dibuja solo al mototaxi en el paradero, con la nota de cuándo sale la combi.
test('M6: el que salió antes se dibuja sin la combi (ese instante no existe) y con la nota', () => {
  const e = idea('encuentro').ejemplos.find(x => x.titulo === 'El que salió antes');
  const s = Kit.piezas['fis-combi'].dibujar(e.figura.datos);
  assert.ok(!/data-objeto="combi"/.test(s) && /data-objeto="mototaxi"/.test(s));
  assert.match(s, /La combi sale 10 s después/);
  for (let k = 2; k < 40; k += 4) {
    const a = idea('encuentro').ahoraTu.generar(k), d = a.dibujo.datos;
    assert.equal(d.vehiculo, false, `semilla ${k}`);
    assert.match(d.nota, /^La combi sale \d+ s después\.$/);
  }
});

// M9 y (d): si el resuelto usa la rapidez de acercamiento («se acercan 6 + 4», «gana 8 − 5»), los datos la traen.
test('M9: todo ejemplo y «Ahora tú» de A4 que usa lo que se cierra la separación lo trae en sus datos', () => {
  const usa = x => /se acercan|gana|se separan|se alejan/.test(plano(x));
  const trae = ds => (ds || []).some(d => /la separación cambia la suma de las rapideces/.test(plano(d)));
  for (const e of idea('encuentro').ejemplos) if (usa(e.solucion.map(p => p.texto))) assert.ok(trae(e.datos), e.titulo);
  for (let s = 0; s < 40; s++) { const a = idea('encuentro').ahoraTu.generar(s); if (usa(a.solucion.texto)) assert.ok(trae(a.datos), `semilla ${s}`); }
  assert.match(plano(idea('encuentro').regla.condicion), /tₑ: instante del encuentro/);
});
