// Pruebas propias de «Materia y energía» (además del validador común de contenido/teoria/teoria.test.js):
//   - un dibujo de partículas usa la paleta de elementos y ningún color de variable (docs/etapa2/decisiones.md, 17 nov);
//   - ningún dibujo junta dos elementos que no se distinguen (Elementos.CERCANOS: N–Fe, C–Na…), y cada combinación de
//     elementos que sale junta está en Elementos.VISTAS (donde nucleo/elementos.test.js mide su separación);
//   - las lupas de quim-vasos no recortan partículas (caben todas las que piden los datos);
//   - la idea 1 da sus clasificaciones con el motor de la escena, y «Así se resuelve» no repite el caso de «Ahora tú».
// Se recorren todos los dibujos: Lee, el juego en cada opción y cada instante, Predice, Mira, «Ahora tú» y «Así se
// resuelve» en 60 semillas, los ejemplos y las mesas del laboratorio.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const E = require('../../../nucleo/elementos.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./materia-y-energia.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const V = Kit.piezas['quim-vasos'];

// Todos los dibujos de la unidad: { donde, pieza, datos, estado }.
function dibujos() {
  const out = [];
  const add = (donde, pieza, dib) => { if (dib && dib.datos) out.push({ donde, pieza, datos: dib.datos, estado: dib.estado || {} }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [k, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${k + 1}`, t.pieza || p, t.dibujo);
    const j = idea.juega, ctr = j.controles || [];
    let casos = [Teoria.inicio(j)];
    for (const c of ctr) casos = casos.flatMap(v => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, i) => c.min + i * c.paso)).map(x => Object.assign({}, v, { [c.id]: x })));
    for (const v of casos) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(v));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [k, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${k + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, paso.estado || {}) });
    for (let s = 0; s < 60; s++) {
      const a = idea.ahoraTu.generar(s); if (a.dibujo) add(`${idea.id} ahoraTu ${s}`, idea.ahoraTu.pieza || p, a.dibujo);
      if (idea.resuelve) { const r = idea.resuelve.generar(s); if (r.dibujo) add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo); for (const x of r.pasos) if (x.dibujo) add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, x.dibujo); }
    }
    for (const [k, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${k + 1}`, e.figura.pieza, e.figura);
  }
  for (const mesa of def.laboratorio || []) for (const v of Teoria.grilla(mesa.controles || [])) add(`laboratorio ${mesa.id} ${JSON.stringify(v)}`, mesa.pieza, mesa.dibujo(v));
  return out;
}
const TODOS = dibujos();
const DE_PARTICULAS = TODOS.filter(d => d.pieza === 'quim-particulas' || d.pieza === 'quim-vasos');
// Los elementos que pinta un dibujo de partículas (por su `el`, o por el símbolo si no lo trae).
function elementos(d) {
  const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
  return [...new Set([...svg.matchAll(/var\(--el-([A-Za-z]+)\)/g)].map(m => m[1]))].sort();
}

test('hay dibujos de partículas en la unidad (la prueba no corre en vacío)', () => assert.ok(DE_PARTICULAS.length > 100));

test('un dibujo de partículas usa la paleta de elementos y ningún color de variable', () => {
  for (const d of DE_PARTICULAS) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    assert.ok(!/var\(--c-/.test(svg), `${d.donde}: colores de variable en un dibujo de partículas`);
    for (const e of elementos(d)) assert.ok(E.COLORES[e], `${d.donde}: «${e}» no está en nucleo/elementos.js`);
  }
});

test('ningún dibujo junta elementos que no se distinguen, y cada combinación está en Elementos.VISTAS', () => {
  const cerca = new Set(E.CERCANOS.map(([a, b]) => [a, b].sort().join('-')));
  const vistas = E.VISTAS.map(([, els]) => new Set(els));
  for (const d of DE_PARTICULAS) {
    const els = elementos(d);
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++)
      assert.ok(!cerca.has([els[i], els[j]].sort().join('-')), `${d.donde}: ${els[i]} y ${els[j]} no se distinguen (CERCANOS)`);
    if (els.length > 1) assert.ok(vistas.some(v => els.every(e => v.has(e))), `${d.donde}: agrega [${els.join(', ')}] a Elementos.VISTAS`);
  }
});

test('las lupas no recortan partículas: caben todas las que piden los datos', () => {
  for (const d of TODOS.filter(x => x.pieza === 'quim-vasos')) {
    (d.datos.recipientes || []).forEach((r, k) => {
      if (!r.lupa || r.lupa.vacia) return;
      const cap = V.capacidad(d.datos, k);
      r.lupa.capas.forEach((c, ci) => {
        const n = (c.particulas || []).reduce((a, p) => a + (p.n || 0), 0);
        assert.ok(n <= cap[ci], `${d.donde}: lupa ${k + 1}, capa ${ci + 1}: ${n} partículas y caben ${cap[ci]}`);
      });
    });
  }
});

test('idea 1: la misión la cumple solo una mezcla de una fase, y no al abrir', () => {
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla'), m = idea.juega.mision;
  assert.equal(m.logrado(Teoria.inicio(idea.juega)), false);
  assert.equal(m.logrado({ echa: 'azucar', t: 30 }), true);
  assert.equal(m.logrado({ echa: 'sal', t: 20 }), true);
  assert.equal(m.logrado({ echa: 'sal', t: 10 }), false, 'con sal sin disolver hay dos fases');
  for (const echa of ['aceite', 'arena', 'nada']) assert.equal(m.logrado({ echa, t: 30 }), false, echa);
});

test('idea 1: «Así se resuelve» no repite el caso de «Ahora tú» con la misma semilla', () => {
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla');
  let iguales = 0;
  const caso = (q, ds) => q + ' | ' + JSON.stringify(ds);
  for (let s = 0; s < 60; s++) { const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s); if (s % 5 !== 0 && caso(a.pregunta, a.datos) === caso(r.enunciado, r.datos)) iguales++; }
  assert.ok(iguales <= 3, `${iguales} semillas con el mismo caso (enunciado y datos)`);
  // En el tipo de la lupa la pregunta es la misma: lo que cambia es la muestra dibujada.
  for (let s = 0; s < 60; s += 5) assert.notEqual(JSON.stringify(idea.ahoraTu.generar(s).dibujo), JSON.stringify(idea.resuelve.generar(s).dibujo), `semilla ${s}`);
});

test('idea 1: los ejemplos no usan el hielo (es la predicción de la idea) y su respuesta va en violeta', () => {
  const Ecuacion = require('../../../nucleo/ecuacion.js');
  const idea = def.ideas.find(i => i.id === 'sustancia-mezcla');
  for (const [k, e] of idea.ejemplos.entries()) {
    const todo = [e.enunciado, ...(e.datos || []), ...e.solucion.map(x => x.texto), e.respuesta].map(x => Ecuacion.texto(Array.isArray(x) ? x : [x])).join(' ');
    assert.ok(!/hielo|cubito/i.test(todo), `ejemplo ${k + 1} usa el hielo`);
    assert.ok(e.respuesta.some(x => x && x.v === 'c-f'), `ejemplo ${k + 1}: la respuesta va en violeta (c-f)`);
    if (e.figura) assert.ok(!JSON.stringify(e.figura).includes(Ecuacion.texto(e.respuesta)), `ejemplo ${k + 1}: la figura muestra la respuesta`);
  }
});

// La sal con sus cargas (Gerson, 17 nov: «ponerle las cargas desde ya»): cada ion lleva su signo dentro del átomo, el
// signo mide 6 px o más de largo (a 390 px se ve de unos 6,5 px, con trazo de 2) y ningún ion pisa un átomo de otra
// partícula de la lupa. Se mide en el SVG: cada partícula es un <g class="kit-particula">.
test('los iones de la sal: signo legible, dentro de su átomo y sin pisar a los vecinos', () => {
  const num = (a, k) => +a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`))[1];
  let iones = 0;
  for (const d of DE_PARTICULAS) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    const parts = [...svg.matchAll(/<g class="kit-particula[^"]*">([\s\S]*?)<\/g>/g)].map(m => ({
      circ: [...m[1].matchAll(/<circle([^>]*)\/>/g)].map(c => ({ x: num(c[1], 'cx'), y: num(c[1], 'cy'), r: num(c[1], 'r') })),
      signos: [...m[1].matchAll(/<path class="kit-carga" d="M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/g)].map(s => s.slice(1).map(Number)),
    }));
    parts.forEach((p, i) => {
      if (!p.signos.length) return;
      for (const [x1, y1, x2, y2] of p.signos) {
        iones++;
        assert.ok(Math.hypot(x2 - x1, y2 - y1) >= 6, `${d.donde}: signo de ${Math.hypot(x2 - x1, y2 - y1).toFixed(1)} px`);
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        assert.ok(p.circ.some(c => Math.hypot(c.x - cx, c.y - cy) < 0.01 && c.r >= Math.hypot(x2 - x1, y2 - y1) / 2 + 1), `${d.donde}: el signo sale de su átomo`);
      }
      parts.forEach((q, j) => {
        if (i === j) return;
        for (const a of p.circ) for (const b of q.circ) {
          if (a.r < 3 || b.r < 3) continue;   // el punto interior de un átomo «punto»
          assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r - 0.5, `${d.donde}: un ion pisa un átomo vecino`);
        }
      });
    });
  }
  assert.ok(iones > 20, 'hay iones dibujados');
});

// ---------- Ideas 2 a 5 (17 nov) ----------
const Ecuacion = require('../../../nucleo/ecuacion.js');
const Glosario = require('../../../nucleo/glosario.js');
const idea = id => def.ideas.find(i => i.id === id);
const txt = x => Ecuacion.texto(Array.isArray(x) ? x : [x]);

test('el orden de las ideas es el aprobado (decisiones, 17 nov) y la unidad declara calidad 2', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['sustancia-mezcla', 'propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia']);
  assert.equal(def.calidad, 2);
});

test('las misiones las cumple solo el caso buscado, nunca al abrir', () => {
  const m2 = idea('propiedades').juega.mision.logrado;
  for (const cual of ['grande', 'medalla', 'chico']) for (const trozo of [25, 50, 75, 100]) assert.equal(m2({ cual, trozo }), cual === 'chico' && trozo === 50, `${cual} ${trozo}`);
  const m3 = idea('fisico-quimico-nuclear').juega.mision.logrado;
  const tipo = { olla: false, chicha: true, ropa: false, clavo: true, gas: true, hueso: false };
  for (const [k, v] of Object.entries(tipo)) { assert.equal(m3({ k, tiempo: 100 }), v, k); assert.equal(m3({ k, tiempo: 0 }), false, `${k}: antes de que pase el tiempo`); }
  const m4 = idea('calor-sensible-latente').juega.mision.logrado;
  assert.equal(m4({ q: 0 }), false); assert.equal(m4({ q: 340 }), true); assert.equal(m4({ q: 620 }), false); assert.equal(m4({ q: 77 }), false);
  const m5 = idea('masa-energia').juega.mision.logrado, c = idea('masa-energia').juega.controles[0];
  const logran = Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, i) => Math.round((c.min + i * c.paso) * 10) / 10).filter(mg => m5({ mg }));
  assert.deepEqual(logran, [5.2], 'solo la menor masa que llega a 1000 balones');
  for (const i of def.ideas) assert.equal(i.juega.mision.logrado(Teoria.inicio(i.juega)), false, i.id);
});

test('«Así se resuelve» no repite el caso de «Ahora tú» con la misma semilla (ideas 2 a 5)', () => {
  for (const id of ['propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia']) {
    let iguales = 0;
    for (let s = 0; s < 60; s++) {
      const a = idea(id).ahoraTu.generar(s), r = idea(id).resuelve.generar(s);
      if (txt(a.pregunta) + JSON.stringify(a.datos) + JSON.stringify(a.dibujo || null) === txt(r.enunciado) + JSON.stringify(r.datos) + JSON.stringify(r.dibujo || null)) iguales++;
    }
    assert.ok(iguales <= 6, `${id}: ${iguales} semillas con el mismo caso`);
  }
});

test('ejemplos: la respuesta va en violeta y ninguna figura la muestra (ideas 2 a 5)', () => {
  for (const id of ['propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia']) for (const [k, e] of idea(id).ejemplos.entries()) {
    assert.ok(e.respuesta.some(x => x && x.v === 'c-f'), `${id} ejemplo ${k + 1}: respuesta en violeta`);
    const fig = JSON.stringify(e.figura || {});
    for (const x of e.respuesta.filter(x => x && x.v === 'c-f')) assert.ok(!fig.includes(`"${x.t}"`) && !fig.includes(` ${x.t}"`), `${id} ejemplo ${k + 1}: la figura muestra «${x.t}»`);
    if (e.figura && e.figura.pieza === 'quim-cocina') assert.ok(!/"color":"f"|"colorT":"f"/.test(fig), `${id} ejemplo ${k + 1}: nada en violeta en la figura antes de responder`);
  }
});

test('Predice no delata la respuesta en su figura: lo pedido va con «?», en tinta', () => {
  const dib = id => JSON.stringify(idea(id).predice.dibujo);
  assert.ok(!/87 °C/.test(dib('propiedades')) && /"termometro":"\?"/.test(dib('propiedades')));
  assert.ok(!/0 °C/.test(dib('calor-sensible-latente')) && /"termometro":"\?"/.test(dib('calor-sensible-latente')));
  assert.match(dib('masa-energia'), /"inclina":"duda"/);
  assert.match(dib('fisico-quimico-nuclear'), /"vacia":true/);
  for (const id of ['propiedades', 'calor-sensible-latente', 'masa-energia']) assert.ok(!/"color":"f"|"colorT":"f"/.test(dib(id)), id);
});

test('un dibujo de variables (quim-cocina) no usa la paleta de elementos', () => {
  const vars = TODOS.filter(d => d.pieza === 'quim-cocina');
  assert.ok(vars.length > 100);
  for (const d of vars) assert.ok(!/var\(--el-/.test(Kit.piezas['quim-cocina'].dibujar(d.datos, d.estado)), d.donde);
});

test('lo nuclear de la idea de cambios es solo el carbono-14; la unidad no trae radiactividad ni vida media', () => {
  const t3 = Glosario.texto({ ideas: [idea('fisico-quimico-nuclear')] });
  assert.ok(!/uranio|radio-|alfa|beta|protón|neutrón|electrón/i.test(t3), 'idea 3: nuclear sin otros ejemplos ni partículas subatómicas');
  assert.ok(/carbono-14/.test(t3));
  assert.ok(!/vida media|semivida|radiactiv/i.test(Glosario.texto(def)), 'sin radiactividad ni vida media');
  assert.ok(!/por confirmar/i.test(Glosario.texto(def)));
  assert.match(Glosario.texto(def), /unos 87 °C/);
});

test('calor en calorías, con 1 cal ≈ 4,18 J en los datos, y cₑ para el calor específico', () => {
  const i4 = idea('calor-sensible-latente');
  const datos = [];
  for (let s = 0; s < 40; s++) datos.push(...i4.ahoraTu.generar(s).datos.map(txt));
  for (const e of i4.ejemplos) datos.push(...e.datos.map(txt));
  assert.ok(datos.some(d => /1 cal ≈ 4,18 J/.test(d)));
  assert.ok(!datos.some(d => /\bc =|J\/\(g/.test(d)), 'sin c sola ni J/(g·°C)');
  for (let s = 0; s < 40; s++) for (const o of i4.ahoraTu.generar(s).opciones) assert.ok(!/ J$/.test(txt(o.texto)), 'las opciones en calorías o grados');
});

test('los dibujos de variables de la unidad: rótulos sin pisarse y dentro del lienzo (quim-cocina)', () => {
  const T = require('../../../nucleo/kit/trazo.js');
  const num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  const vistos = new Set();
  for (const d of TODOS.filter(x => x.pieza === 'quim-cocina')) {
    const svg = Kit.piezas['quim-cocina'].dibujar(d.datos, d.estado);
    if (vistos.has(svg)) continue; vistos.add(svg);
    const H = +svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
    const ts = [...svg.matchAll(/<text\b([^>]*)>([^<]*)/g)].map(([, a, t]) => {
      const tam = num(a, 'font-size'), w = T.ancho(t, tam, num(a, 'font-weight') || 400), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      return { t, b: [x0, y - tam * 0.8, x0 + w, y + tam * 0.25] };
    });
    for (const q of ts) assert.ok(q.b[0] >= 3.9 && q.b[2] <= 316.1 && q.b[1] >= 3.9 && q.b[3] <= H - 3.9, `${d.donde}: «${q.t}» fuera del lienzo`);
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
      const p = ts[i].b, q = ts[j].b;
      assert.ok(!(p[0] < q[2] - 0.5 && q[0] < p[2] - 0.5 && p[1] < q[3] - 0.5 && q[1] < p[3] - 0.5), `${d.donde}: «${ts[i].t}» pisa «${ts[j].t}»`);
    }
  }
});
