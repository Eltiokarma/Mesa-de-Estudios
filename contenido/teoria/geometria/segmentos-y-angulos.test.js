// Pruebas propias de «Segmentos y ángulos» (además del validador común de contenido/teoria/teoria.test.js):
//   - la unidad entera cumple el contrato (calidad 2) con 400 semillas en «Ahora tú»;
//   - regla de colores de la unidad (comentario de cabecera; molde §5b con la decisión de la etapa 3):
//     · segmentos (ideas 1 y 2, pieza geo-objeto de una recta): el color de un tramo sale de su papel: el todo, lo
//       pedido, las mitades y las medidas que se leen en tinta; los datos, naranja el primero y turquesa el segundo; lo
//       pedido lleva «?»; el texto pinta cada tramo con el color de su figura y nunca pone violeta en el enunciado;
//     · ángulos (ideas 3 a 6, escenas de geo-objeto): en los ejercicios (ejemplos, «Así se resuelve» y «Ahora tú») todo
//       ángulo dado va en carmín y lo pedido («?», «x») en tinta, sin turquesa (diría si es igual o suplementario); en el
//       juego, «Lee», la predicción y «Mira», igual medida lleva igual color (carmín el dado y sus iguales, turquesa el
//       compañero); nunca violeta en una figura;
//   - fidelidad: las medidas de los rótulos van a escala (segmentos, con los puntos; ángulos, medidos en el dibujo contra
//     su rótulo o su valor `mide`, con 0,5° de tolerancia);
//   - C(x) y S(x): ninguna figura de la idea 4 (ni de un ejercicio que los use) tiene un punto llamado C o S;
//   - «Ahora tú» trae siempre cuatro opciones distintas y una correcta, en 400 semillas, y sus datos no traen la respuesta;
//   - ninguna figura de predicción, ejemplo o «Ahora tú» trae la respuesta (salvo que el enunciado ya diga ese número).
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
const G = Kit.piezas['geo-figura'];
const ESC = d => P.ESCENAS.includes(d.objeto);

test('las seis ideas en orden, y la unidad entera cumple el contrato (calidad 2, 400 semillas)', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['suma-de-segmentos', 'punto-medio', 'abertura', 'bisectrices', 'paralelas', 'quiebre']);
  assert.equal(def.calidad, 2);
  const p = Teoria.problemas(def, { semillas: SEMILLAS });
  assert.deepEqual(p, [], p.join('\n'));
  assert.ok(def.glosario.length <= 30, `${def.glosario.length} términos (tope 30)`);
  for (const es of Glosario.porIdea(def)) assert.ok(es.filter(e => e.simple).length >= 2 && es.filter(e => e.simple).length <= 4);
});

// Todos los ejercicios y figuras de la unidad: { idea, donde, ejercicio, momento, figura (datos de geo-objeto o null),
// estado, textos }. textos: [{ parte: 'enunciado' | 'solucion', x }] con el texto en partes de nucleo/ecuacion.js.
function piezas() {
  const out = [];
  for (const [k, idea] of def.ideas.entries()) {
    const add = (donde, ejercicio, momento, dib, textos) => out.push({ idea: k + 1, donde: `idea ${k + 1} ${donde}`, ejercicio, momento, figura: dib && dib.datos ? dib.datos : null, estado: (dib && dib.estado) || {}, textos });
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles)) add(`juego ${JSON.stringify(v)}`, false, 'juego', j.dibujo(Object.assign({}, base, v)), [{ parte: 'solucion', x: j.lectura(Object.assign({}, base, v)) }]);
    for (const [i, t] of idea.lee.tarjetas.entries()) add(`lee ${i + 1}`, false, 'lee', t.dibujo, [{ parte: 'solucion', x: t.texto }]);
    add('predice', false, 'predice', idea.predice.dibujo, [{ parte: 'enunciado', x: idea.predice.pregunta }, ...idea.predice.datos.map(x => ({ parte: 'enunciado', x }))]);
    add('revelar', false, 'revelar', idea.predice.revelar, []);
    idea.mira.pasos.forEach((ps, i) => add(`mira ${i + 1}`, false, 'mira', { datos: idea.mira.datos, estado: ps.estado }, [{ parte: 'solucion', x: ps.texto }, { parte: 'solucion', x: ps.ecuacion || [] }]));
    for (const [i, e] of idea.ejemplos.entries()) add(`ejemplo ${i + 1} «${e.titulo}»`, true, 'ejemplo', e.figura, [
      { parte: 'enunciado', x: e.enunciado }, ...e.datos.map(x => ({ parte: 'enunciado', x })),
      ...e.solucion.flatMap(l => [{ parte: 'solucion', x: l.texto }, { parte: 'solucion', x: l.ecuacion || [] }]), { parte: 'solucion', x: e.respuesta }]);
    for (let s = 0; s < SEMILLAS; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`ahora tú ${s}`, true, 'ahora', a.dibujo, [{ parte: 'enunciado', x: a.pregunta }, ...a.datos.map(x => ({ parte: 'enunciado', x })),
        ...a.opciones.map(o => ({ parte: 'solucion', x: o.texto })), { parte: 'solucion', x: a.solucion.texto }, { parte: 'solucion', x: a.solucion.ecuacion || [] }]);
      const r = idea.resuelve.generar(s);
      add(`resuelve ${s}`, true, 'resuelve', r.dibujo, [{ parte: 'enunciado', x: r.enunciado }, ...r.datos.map(x => ({ parte: 'enunciado', x })),
        ...r.pasos.flatMap(p => [{ parte: 'solucion', x: p.texto }, { parte: 'solucion', x: p.ecuacion || [] }]), { parte: 'solucion', x: r.respuesta }]);
    }
  }
  return out;
}
const TODO = piezas();
const RECTA = TODO.filter(x => !x.figura || !ESC(x.figura)), ANG = TODO.filter(x => x.figura && ESC(x.figura));
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
  assert.ok(RECTA.filter(x => x.figura).length > 1200, `${RECTA.length}`);
  assert.ok(ANG.length > 2500, `${ANG.length}`);
  assert.ok(TODO.some(x => x.ejercicio && !x.figura), 'hay ejercicios sin figura (qué punto está entre los otros)');
});

test('colores de la figura: el todo y lo pedido en tinta, los datos naranja y turquesa en orden, nunca violeta', () => {
  const mal = [];
  for (const it of RECTA.filter(x => x.figura)) {
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
  for (const it of RECTA.filter(x => x.idea <= 2)) {
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
      for (const s of sin) for (const m of s.matchAll(/(?<![A-Za-zÁ-ú∠])([A-DMNO]{2})(?![A-Za-z])/g)) {
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
  for (const it of RECTA.filter(x => x.figura)) {
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

test('«Ahora tú»: cuatro opciones distintas, una correcta, y los datos no traen la respuesta (400 semillas, seis ideas)', () => {
  for (const idea of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = idea.ahoraTu.generar(s), ops = c.opciones, d = `${idea.id} semilla ${s}`;
    assert.equal(ops.length, 4, d);
    assert.equal(new Set(ops.map(o => Teoria.plano(o.texto))).size, 4, d);
    assert.equal(ops.filter(o => o.correcta).length, 1, d);
    for (const o of ops) if (!o.correcta) assert.ok(o.error && o.siFuera, `${d}: la opción «${Teoria.plano(o.texto)}» sin error o sin siFuera`);
    const bien = Teoria.plano(ops.find(o => o.correcta).texto);
    const esc = bien.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), re = new RegExp(`(?<![\\d,])${esc}(?![\\d,])`);
    for (const dt of c.datos) assert.ok(!/\d/.test(bien) || !re.test(Teoria.plano(dt)), `${d}: los datos dicen «${bien}»`);
  }
});

test('la predicción de la idea 1 no usa Pitágoras; ninguna figura de predicción, ejemplo o «Ahora tú» trae la respuesta', () => {
  const p = idea1.predice;
  for (const dt of p.datos) assert.ok(!/√|²|Pitágoras|hipotenusa|=/.test(Teoria.plano(dt)), Teoria.plano(dt));
  const svg = P.dibujar(p.dibujo.datos, p.dibujo.estado);
  assert.ok(!/11,7|6,7|>5 km</.test(svg), 'la figura de la predicción no trae los caminos medidos');
  // Los números con unidad o «°» de la respuesta no están en la figura, salvo que el enunciado ya los diga.
  const numeros = x => [...Teoria.plano(x).replace(/[⁠ ]/g, ' ').matchAll(/(\d+(?:,\d+)?) ?(km|m|cm|°)/g)].map(m => `${m[1]}${m[2] === '°' ? '°' : ' ' + m[2]}`);
  const revisa = (donde, fig, resp, enun) => {
    if (!fig) return;
    const s = P.dibujar(fig.datos, fig.estado || {}), dice = new Set(numeros(enun));
    for (const n of numeros(resp)) if (!dice.has(n)) assert.ok(!s.includes(`>${n}<`), `${donde}: la figura dice ${n}`);
  };
  for (const idea of def.ideas) {
    const pr = idea.predice, ok = pr.opciones.find(o => o.correcta);
    revisa(`${idea.id} predice`, pr.dibujo, ok.texto, [pr.pregunta, ...pr.datos]);
    for (const e of idea.ejemplos) revisa(`${idea.id} «${e.titulo}»`, e.figura, e.respuesta, [e.enunciado, ...e.datos]);
    for (let s = 0; s < SEMILLAS; s++) { const a = idea.ahoraTu.generar(s); revisa(`${idea.id} ahora tú ${s}`, a.dibujo, a.opciones.find(o => o.correcta).texto, [a.pregunta, ...a.datos]); }
  }
});

// ---------- Ángulos (ideas 3 a 6) ----------
// Cada ángulo de una escena, con su medida en el dibujo (geo-figura, a escala) y lo que dice.
function angulosDe(d) {
  const fig = P.escena(d).fig, g = G.geometria(fig);
  return (fig.angulos || []).map(an => {
    let m = G.util.angulo(g.P(an.en), g.P(an.de), g.P(an.a)); if (an.mayor) m = 360 - m;
    return { an, m, texto: an.texto === undefined || an.texto === null ? '' : String(an.texto), color: an.color || 'tinta', fig };
  });
}
// Lo pedido: «?» o una sola letra en tinta (la incógnita). Un ángulo dado puede llevar letra o expresión (2x, θ), en carmín.
const PEDIDO = t => /^\?$|\?$/.test(t);
const INCOGNITA = t => /^[a-zθ]$/.test(t);

test('fidelidad de los ángulos: cada uno mide en el dibujo lo que dice su rótulo o su valor (±0,5°)', () => {
  const mal = [];
  for (const it of ANG) for (const z of angulosDe(it.figura)) {
    const num = /^(\d+(?:,\d+)?)°$/.exec(z.texto), esp = num ? +num[1].replace(',', '.') : z.an.mide;
    if (esp === undefined) { if (z.texto && !PEDIDO(z.texto) && !INCOGNITA(z.texto)) mal.push(`${it.donde}: «${z.texto}» sin mide`); continue; }
    if (Math.abs(z.m - esp) > 0.5) mal.push(`${it.donde}: «${z.texto || '(arco)'}» mide ${z.m.toFixed(2)}° en el dibujo y debería medir ${esp}°`);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('colores de los ángulos: en los ejercicios, lo dado en carmín y lo pedido en tinta; igual medida, igual color; nunca violeta', () => {
  const mal = [];
  for (const it of ANG) {
    const zs = angulosDe(it.figura).filter(z => z.texto || z.color !== 'tinta');
    const svg = P.dibujar(it.figura, Object.assign({ corte: 9 }, it.estado));
    if (/var\(--c-f\)/.test(svg)) mal.push(`${it.donde}: violeta en la figura`);
    for (const z of zs) if (!['h', 'i', 'tinta'].includes(z.color)) mal.push(`${it.donde}: «${z.texto}» en ${z.color}`);
    if (it.ejercicio) {
      for (const z of zs.filter(x => x.texto)) {
        if (PEDIDO(z.texto) && z.color !== 'tinta') mal.push(`${it.donde}: lo pedido («${z.texto}») va en ${z.color}`);
        if (!PEDIDO(z.texto) && !(z.color === 'h' || (z.color === 'tinta' && INCOGNITA(z.texto)))) mal.push(`${it.donde}: el dato «${z.texto}» va en ${z.color}; todo ángulo dado, en carmín`);
      }
    } else if (it.idea === 4 || it.idea === 5) {
      // Igual medida, igual color, entre los ángulos con color (el dado y sus iguales, carmín; su compañero, turquesa).
      const col = zs.filter(z => z.color !== 'tinta'), por = {};
      for (const z of col) { const k = Math.round(z.m); (por[k] = por[k] || new Set()).add(z.color); }
      for (const [k, cs] of Object.entries(por)) if (cs.size > 1 && +k !== 90) mal.push(`${it.donde}: ángulos de ${k}° con dos colores`);
      const turq = col.filter(z => z.color === 'i'), carm = col.filter(z => z.color === 'h');
      for (const t of turq) if (carm.some(c => Math.abs(c.m - t.m) < 0.5 && Math.round(t.m) !== 90)) mal.push(`${it.donde}: un turquesa mide lo mismo que un carmín`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('C(x) y S(x): ninguna figura de la idea 4, ni de un ejercicio que los use, tiene un punto llamado C o S', () => {
  const mal = [];
  for (const it of ANG) {
    const usa = it.idea === 4 || it.textos.some(t => /\b[CS]\(/.test(Teoria.plano(t.x)));
    if (!usa) continue;
    const fig = P.escena(it.figura).fig;
    for (const q of fig.puntos || []) if (q.rotulo === 'C' || q.rotulo === 'S') mal.push(`${it.donde}: punto ${q.rotulo}`);
  }
  for (const idea of def.ideas.slice(3, 4)) for (const e of idea.ejemplos) assert.ok(!/\bm∠[A-Z]*[CS][A-Z]*\b/.test(Teoria.plano(e.enunciado)), e.titulo);
  assert.deepEqual(mal, []);
});

test('los juegos de ángulos: la misión no está cumplida al abrir y los arrastres devuelven valores del control', () => {
  for (const idea of def.ideas.slice(2)) {
    const j = idea.juega, v = Teoria.inicio(j);
    assert.ok(!j.mision.logrado(v), idea.id);
    for (const a of j.arrastres || []) {
      const pt = a.donde(v), nv = a.mover(pt, v);
      for (const [k, x] of Object.entries(nv)) assert.ok(Math.abs(x - v[k]) < 1, `${idea.id} ${a.id}: arrastrar sin mover cambia ${k} de ${v[k]} a ${x}`);
    }
  }
});

// ---------- Correcciones de la auditoría (17 nov): la prueba que habría detectado cada hallazgo ----------
const T = require('../../../nucleo/kit/trazo.js');
const plano = x => Teoria.plano(x).replace(/[⁠ ]/g, ' ');
const RAD = Math.PI / 180;

test('A1: con «OB queda entre OA y OC», ∠AOC es el convexo que contiene a OB: la suma no pasa de 180° (400 semillas)', () => {
  const idea = def.ideas.find(i => i.id === 'abertura'), clase = g => (g < 90 ? 'agudo' : g === 90 ? 'recto' : g < 180 ? 'obtuso' : g === 180 ? 'llano' : 'no convexo');
  let vistos = 0;
  for (let s = 0; s < SEMILLAS + 200; s++) {
    const c = idea.ahoraTu.generar(s), q = plano(c.pregunta);
    if (!/OB queda entre OA y OC/.test(q)) continue;
    vistos++;
    const [, a, b] = q.match(/m∠AOB = (\d+)° y m∠BOC = (\d+)°/).map(Number);
    assert.ok(a + b <= 180, `semilla ${s}: ${a}° + ${b}° pasa de 180° y OB no queda entre OA y OC`);
    assert.equal(plano(c.opciones.find(o => o.correcta).texto), clase(a + b), `semilla ${s}`);
  }
  assert.ok(vistos > 100, `${vistos} casos`);
});

// Un rótulo con una letra («2x + 20°», «3k», «x + 3»): su coeficiente, su letra y su número.
const EXPR = /^(\d*)([a-zθ])(?:\s*([+−-])\s*(\d+(?:,\d+)?)°?)?$/;
function leeExpr(t) {
  const m = EXPR.exec(String(t || '').trim());
  if (!m) return null;
  const k = m[1] ? +m[1] : 1, c = m[4] ? +m[4].replace(',', '.') * (m[3] === '+' ? 1 : -1) : 0;
  return { letra: m[2], k, c, valor: medida => (medida - c) / k };
}
// El valor de la letra que da la solución de un ejemplo: «x = 30°» en la respuesta o en una ecuación.
function valorSolucion(e, letra) {
  const textos = [plano(e.respuesta), ...e.solucion.map(l => plano(l.ecuacion || ''))];
  for (const t of textos) { const m = new RegExp(`(?:^|[\\s→(])${letra} = (\\d+(?:,\\d+)?)°?(?![\\d,])`).exec(t); if (m) return +m[1].replace(',', '.'); }
  return null;
}
test('A2: los rótulos con una letra valen, con un mismo valor de la letra (el de la solución), lo que se dibuja', () => {
  const mal = [];
  const revisa = (donde, medidas, e) => {
    const por = {};
    for (const { t, m } of medidas) { const x = leeExpr(t); if (x) (por[x.letra] = por[x.letra] || []).push({ t, v: x.valor(m) }); }
    for (const [letra, vs] of Object.entries(por)) {
      for (const z of vs) if (Math.abs(z.v - vs[0].v) > 0.05) mal.push(`${donde}: con «${vs[0].t}», ${letra} = ${vs[0].v.toFixed(2)}; con «${z.t}», ${letra} = ${z.v.toFixed(2)}`);
      const sol = e && valorSolucion(e, letra);
      if (sol !== null && sol !== undefined && Math.abs(sol - vs[0].v) > 0.05) mal.push(`${donde}: la solución da ${letra} = ${sol} y el dibujo, ${letra} = ${vs[0].v.toFixed(2)}`);
    }
  };
  for (const it of ANG) revisa(it.donde, angulosDe(it.figura).map(z => ({ t: z.texto, m: z.m })), null);
  for (const it of RECTA.filter(x => x.figura)) {
    const d = it.figura, km = id => d.puntos.find(p => p.id === id).km;
    revisa(it.donde, (d.tramos || []).map(t => ({ t: Array.isArray(t.texto) ? '' : t.texto, m: Math.abs(km(t.a) - km(t.de)) })), null);
  }
  // Con la solución: los ejemplos.
  for (const idea of def.ideas) for (const e of idea.ejemplos) {
    if (!e.figura) continue;
    const d = e.figura.datos;
    const medidas = ESC(d) ? angulosDe(d).map(z => ({ t: z.texto, m: z.m })) : (d.tramos || []).map(t => ({ t: t.texto, m: Math.abs(d.puntos.find(p => p.id === t.a).km - d.puntos.find(p => p.id === t.de).km) }));
    revisa(`${idea.id} «${e.titulo}»`, medidas, e);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('A3: la predicción de la idea 1 vale sin Pitágoras (para B a 3 km de la carretera frente a cualquier km) y «Mira» no da una regla falsa', () => {
  const p = idea1.predice, bien = plano(p.opciones.find(o => o.correcta).texto);
  const mas = /[Mm]ás de (\d+) km/.exec(bien), menos = /menos de (\d+) km/.exec(bien);
  for (let x = -5; x <= 15; x += 0.5) {
    const camino = Math.hypot(x, 3) + Math.hypot(10 - x, 3);
    if (mas) assert.ok(camino > +mas[1], `con B frente al km ${x}`);
    if (menos) assert.ok(camino < +menos[1], `«${bien}» es falso con B frente al km ${x}: el camino mide ${camino.toFixed(2)} km`);
  }
  for (const ps of idea1.mira.pasos) assert.ok(!/\b13\b/.test(plano(ps.texto) + plano(ps.ecuacion || '')), plano(ps.texto));
  assert.ok(!/\b13\b/.test(p.coincide), p.coincide);
});

test('M1: «Ahora tú» practica cada parte de la regla (400 semillas)', () => {
  const PARTES = { 'punto-medio': [/punto medio|equidistante/], abertura: [/clase/, /reloj/, /vuelta/], bisectrices: [/complemento/, /suplemento/, /bisectri/], paralelas: [/∥|paralelas/], quiebre: [/quiebre/, /dobla dos veces/] };
  for (const [id, partes] of Object.entries(PARTES)) {
    const idea = def.ideas.find(i => i.id === id), qs = Array.from({ length: SEMILLAS }, (_, s) => plano(idea.ahoraTu.generar(s).pregunta));
    for (const re of partes) assert.ok(qs.filter(q => re.test(q)).length >= SEMILLAS / 8, `${id}: ninguna (o casi ninguna) pregunta de «Ahora tú» practica ${re}`);
  }
});

test('M2: las letras de la regla son los puntos de su figura (la del último paso de «Mira»), y sus igualdades se cumplen en ella', () => {
  for (const idea of def.ideas.slice(0, 2)) {
    const d = idea.mira.datos, km = Object.fromEntries(d.puntos.map(p => [p.id, p.km])), r = idea.regla;
    const txt = [r.texto, r.ecuacion, r.condicion].map(plano).join(' ');
    for (const m of txt.matchAll(/\b([A-Z]{2})\b/g)) for (const L of m[1]) assert.ok(L in km, `${idea.id}: la regla nombra ${m[1]} y la figura no tiene el punto ${L}`);
    const largo = n => Math.abs(km[n[0]] - km[n[1]]);
    for (const m of plano(r.ecuacion).matchAll(/(?<![+−-] )\b([A-Z]{2}) = ([A-Z]{2})\b(?! [+−-])/g)) assert.ok(Math.abs(largo(m[1]) - largo(m[2])) < 1e-9, `${idea.id}: la regla dice ${m[1]} = ${m[2]} y en su figura no miden igual`);
  }
});

test('M3: en la idea 6, si la solución traza una paralela, la figura del resuelto la muestra', () => {
  const idea = def.ideas.find(i => i.id === 'quiebre');
  const conAux = dib => { if (!dib) return false; const d = dib.datos; if (d.objeto === 'pasaje') return d.aux !== undefined; return (P.escena(d).fig.segmentos || []).some(l => l.discontinua && l.recta); };
  for (const e of idea.ejemplos) if (/\bparalela\b/.test(e.solucion.map(l => plano(l.texto)).join(' '))) assert.ok(conAux(e.figura), `«${e.titulo}»: la solución traza una paralela que la figura no tiene`);
  for (let s = 0; s < 60; s++) {
    const r = idea.resuelve.generar(s), p = r.pasos.find(x => /\bparalela\b/.test(plano(x.texto)));
    if (p) assert.ok(conAux(p.dibujo), `resuelve ${s}: el paso «${plano(p.texto)}» no muestra la paralela`);
    const a = idea.ahoraTu.generar(s);
    if (/\bparalela\b/.test(plano(a.solucion.texto)) || a.datos.some(x => /\bparalela\b/.test(plano(x)))) assert.ok(conAux(a.solucion.dibujo), `ahora tú ${s}: la solución no muestra la paralela`);
  }
});

// Ángulo polar (pantalla, y hacia abajo) de q visto desde c, y si cae dentro del sector de un ángulo preparado.
const polar = (c, q) => Math.atan2(q[1] - c[1], q[0] - c[0]);
const norm = t => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
function sectorDe(g, an) {
  const c = g.S(an.en), p1 = g.S(an.de), p2 = g.S(an.a), t1 = polar(c, p1);
  let dt = polar(c, p2) - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
  if (an.mayor) dt = dt > 0 ? dt - 2 * Math.PI : dt + 2 * Math.PI;
  return dt >= 0 ? [norm(t1), dt] : [norm(t1 + dt), -dt];
}
const enSector = (t, [lo, w], e = 0) => norm(t - lo) > -e && norm(t - lo) < w + e;
test('M4: cada rótulo cae dentro de su ángulo, no en una de sus partes dibujadas; con una bisectriz punteada adentro, sobre la bisectriz del entero', () => {
  const mal = [];
  for (const it of ANG) {
    if (it.figura.objeto === 'reloj') continue;
    const { g, angs, rot } = P.rotulos(it.figura, 9);
    for (const { an, x, y } of rot) {
      if (an.sector) continue;
      const c = g.S(an.en), t = polar(c, [x, y]), sec = sectorDe(g, an);
      if (!enSector(t, sec, 0.02)) { mal.push(`${it.donde}: «${an.texto}» cae fuera de su ángulo`); continue; }
      // Una parte dibujada (otro arco del mismo vértice dentro de este): el rótulo no cae en ella.
      for (const b of angs) {
        if (b === an || b.en !== an.en || b.mayor !== an.mayor) continue;
        const sb = sectorDe(g, b);
        if (sb[1] < sec[1] - 1e-6 && norm(sb[0] - sec[0]) <= sec[1] - sb[1] + 1e-6 && enSector(t, sb, -0.02) && !an.centro) mal.push(`${it.donde}: «${an.texto}» cae en la parte ${b.de}${an.en}${b.a}`);
      }
      // Una bisectriz punteada adentro: el rótulo, sobre la bisectriz del ángulo entero.
      const fig = P.escena(it.figura).fig;
      const punteados = (fig.segmentos || []).filter(l => l.discontinua && !l.recta && (l.de === an.en || l.a === an.en)).map(l => polar(c, g.S(l.de === an.en ? l.a : l.de)));
      if (punteados.some(u => enSector(u, sec, -0.03))) {
        const medio = norm(sec[0] + sec[1] / 2), dif = Math.abs(((t - medio + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
        if (dif > 4 * RAD) mal.push(`${it.donde}: «${an.texto}» tiene una bisectriz punteada adentro y su rótulo no va sobre la bisectriz del entero`);
      }
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('M5: dos ángulos consecutivos del mismo color (sin rayitas) nunca tienen el mismo radio', () => {
  const mal = [];
  for (const it of ANG) {
    const angs = P.angulosListos(it.figura, 9), G2 = G.geometria(P.escena(it.figura).fig);
    for (let i = 0; i < angs.length; i++) for (let j = i + 1; j < angs.length; j++) {
      const a = angs[i], b = angs[j];
      if (a.en !== b.en || a.rayita || b.rayita || (a.color || '') !== (b.color || '') || ![a.de, a.a].some(x => x === b.de || x === b.a)) continue;
      const sa = sectorDe(G2, a), sb = sectorDe(G2, b), dentro = (u, v) => v[1] < u[1] + 1e-6 && norm(v[0] - u[0]) <= u[1] - v[1] + 1e-6;
      if (dentro(sa, sb) || dentro(sb, sa)) continue;
      if (Math.abs((a.radio || 26) - (b.radio || 26)) < 6) mal.push(`${it.donde}: ${a.de}${a.en}${a.a} y ${b.de}${b.en}${b.a} con el mismo radio`);
    }
  }
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

test('M6: ninguna rayita de «miden igual» a menos de 10 px de un punto ni de las rayitas de otro grupo', () => {
  const mal = [];
  for (const it of RECTA.filter(x => x.figura)) for (const z of P.marcas(it.figura)) if (z.holgura < P.HOLGURA_MARCA) mal.push(`${it.donde}: las rayitas de ${z.tramo.de}${z.tramo.a} quedan a ${z.holgura.toFixed(1)} px`);
  assert.deepEqual([...new Set(mal)].slice(0, 20), []);
});

// Ancho de un texto que no se parte (espacios duros) en la ecuación de la regla, a 16 px.
function trozos(x, out = [''], fr = false) {
  if (x === null || x === undefined) return out;
  if (typeof x === 'string') { const ps = x.split(' '); out[out.length - 1] += ps[0]; for (const p of ps.slice(1)) out.push(p); return out; }
  if (Array.isArray(x)) { for (const y of x) trozos(y, out, fr); return out; }
  if (x.frac) { const w = x.frac.map(p => plano(p)); out[out.length - 1] += w.sort((a, b) => b.length - a.length)[0]; return out; }
  if (x.llave) return trozos(x.llave, out, fr);
  if ('t' in x) return trozos(String(x.t), out, fr);
  return out;
}
test('M7: ningún tramo sin corte de la ecuación de una regla pasa de 280 px (la tarjeta a 390 px)', () => {
  for (const idea of def.ideas) for (const t of trozos(idea.regla.ecuacion)) {
    const w = T.ancho(t.replace(/[⁠]/g, ''), 17, 400);
    assert.ok(w <= 280, `${idea.id}: «${t}» mide unos ${Math.round(w)} px y se corta a 390 px`);
  }
});

test('M8: «m∠» se dice en palabras antes de usarse (Lee de la idea 3, leyenda y glosario)', () => {
  const idea = def.ideas.find(i => i.id === 'abertura');
  assert.ok(idea.lee.tarjetas.some(t => /m∠AOB/.test(plano(t.texto)) && /la medida del ángulo/.test(plano(t.texto))), 'Lee no dice cómo se lee m∠');
  const conLetras = idea.lee.tarjetas.find(t => /m∠AOB/.test(plano(t.texto)));
  const pts = P.escena(conLetras.dibujo.datos).fig.puntos.map(q => q.rotulo);
  assert.ok(pts.includes('A') && pts.includes('B'), 'el reloj de la tarjeta que escribe m∠AOB no tiene A ni B');
  assert.ok(idea.juega.leyenda.some(l => /m∠/.test(plano(l.s))), 'la leyenda no explica m∠');
  assert.ok(/m∠/.test(def.glosario.find(g => g.termino === 'ángulo').def), 'el glosario no explica m∠');
});

test('M9: la tarjeta que nombra los pares entre paralelas tiene su dibujo, con dos pares marcados', () => {
  const idea = def.ideas.find(i => i.id === 'paralelas'), t = idea.lee.tarjetas.find(x => /Correspondientes/.test(plano(x.texto)));
  assert.ok(t && t.dibujo, 'la tarjeta de los nombres no tiene dibujo');
  const textos = (t.dibujo.datos.angulos || []).map(a => a.texto);
  assert.ok(new Set(textos).size >= 2 && textos.length >= 4, 'el dibujo no marca dos pares');
});

test('M12 y M13: en «Lee» las letras de dos puntos no se juntan, y ningún ejemplo a escala pregunta lo que se ve a ojo', () => {
  for (const idea of def.ideas.slice(0, 2)) for (const t of idea.lee.tarjetas) {
    if (!t.dibujo) continue;
    const g = P.geometria(t.dibujo.datos), xs = t.dibujo.datos.puntos.filter(q => !q.alto).map(q => g.P[q.id][0]).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 16, `${idea.id} «${t.titulo}»: dos puntos a ${(xs[i] - xs[i - 1]).toFixed(1)} px`);
  }
  for (const idea of def.ideas) for (const e of idea.ejemplos) if (e.figura) assert.ok(!/¿Cuál es el mayor|¿Cuál es el menor|¿[^¿]*es el punto medio[^¿]*\?$/.test(plano(e.enunciado)), `${idea.id} «${e.titulo}»: la figura a escala ya responde`);
});
