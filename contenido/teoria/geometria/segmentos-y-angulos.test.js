// Pruebas propias de «Segmentos y ángulos» (además del validador común de contenido/teoria/teoria.test.js):
//   - la idea 1 cumple el contrato completo (calidad 2: misión, leyenda, pregunta, aprendizaje, actividad, datos en todo
//     ejercicio, 2 a 4 palabras con simple y 3 ejemplos por término), aunque la unidad todavía no declare calidad 2
//     porque las ideas 2 a 6 esperan su turno (docs/etapa3/decisiones.md: primero la idea 1, para el visto bueno);
//   - regla de colores de la unidad (comentario de cabecera; molde §5b con la decisión de la etapa 3): en cada figura de la
//     pieza geo-objeto, el color de un tramo sale de su papel: el todo y lo que se pide en tinta, los datos naranja el
//     primero y turquesa el segundo, nunca violeta; lo pedido lleva «?». Si un tramo cambia de color, la prueba falla;
//   - el texto de cada ejercicio pinta cada tramo con el color que tiene en su figura (o no lo pinta, si va en tinta), no
//     lo deja sin color si la figura lo pinta, y nunca pone violeta en el enunciado: el violeta es de la respuesta;
//   - sin figura, ningún tramo lleva color (el color diría cuál es el de punta a punta);
//   - las medidas de los rótulos van a escala con los puntos (la figura es fiel);
//   - «Ahora tú» trae siempre cuatro opciones distintas y una correcta, en 400 semillas, y sus datos no traen la respuesta.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const def = require('./segmentos-y-angulos.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['geo-objeto'];
const SEMILLAS = 400;
const idea1 = def.ideas.find(i => i.id === 'suma-de-segmentos');

test('la idea 1 es la primera y cumple el contrato completo (calidad 2)', () => {
  assert.equal(def.ideas[0], idea1);
  const suyos = new Set(Glosario.porIdea(def)[0].map(e => e.termino));
  const sola = Object.assign({}, def, { calidad: 2, ideas: [idea1], glosario: def.glosario.filter(g => suyos.has(g.termino)), laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sola, { semillas: SEMILLAS });
  assert.deepEqual(p, [], p.join('\n'));
  assert.ok(suyos.size >= 2 && suyos.size <= 4, [...suyos].join(', '));
});

// Todos los ejercicios y figuras de la idea 1: { donde, ejercicio, figura (datos de geo-objeto o null), textos }.
// textos: [{ parte: 'enunciado' | 'solucion', x }] con el texto en partes de nucleo/ecuacion.js.
function piezas() {
  const out = [];
  const add = (donde, ejercicio, dib, textos) => out.push({ donde, ejercicio, figura: dib && dib.datos ? dib.datos : null, estado: (dib && dib.estado) || {}, textos });
  const j = idea1.juega, base = Teoria.inicio(j);
  for (const v of Teoria.grilla(j.controles)) add(`juego ${JSON.stringify(v)}`, false, j.dibujo(Object.assign({}, base, v)), [{ parte: 'solucion', x: j.lectura(Object.assign({}, base, v)) }]);
  for (const [i, t] of idea1.lee.tarjetas.entries()) add(`lee ${i + 1}`, false, t.dibujo, [{ parte: 'solucion', x: t.texto }]);
  add('predice', false, idea1.predice.dibujo, [{ parte: 'enunciado', x: idea1.predice.pregunta }, ...idea1.predice.datos.map(x => ({ parte: 'enunciado', x }))]);
  add('revelar', false, idea1.predice.revelar, []);
  idea1.mira.pasos.forEach((ps, i) => add(`mira ${i + 1}`, false, { datos: idea1.mira.datos, estado: ps.estado }, [{ parte: 'solucion', x: ps.texto }, { parte: 'solucion', x: ps.ecuacion || [] }]));
  for (const [k, e] of idea1.ejemplos.entries()) add(`ejemplo ${k + 1} «${e.titulo}»`, true, e.figura, [
    { parte: 'enunciado', x: e.enunciado }, ...e.datos.map(x => ({ parte: 'enunciado', x })),
    ...e.solucion.flatMap(l => [{ parte: 'solucion', x: l.texto }, { parte: 'solucion', x: l.ecuacion || [] }]), { parte: 'solucion', x: e.respuesta }]);
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea1.ahoraTu.generar(s);
    add(`ahora tú ${s}`, true, a.dibujo, [{ parte: 'enunciado', x: a.pregunta }, ...a.datos.map(x => ({ parte: 'enunciado', x })),
      ...a.opciones.map(o => ({ parte: 'solucion', x: o.texto })), { parte: 'solucion', x: a.solucion.texto }, { parte: 'solucion', x: a.solucion.ecuacion || [] }]);
    const r = idea1.resuelve.generar(s);
    add(`resuelve ${s}`, true, r.dibujo, [{ parte: 'enunciado', x: r.enunciado }, ...r.datos.map(x => ({ parte: 'enunciado', x })),
      ...r.pasos.flatMap(p => [{ parte: 'solucion', x: p.texto }, { parte: 'solucion', x: p.ecuacion || [] }]), { parte: 'solucion', x: r.respuesta }]);
  }
  return out;
}
const TODO = piezas();
// Las partes con color de un texto: [{ t, v }]; y el texto plano de las partes sin color.
function partes(x, con = [], sin = []) {
  if (x === null || x === undefined) return { con, sin };
  if (typeof x === 'string') { sin.push(x); return { con, sin }; }
  if (Array.isArray(x)) { x.forEach(y => partes(y, con, sin)); return { con, sin }; }
  if (typeof x === 'object' && 'v' in x) { con.push({ t: String(x.t).replace(/[⁠ ]/g, ''), v: x.v }); return { con, sin }; }
  if (typeof x === 'object') for (const v of Object.values(x)) partes(v, con, sin);
  return { con, sin };
}
const clave = s => s.split('').sort().join('');
const ES_TRAMO = /^[A-Z]{2}$/;

test('hay figuras y ejercicios de sobra (la prueba no corre en vacío)', () => {
  assert.ok(TODO.filter(x => x.figura).length > 600, `${TODO.length}`);
  assert.ok(TODO.some(x => x.ejercicio && !x.figura), 'hay ejercicios sin figura (qué punto está entre los otros)');
});

test('colores de la figura: el todo y lo pedido en tinta, los datos naranja y turquesa en orden, nunca violeta', () => {
  const mal = [];
  for (const it of TODO.filter(x => x.figura)) {
    const d = it.figura, cs = P.colores(d), svg = P.dibujar(d, Object.assign({ final: true }, it.estado));
    if (/var\(--c-f\)/.test(svg)) mal.push(`${it.donde}: violeta en la figura`);
    const datos = (d.tramos || []).filter(t => (t.papel || 'dato') === 'dato');
    if (datos.length > 2) mal.push(`${it.donde}: ${datos.length} tramos de dato (van como máximo dos: naranja y turquesa)`);
    for (const t of d.tramos || []) {
      const nom = `${t.de}${t.a}`, papel = t.papel || 'dato', c = cs[nom];
      const textos = Array.isArray(t.texto) ? t.texto.map(x => x.t) : [t.texto];
      const conQ = textos.some(x => typeof x === 'string' && /\?$/.test(x));
      if (conQ && papel !== 'pide') mal.push(`${it.donde}: ${nom} lleva «?» pero no es lo que se pide`);
      if (papel === 'pide' && !conQ) mal.push(`${it.donde}: ${nom} se pide y no lleva «?»`);
      if ((papel === 'todo' || papel === 'pide') && c) mal.push(`${it.donde}: ${nom} (${papel}) va en ${c}; le toca tinta`);
    }
    // El orden de los datos: el primero de la carretera naranja, el segundo turquesa.
    const orden = datos.map(t => { const a = d.puntos.find(p => p.id === t.de).km, b = d.puntos.find(p => p.id === t.a).km; return { nom: `${t.de}${t.a}`, lo: Math.min(a, b), hi: Math.max(a, b) }; })
      .sort((x, y) => x.lo - y.lo || x.hi - y.hi);
    orden.forEach((x, k) => { if (cs[x.nom] !== ['o', 'i'][k]) mal.push(`${it.donde}: ${x.nom} es el dato ${k + 1} y va en ${cs[x.nom]}`); });
  }
  assert.deepEqual(mal.slice(0, 20), []);
});

test('el texto pinta cada tramo con el color de su figura, y sin violeta en el enunciado', () => {
  const mal = [];
  for (const it of TODO) {
    const cs = it.figura ? P.colores(it.figura) : {};
    const colorFig = nom => { for (const [k, c] of Object.entries(cs)) if (clave(k) === clave(nom)) return c || 'tinta'; return undefined; };
    const vistos = {};
    for (const { parte, x } of it.textos) {
      const { con, sin } = partes(x);
      for (const p of con) {
        if (parte === 'enunciado' && p.v === 'c-f') mal.push(`${it.donde}: violeta en el enunciado («${p.t}»)`);
        if (!ES_TRAMO.test(p.t) || p.v === 'c-f') continue;
        const c = p.v.slice(2), fig = colorFig(p.t);
        if (!it.figura && it.ejercicio) mal.push(`${it.donde}: ${p.t} en ${c} sin figura (el color diría cuál es el de punta a punta)`);
        if (fig && fig !== c) mal.push(`${it.donde}: ${p.t} va en ${c} en el texto y en ${fig} en la figura`);
        if (vistos[clave(p.t)] && vistos[clave(p.t)] !== c) mal.push(`${it.donde}: ${p.t} con dos colores`);
        vistos[clave(p.t)] = c;
      }
      // Un tramo que la figura pinta no aparece sin su color.
      for (const s of sin) for (const m of s.matchAll(/(?<![A-Za-z])([A-D]{2})(?![A-Za-z])/g)) {
        const fig = colorFig(m[1]);
        if (fig && fig !== 'tinta') mal.push(`${it.donde}: «${m[1]}» sin color; en la figura va en ${fig}`);
      }
    }
  }
  assert.deepEqual(mal.slice(0, 20), []);
});

test('fidelidad: las medidas de los rótulos van a escala con los puntos de la figura', () => {
  const U = { km: 1000, m: 1, cm: 0.01 };
  const mal = [];
  for (const it of TODO.filter(x => x.figura)) {
    const d = it.figura, razones = [];
    for (const t of d.tramos || []) {
      const textos = (Array.isArray(t.texto) ? t.texto.map(x => x.t) : [t.texto]).filter(Boolean);
      const a = d.puntos.find(p => p.id === t.de), b = d.puntos.find(p => p.id === t.a);
      const dist = Math.hypot(a.km - b.km, (a.alto || 0) - (b.alto || 0));
      for (const tx of textos) {
        const m = /^≈?\s*([\d\s]+(?:,\d+)?)\s*(km|m|cm)$/.exec(tx);
        if (!m) continue;
        const valor = +m[1].replace(/\s/g, '').replace(',', '.') * U[m[2]];
        if (dist === 0) { if (valor !== 0) mal.push(`${it.donde}: ${t.de}${t.a} mide 0 en el dibujo y dice ${tx}`); continue; }
        razones.push({ r: valor / dist, aprox: tx.startsWith('≈'), tx });
      }
    }
    const exactas = razones.filter(x => !x.aprox);
    for (const x of razones) if (exactas.length && Math.abs(x.r / exactas[0].r - 1) > (x.aprox ? 0.02 : 1e-9)) mal.push(`${it.donde}: «${x.tx}» no va a escala con «${exactas[0].tx}»`);
  }
  assert.deepEqual(mal.slice(0, 20), []);
});

test('«Ahora tú»: cuatro opciones distintas, una correcta, y los datos no traen la respuesta (400 semillas)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const c = idea1.ahoraTu.generar(s), ops = c.opciones;
    assert.equal(ops.length, 4, `semilla ${s}`);
    assert.equal(new Set(ops.map(o => Teoria.plano(o.texto))).size, 4, `semilla ${s}`);
    assert.equal(ops.filter(o => o.correcta).length, 1, `semilla ${s}`);
    const bien = Teoria.plano(ops.find(o => o.correcta).texto);
    for (const dt of c.datos) assert.ok(!Teoria.plano(dt).includes(bien), `semilla ${s}: los datos dicen «${bien}»`);
  }
});

test('la predicción no usa Pitágoras ni da la fórmula; ninguna figura de predicción o ejemplo lleva la respuesta', () => {
  const p = idea1.predice;
  for (const dt of p.datos) assert.ok(!/√|²|Pitágoras|hipotenusa|=/.test(Teoria.plano(dt)), Teoria.plano(dt));
  const svg = P.dibujar(p.dibujo.datos, p.dibujo.estado);
  assert.ok(!/11,7|6,7|>5 km</.test(svg), 'la figura de la predicción no trae los caminos medidos');
  for (const e of idea1.ejemplos) if (e.figura) {
    const s = P.dibujar(e.figura.datos, e.figura.estado), resp = Teoria.plano(e.respuesta).replace(/[⁠ ]/g, '');
    for (const m of resp.matchAll(/(\d+(?:,\d+)?) ?(km|m|cm)/g)) assert.ok(!s.includes(`>${m[1]} ${m[2]}<`), `ejemplo «${e.titulo}»: la figura dice ${m[0]}`);
  }
});
