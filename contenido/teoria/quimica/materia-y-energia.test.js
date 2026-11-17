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
  assert.deepEqual(def.ideas.map(i => i.id), ['sustancia-mezcla', 'propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia', 'vida-media']);
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
  const j6 = idea('vida-media').juega, c6 = j6.controles[0];
  assert.deepEqual(Teoria.grilla([c6]).filter(v => j6.mision.logrado(v)).map(v => v.t), [5730], 'solo cuando quedan 8 de 16: una vida media');
  for (const i of def.ideas) assert.equal(i.juega.mision.logrado(Teoria.inicio(i.juega)), false, i.id);
});

test('«Así se resuelve» no repite el caso de «Ahora tú» con la misma semilla (ideas 2 a 5)', () => {
  for (const id of ['propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia', 'vida-media']) {
    let iguales = 0;
    for (let s = 0; s < 60; s++) {
      const a = idea(id).ahoraTu.generar(s), r = idea(id).resuelve.generar(s);
      if (txt(a.pregunta) + JSON.stringify(a.datos) + JSON.stringify(a.dibujo || null) === txt(r.enunciado) + JSON.stringify(r.datos) + JSON.stringify(r.dibujo || null)) iguales++;
    }
    assert.ok(iguales <= 6, `${id}: ${iguales} semillas con el mismo caso`);
  }
});

// La respuesta lleva el color de su magnitud (molde §3; corrección del 17 nov: «la misma magnitud con el mismo color de
// un ejemplo a otro»): ya no siempre violeta. Lo que se pide no está en la figura.
// Un subíndice con sus dos partes de color es una sola ficha: t₁/₂ es «t_1/2» (la vida media) y no la t del tiempo.
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : 'v' in x ? [x] : Array.isArray(x.sub) && x.sub.every(p => p && typeof p === 'object' && 'v' in p) ? [{ v: x.sub[0].v, t: `${x.sub[0].t}_${x.sub[1].t}` }]
    : Object.values(x).flatMap(fichas));
test('ejemplos: la respuesta lleva color y ninguna figura la muestra (ideas 2 a 6)', () => {
  for (const id of ['propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia', 'vida-media']) for (const [k, e] of idea(id).ejemplos.entries()) {
    assert.ok(fichas(e.respuesta).length, `${id} ejemplo ${k + 1}: respuesta con el color de su magnitud`);
    const fig = JSON.stringify(e.figura || {});
    for (const x of fichas(e.respuesta)) assert.ok(!fig.includes(`"${x.t}"`) && !fig.includes(` ${x.t}"`), `${id} ejemplo ${k + 1}: la figura muestra «${x.t}»`);
    if (e.figura && e.figura.pieza === 'quim-cocina') assert.ok(!/"color":"f"|"colorT":"f"/.test(fig), `${id} ejemplo ${k + 1}: nada en violeta en la figura antes de responder`);
  }
});

test('Predice no delata la respuesta en su figura: lo pedido va con «?», en tinta', () => {
  const dib = id => JSON.stringify(idea(id).predice.dibujo);
  assert.ok(!/87 °C/.test(dib('propiedades')) && /"termometro":"\?"/.test(dib('propiedades')));
  assert.ok(!/0 °C/.test(dib('calor-sensible-latente')) && /"termometro":"\?"/.test(dib('calor-sensible-latente')));
  assert.match(dib('masa-energia'), /"inclina":"duda"/);
  assert.match(dib('fisico-quimico-nuclear'), /"vacia":true/);
  assert.match(dib('vida-media'), /"vacia":true/);
  assert.ok(!/11 460 años después","lupa":\{"foco":0.1,"capas"/.test(dib('vida-media')), 'la lupa de la segunda vida media no se ve antes de responder');
  for (const id of ['propiedades', 'calor-sensible-latente', 'masa-energia']) assert.ok(!/"color":"f"|"colorT":"f"/.test(dib(id)), id);
});

test('un dibujo de variables (quim-cocina) no usa la paleta de elementos', () => {
  const vars = TODOS.filter(d => d.pieza === 'quim-cocina');
  assert.ok(vars.length > 100);
  for (const d of vars) assert.ok(!/var\(--el-/.test(Kit.piezas['quim-cocina'].dibujar(d.datos, d.estado)), d.donde);
});

test('lo nuclear de la idea de cambios es solo el carbono-14; la vida media y lo radiactivo, solo en la idea 6', () => {
  const t3 = Glosario.texto({ ideas: [idea('fisico-quimico-nuclear')] });
  assert.ok(!/uranio|radio-|alfa|beta|protón|neutrón|electrón/i.test(t3), 'idea 3: nuclear sin otros ejemplos ni partículas subatómicas');
  assert.ok(/carbono-14/.test(t3));
  assert.ok(!/vida media|semivida|radiactiv|desintegr/i.test(Glosario.texto({ ideas: def.ideas.slice(0, 5) })), 'ideas 1 a 5 sin radiactividad ni vida media');
  // Idea 6 (Gerson, 17 nov): los átomos se cuentan, no se desarman; sin «isótopo» (el glosario del curso lo define con
  // neutrones, en estructura atómica).
  const t6 = Glosario.texto({ ideas: [idea('vida-media')] });
  assert.ok(!/protón|protones|neutrón|neutrones|electrón|electrones|alfa|beta|isótopo/i.test(t6), 'idea 6 sin partículas subatómicas ni «isótopo»');
  assert.match(t6, /unos 5730 años/);
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

// ---------- Correcciones del lector en frío (17 nov) ----------

// Toda molécula dibujada lleva los átomos que dice su fórmula (el propano salía con 2 H y no con 8). Las fórmulas van
// escritas aquí, aparte de la unidad, como cálculo independiente. Las moléculas grandes (azúcar, glucosa, aceite) se
// dibujan en corto, y la leyenda del juego lo dice: son las únicas exentas.
const FORMULAS = { H2O: 'H2O', CO2: 'CO2', O2: 'O2', N2: 'N2', O3: 'O3', H2: 'H2', NH3: 'NH3', Fe2O3: 'Fe2O3', C3H8: 'C3H8',
  SiO2: 'SiO2', NaCl: 'NaCl', 'Na+': 'Na', 'Cl-': 'Cl', Cu: 'Cu', Sn: 'Sn', Fe: 'Fe', C: 'C', N: 'N', alcohol: 'C2H6O', H: 'H', O: 'O' };
const EN_CORTO = ['azucar', 'glucosa', 'aceite'];
const contar = f => { const c = {}; for (const [, e, n] of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) c[e] = (c[e] || 0) + (n ? +n : 1); return c; };
test('cada molécula dibujada tiene los átomos de su fórmula (propano: 3 C y 8 H)', () => {
  const vistas = new Set();
  for (const d of DE_PARTICULAS) {
    const usadas = d.pieza === 'quim-vasos' ? (d.datos.recipientes || []).flatMap(r => ((r.lupa && r.lupa.capas) || []).flatMap(c => c.particulas || []))
      : (d.datos.cajas || []).flatMap(c => [...(c.particulas || []), ...(c.cuenta || [])]);
    for (const p of usadas) {
      if (EN_CORTO.includes(p.e)) continue;
      assert.ok(FORMULAS[p.e], `${d.donde}: «${p.e}» sin fórmula en la prueba (agrégala o decláralo en corto)`);
      const forma = (d.datos.especies || {})[p.e] || [[p.e, 0, 0]], dib = {};
      for (const [sim] of forma) { const el = ((d.datos.atomos || {})[sim] || {}).el || sim; dib[el] = (dib[el] || 0) + 1; }
      assert.deepEqual(dib, contar(FORMULAS[p.e]), `${d.donde}: ${p.e} dibujado con ${JSON.stringify(dib)}`);
      vistas.add(p.e);
    }
  }
  for (const e of ['C3H8', 'alcohol', 'Na+', 'Cl-', 'Fe2O3', 'NH3']) assert.ok(vistas.has(e), `no se dibujó ${e}`);
});

// Ninguna partícula pisa a otra (los átomos de partículas distintas no se cruzan): vale para el propano y el alcohol,
// que ahora llevan todos sus átomos, y para los iones sueltos de la sal disuelta (Gerson, 17 nov).
test('en las lupas, ninguna partícula pisa a sus vecinas', () => {
  const num = (a, k) => +a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`))[1];
  const vistos = new Set();
  let medidas = 0;
  for (const d of DE_PARTICULAS) {
    const svg = Kit.piezas[d.pieza].dibujar(d.datos, d.estado);
    if (vistos.has(svg)) continue; vistos.add(svg);
    const parts = [...svg.matchAll(/<g class="kit-particula[^"]*">([\s\S]*?)<\/g>/g)].map(m =>
      [...m[1].matchAll(/<circle([^>]*)\/>/g)].map(c => ({ x: num(c[1], 'cx'), y: num(c[1], 'cy'), r: num(c[1], 'r') })).filter(a => a.r >= 2.5));
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) for (const a of parts[i]) for (const b of parts[j]) {
      medidas++;
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r - 0.5, `${d.donde}: dos partículas se pisan en (${a.x}, ${a.y})`);
    }
  }
  assert.ok(medidas > 1000);
});

test('la sal disuelta va como iones sueltos; en el cristal y sin disolver, como par NaCl', () => {
  const disuelta = TODOS.filter(d => d.pieza === 'quim-vasos').flatMap(d => (d.datos.recipientes || []).flatMap(r => ((r.lupa && r.lupa.capas) || [])))
    .filter(c => (c.particulas || []).some(p => p.e === 'H2O') && (c.particulas || []).some(p => /^(NaCl|Na\+)$/.test(p.e)) && c.orden !== 'filas');
  assert.ok(disuelta.length > 5);
  for (const c of disuelta) {
    assert.ok(!c.particulas.some(p => p.e === 'NaCl' && p.n > 0), 'sal disuelta dibujada como par');
    const n = e => c.particulas.filter(p => p.e === e).reduce((a, p) => a + p.n, 0);
    assert.equal(n('Na+'), n('Cl-'), 'un Cl⁻ por cada Na⁺');
  }
  const m = idea('sustancia-mezcla').juega.mision.logrado;
  assert.equal(m({ echa: 'sal', t: 30 }), true, 'el motor sigue viendo una mezcla homogénea');
});

// Un color por magnitud en toda la unidad (molde §5b, lector en frío: Q naranja en el juego y violeta en la fórmula;
// ΔT y L del mismo color; ρ y 87 °C los dos violetas). Se recogen las fichas de color de lo que el alumno lee y cada
// una se clasifica por su letra o por su unidad.
function clase(t) {
  const s = String(t).trim();
  if (s === 't_1/2') return 'vida media';
  if (/_/.test(s)) return clase(s.split('_')[0]);
  const letra = { m: 'masa', 'Δm': 'masa', V: 'volumen', 'ρ': 'densidad', Q: 'calor', 'cₑ': 'por gramo', L: 'por gramo', T: 'temperatura', 'ΔT': 'temperatura', E: 'energía', c: 'luz', t: 'tiempo', n: 'vidas medias' }[s];
  if (letra) return letra;
  if (/ en cada /.test(s)) return null;
  const u = (s.match(/\d\s*([^\d\s][^\s]*)$/) || [])[1];
  return { '°C': 'temperatura', K: 'temperatura', '°F': 'temperatura', g: 'masa', kg: 'masa', mg: 'masa', mL: 'volumen', 'cm³': 'volumen',
    'g/cm³': 'densidad', 'g/mL': 'densidad', cal: 'calor', kcal: 'calor', 'cal/g': 'por gramo', 'cal/(g·°C)': 'por gramo' }[u] || null;
}
test('un color por magnitud en toda la unidad (ideas 2 a 6)', () => {
  const visto = {};
  const anota = (donde, x) => { for (const f of fichas(x)) { const k = clase(f.t); if (!k) continue; (visto[k] = visto[k] || new Map()).set(f.v, `${donde}: «${f.t}»`); } };
  for (const id of ['propiedades', 'fisico-quimico-nuclear', 'calor-sensible-latente', 'masa-energia', 'vida-media']) {
    const i = idea(id);
    i.ejemplos.forEach((e, k) => anota(`${id} ejemplo ${k + 1}`, [e.enunciado, e.datos, e.solucion, e.respuesta]));
    i.mira.pasos.forEach((p, k) => anota(`${id} mira ${k + 1}`, [p.texto, p.ecuacion]));
    anota(`${id} regla`, i.regla.ecuacion);
    anota(`${id} leyenda`, (i.juega.leyenda || []).map(x => x.s));
    for (const v of [Teoria.inicio(i.juega)]) anota(`${id} lectura`, i.juega.lectura(v));
    for (let s = 0; s < 40; s++) {
      const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
      anota(`${id} ahoraTu ${s}`, [a.pregunta, a.datos, a.solucion]);
      anota(`${id} resuelve ${s}`, [r.enunciado, r.datos, r.pasos, r.respuesta]);
    }
    for (const c of i.juega.controles || []) if (c.color) anota(`${id} control`, [{ v: c.color, t: c.etiqueta.split(', ').pop() }]);
  }
  for (const [k, m] of Object.entries(visto)) assert.equal(m.size, 1, `${k} con ${m.size} colores: ${[...m.values()].join(' | ')}`);
  assert.equal([...visto.calor.keys()][0], 'c-f'); assert.equal([...visto.temperatura.keys()][0], 'c-d');
  assert.notEqual([...visto.temperatura.keys()][0], [...visto['por gramo'].keys()][0], 'ΔT y L no comparten color');
  // Idea 6: la masa sigue en naranja; t, t₁/₂ y n tienen cada uno su color, distinto del de la masa y entre sí.
  assert.equal([...visto.masa.keys()][0], 'c-o');
  const t6 = ['tiempo', 'vida media', 'vidas medias'].map(k => { assert.ok(visto[k], `no se vio ${k}`); return [...visto[k].keys()][0]; });
  assert.equal(new Set([...t6, 'c-o']).size, 4, `t, t₁/₂, n y m con colores distintos: ${t6.join(', ')}`);
});

test('los dibujos de variables pintan Q, T y ρ con su color (juego, eje, termómetro y Mira)', () => {
  const vars = TODOS.filter(d => d.pieza === 'quim-cocina' && /calor-sensible-latente|propiedades/.test(d.donde));
  for (const d of vars) for (const o of d.datos.objetos || []) {
    if (o.tipo === 'curva' && o.colorX !== 'tinta') { assert.equal(o.colorX || 'o', 'f', `${d.donde}: eje Q violeta`); assert.equal(o.colorY || 'f', 'd', `${d.donde}: eje T verde`); }
    if (o.termometro && o.termometro !== '?' && o.colorT) assert.equal(o.colorT, 'd', `${d.donde}: termómetro en verde`);
    for (const r of o.rotulos || []) if (/^Q =/.test(r.texto) && r.color) assert.equal(r.color, 'f', d.donde);
  }
});

test('el juego de calor no muestra la meseta antes de que llegue el calor', () => {
  const j = idea('calor-sensible-latente').juega;
  for (const q of [0, 30, 60]) {   // antes de hervir (hierve desde 77 kcal)
    const curva = j.dibujo({ q }).datos.objetos.find(o => o.tipo === 'curva');
    assert.equal(curva.completa, false, 'sin la curva entera punteada');
    assert.ok(!curva.yMarcas.includes(87), 'sin la marca de 87 °C en el eje');
    assert.ok(![...Kit.piezas['quim-cocina'].dibujar(j.dibujo({ q }).datos).matchAll(/<text\b[^>]*>([^<]*)/g)].some(m => /87/.test(m[1])), `q = ${q}: el 87 se ve antes de hervir`);
  }
});

test('la regla de calor pone cada fórmula en su línea', () => {
  const ec = idea('calor-sensible-latente').regla.ecuacion;
  assert.ok(ec.includes('   ·   '), 'separador entre Q = m·cₑ·ΔT y Q = m·L');
  assert.match(Ecuacion.html(ec), /ec-sep/);
});

test('Mira de los cambios: la cuenta de átomos queda dentro del lienzo', () => {
  const T = require('../../../nucleo/kit/trazo.js');
  for (const d of TODOS.filter(x => x.pieza === 'quim-particulas')) {
    const svg = Kit.piezas['quim-particulas'].dibujar(d.datos, d.estado);
    for (const [, a, t] of svg.matchAll(/<text\b([^>]*)>([^<]*)/g)) {
      const x = +a.match(/\sx="(-?[\d.]+)"/)[1], tam = +(a.match(/font-size="([\d.]+)"/) || [0, 14])[1], w = T.ancho(t, tam, 700);
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      assert.ok(x0 >= 3.9 && x0 + w <= 316.1, `${d.donde}: «${t}» toca el borde (${x0.toFixed(1)} a ${(x0 + w).toFixed(1)})`);
    }
    // Cada número de la cuenta termina antes del átomo de la cuenta siguiente (con 3 px de aire).
    const grupos = [...svg.matchAll(/<g class="kit-cuenta[^"]*">([\s\S]*?)<\/g>/g)].map(([, g]) => {
      const cs = [...g.matchAll(/<circle([^>]*)\/>/g)].map(([, a]) => ({ x: +a.match(/cx="(-?[\d.]+)"/)[1], r: +a.match(/\sr="([\d.]+)"/)[1] }));
      const [, a, t] = g.match(/<text\b([^>]*)>([^<]*)/), x = +a.match(/\sx="(-?[\d.]+)"/)[1];
      return { izq: Math.min(...cs.map(c => c.x - c.r)), fin: x + T.ancho(t, 14, 700), t };
    });
    for (let k = 0; k + 1 < grupos.length; k++) if (grupos[k + 1].izq > grupos[k].izq)
      assert.ok(grupos[k].fin + 3 <= grupos[k + 1].izq, `${d.donde}: «${grupos[k].t}» pisa el átomo de la cuenta siguiente`);
    // Ninguna partícula se sale de su caja (el propano ya no toca el borde).
    const g = Kit.piezas['quim-particulas'].geometria(d.datos);
    for (const [, a] of svg.matchAll(/<g class="kit-particula[^"]*">([\s\S]*?)<\/g>/g)) for (const [, c] of a.matchAll(/<circle([^>]*)\/>/g)) {
      const x = +c.match(/cx="(-?[\d.]+)"/)[1], y = +c.match(/cy="(-?[\d.]+)"/)[1], r = +c.match(/\sr="([\d.]+)"/)[1];
      assert.ok(Array.from({ length: g.n }, (_, k) => k).some(k => x - r >= g.x(k) + 2 && x + r <= g.x(k) + g.ancho - 2) && y - r >= g.y0 + 2 && y + r <= g.y1 - 2, `${d.donde}: un átomo toca o sale de su caja en (${x}, ${y})`);
    }
  }
});

test('ejemplos de la idea 5: el cuadrado de c a la vista donde se usa (o dado en los datos)', () => {
  const i = idea('masa-energia');
  for (const [k, e] of i.ejemplos.entries()) {
    const txt = [e.solucion.map(x => [x.texto, x.ecuacion])].flat(3).filter(Boolean);
    const usaC2 = JSON.stringify(e.solucion).includes('"16"'), daC2 = JSON.stringify(e.datos).includes('c²') && JSON.stringify(e.datos).includes('"16"');
    if (usaC2 && !daC2) assert.ok(/\(3 × 10/.test(JSON.stringify(e.solucion)) || /\(3 × 10/.test(JSON.stringify(e.datos)), `ejemplo ${k + 1}: usa c² sin mostrar (3 × 10⁸)²`);
    void txt;
  }
});

test('«Ahora tú» de los cambios no repite el gas que arde de Mira', () => {
  for (let s = 0; s < 60; s++) assert.ok(!/gas natural|hornilla/.test(txt(idea('fisico-quimico-nuclear').ahoraTu.generar(s).pregunta)), `semilla ${s}`);
});

// ---------- Idea 6: vida media (17 nov) ----------
// Cálculo independiente (escrito aquí, sin el motor): tras n = t/T vidas medias queda m0 · (1/2)ⁿ.
test('idea 6: el motor de la vida media cuadra con el cálculo independiente, y el juego cuenta los átomos con él', () => {
  const Motor = require('../../../plantillas/materia-energia/motor.js');
  for (const [m0, T, t] of [[80, 30, 90], [40, 5.3, 15.9], [16, 5730, 11460], [100, 6, 18], [64, 30, 150]]) {
    let q = m0; for (let k = 0; k < Math.round(t / T); k++) q /= 2;
    const d = Motor.desintegracion({ m0, tMedia: T, t });
    assert.ok(Math.abs(d.queda - q) < 1e-9 && Math.abs(d.desintegrado - (m0 - q)) < 1e-9, `${m0}, ${T}, ${t}: ${d.queda} contra ${q}`);
  }
  const j = idea('vida-media').juega;
  const cuenta = v => { const l = j.dibujo(v).datos.recipientes[1].lupa.capas[0].particulas; return [l.find(p => p.e === 'C').n, l.find(p => p.e === 'N').n]; };
  assert.deepEqual(cuenta({ t: 0 }), [16, 0]);
  assert.deepEqual(cuenta({ t: 5730 }), [8, 8]);
  const p = idea('vida-media').predice.revelar.datos.recipientes[2].lupa.capas[0].particulas;
  assert.equal(p.find(x => x.e === 'C').n, 4, 'en dos vidas medias quedan 4 de 16 (no 0)');
  // El juego no llega a la segunda vida media: es la predicción.
  assert.ok(j.controles[0].max <= 5730);
});

test('idea 6: la predicción tiene a «se acaba» entre sus opciones y su correcta es 4', () => {
  const o = idea('vida-media').predice.opciones;
  assert.match(o.find(x => x.correcta).texto, /^4/);
  assert.ok(o.some(x => /^0/.test(x.texto) && x.error === 'AQ-vm-lineal'));
  for (const x of o.filter(y => !y.correcta)) assert.ok(/(bien|cierto)\./.test(x.siFuera.split('Pero')[0]), `«${x.siFuera}» empieza por lo que el alumno hizo bien`);
});

test('idea 6: cada «Ahora tú» trae la vida media o la manera de hallarla, y la fórmula, sin la respuesta en los datos', () => {
  const i = idea('vida-media');
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), ds = a.datos.map(txt).join(' | '), cor = txt(a.opciones.find(o => o.correcta).texto);
    assert.ok(/Vida media del|Vida media: tiempo/.test(ds), `semilla ${s}: falta la vida media o su definición`);
    if (!a.dibujo) assert.ok(/2n|n = t/.test(ds), `semilla ${s}: falta la fórmula`);   // con la curva se lee la vida media: basta su definición
    assert.ok(!ds.includes(cor), `semilla ${s}: los datos traen la respuesta ${cor}`);
  }
});
