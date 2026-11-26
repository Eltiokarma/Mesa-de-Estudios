// Pruebas propias de «Arreglos numéricos y cuadrados mágicos» (etapa 9: las seis ideas rehechas).
// Todo se vuelve a resolver aquí sin el código de la unidad: un resolvedor lee el TEXTO que ve el alumno (la pregunta o
// el enunciado) y rehace la cuenta por fuerza bruta:
//   · grupos: reparte la lista en grupos de igual suma probando todas las maneras;
//   · marcos y cruces: prueba todos los acomodos de las tarjetas (o de las esquinas y los medios) y suma cada lado;
//   · cuadrados: arma todos los cuadrados mágicos 3 × 3 con esa lista (o los que multiplican) y lee la casilla;
//   · muros: arma el muro fila por fila y, si falta un adobe, prueba los valores uno por uno.
//   1. Los juegos (la misión no está cumplida al abrir y se puede lograr) y las predicciones.
//   2. «Ahora tú» en 400 semillas por idea: una sola opción correcta, la del resolvedor, y 4 opciones o más.
//   3. «Así se resuelve» en 200 semillas: la respuesta es la del resolvedor.
//   4. Lo que no se repite, la paleta (sin verde), toda igualdad escrita y el validador con calidad 2 simulada.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./arreglos-numericos.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const plano = x => Teoria.plano(x).replace(/[  ]/g, ' ');
const idea = id => def.ideas.find(i => i.id === id);
const num = s => +String(s).replace(/[\s  ]/g, '').replace(',', '.');
const suma = xs => xs.reduce((a, b) => a + b, 0);
const prod = xs => xs.reduce((a, b) => a * b, 1);
const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((v, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [v].concat(p))));
const subs = (xs, k) => (k === 0 ? [[]] : xs.length < k ? [] : subs(xs.slice(1), k - 1).map(s => [xs[0]].concat(s)).concat(subs(xs.slice(1), k)));
const nums = s => (s.match(/\d[\d ]*/g) || []).map(num);
const PAL = { dos: 2, tres: 3, cuatro: 4, cinco: 5 };

// ---------- Lectura de la lista de tarjetas ----------
function lista(t) {
  let m = t.match(/(impares|pares)? ?del (\d+) al (\d+)/);
  if (m) { const a = +m[2], b = +m[3], d = m[1] ? 2 : 1, out = []; for (let x = a; x <= b; x += d) out.push(x); return out; }
  m = t.match(/tarjetas ([\d, y]+?) (?:en|van)/);
  return m ? nums(m[1]) : null;
}
// ---------- Grupos ----------
function repartos(ns, k, r) {   // ¿se reparten en k grupos de r con la misma suma? (búsqueda completa)
  const T = suma(ns); if (T % k) return false; const S = T / k;
  const ir = rest => { if (!rest.length) return true; const [p, ...q] = rest; return subs(q, r - 1).some(g => suma(g) + p === S && ir(q.filter(x => !g.includes(x)))); };
  return ir(ns.slice());
}
const mitad = ns => { const T = suma(ns); if (T % 2) return 'impar'; for (let k = 0; k <= ns.length; k++) if (subs(ns, k).some(g => suma(g) === T / 2)) return 'si'; return 'par'; };
// ---------- Marcos: todos los acomodos (esquinas k, medio del lado k entre la esquina k y la k + 1) ----------
function sumasMarco(ns, L, esq) {
  const out = new Set(), cands = esq ? [esq] : subs(ns, L);
  for (const e of cands) {
    // Para cada orden de las esquinas y cada suma posible, las del medio quedan obligadas: se comprueba que sean
    // justo las tarjetas que sobran (con 6 u 8 tarjetas, además, todos los órdenes de las del medio: ver la prueba de abajo).
    const resto = ns.filter(x => !e.includes(x)).sort((p, q) => p - q).join();
    for (const v of perms(e)) for (let S = 0; S <= 3 * Math.max(...ns); S++) {
      const m = v.map((a, k) => S - a - v[(k + 1) % L]);
      if (m.slice().sort((p, q) => p - q).join() === resto) out.add(S);
    }
  }
  return [...out].sort((a, b) => a - b);
}
function cruz(ns, c) { const r = ns.filter(x => x !== c), out = new Set(); for (const g of subs(r, 2)) { const o = r.filter(x => !g.includes(x)); if (suma(g) === suma(o)) out.add(suma(g) + c); } return [...out]; }
// ---------- Cuadrados 3 × 3: todos los que cumplen con una lista (aditivo) o con una casilla dada ----------
const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const magicosBruto = ns => perms(ns).filter(p => LINEAS.every(l => suma(l.map(i => p[i])) === suma(ns) / 3));
// Con nueve números en progresión, los cuadrados son los del 1 al 9 (buscados por fuerza bruta) llevados a la lista por su
// lugar: así no se recorren las 362 880 permutaciones en cada pregunta. Si la lista no es una progresión, fuerza bruta.
const magicos = ns => { const o = ns.slice().sort((a, b) => a - b), d = o[1] - o[0];
  return o.every((x, i) => x === o[0] + i * d) ? MAG9.map(q => q.map(v => o[v - 1])) : magicosBruto(ns); };
const MAG9 = magicosBruto([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const LADO = { 3: 'triangular', 4: 'cuadrado', 5: 'pentágono' };
const ladosDe = t => (/triangular/.test(t) ? 3 : /cuadrado/.test(t) ? 4 : 5);
const cimaDe = b => { while (b.length > 1) b = b.slice(1).map((x, i) => b[i] + x); return b[0]; };


// El resolvedor: lee el texto y da la respuesta (número o texto).
function resolver(id, t) {
  t = plano(t).replace(/\s+/g, ' ');
  if (id === 'reparto-parejo') {
    const ns = lista(t);
    if (/Se pueden repartir/.test(t)) { const m = mitad(ns); return m === 'si' ? `Sí: cada grupo suma ${suma(ns) / 2}` : m === 'impar' ? 'No: el total es impar' : 'No, aunque el total es par'; }
    const k = PAL[t.match(/en (\w+) (?:filas|columnas)/)[1]], r = PAL[t.match(/(?:filas|columnas) de (\w+)/)[1]], S = suma(ns) / k;
    assert.ok(repartos(ns, k, r), `${t}: no se reparte`);
    const ya = t.match(/tiene ([\d, y]+) y le falta/);
    if (!ya) return S;
    const tiene = nums(ya[1]), x = S - suma(tiene);
    assert.ok(ns.includes(x) && !tiene.includes(x), t);
    return x;
  }
  if (id === 'vertices-dos-veces') {
    const ns = lista(t);
    if (/cruz/.test(t)) {
      const m = t.match(/con el (\d+) en el centro/);
      if (m) { const ss = cruz(ns, +m[1]); assert.equal(ss.length, 1, t); return ss[0]; }
      const S = +t.match(/suman (\d+) cada una/)[1], cs = ns.filter(c => cruz(ns, c).includes(S)); assert.equal(cs.length, 1, t); return cs[0];
    }
    const L = ladosDe(t), esq = t.match(/esquinas son ([\d, y]+?) y los lados/);
    if (esq) { const ss = sumasMarco(ns, L, nums(esq[1])); assert.equal(ss.length, 1, t); return ss[0]; }
    const S = +t.match(/cada lado suma (\d+)/)[1], V = L * S - suma(ns);
    assert.ok(subs(ns, L).some(e => suma(e) === V && sumasMarco(ns, L, e).includes(S)), `${t}: no se arma`);
    return V;
  }
  if (id === 'mayor-suma') {
    const ns = lista(t), ss = sumasMarco(ns, ladosDe(t));
    if (/menos la menor/.test(t)) return ss[ss.length - 1] - ss[0];
    return /mayor/.test(t) ? ss[ss.length - 1] : ss[0];
  }
  if (id === 'suma-magica') {
    if (/4 × 4/.test(t)) return suma(lista(t)) / 4;
    const m = t.match(/el centro es (\d+) y (.+?) es (\d+)/);
    if (m && !/multiplica/.test(t)) {   // la opuesta: se busca entre los cuadrados del 1 al 9 llevados a centro c con un salto (la regla 2c − a se rehace aparte)
      const c = +m[1], a = +m[3];
      const cands = new Set();
      for (const q of MAG9) for (let d = 1; d <= 6; d++) { const sq = q.map(v => c + (v - 5) * d), i = /esquina/.test(m[2]) ? 0 : 1; if (sq[i] === a) cands.add(sq[8 - i]); }
      assert.equal(cands.size, 1, t); return [...cands][0];
    }
    const fa = t.match(/con los números ([\d, y]+), la fila de arriba tiene (\d+) y (\d+)/);
    if (fa) { const ns = nums(fa[1]), a = +fa[2], b = +fa[3], sq = magicos(ns).filter(q => q[0] === a && q[1] === b); assert.ok(sq.length > 0, t); return sq[0][2]; }
    const ns = nums(t.split('número:')[1].split('?')[0]), sq = magicos(ns);
    assert.ok(sq.length > 0, t);
    return /centro/.test(t) ? sq[0][4] : suma(ns) / 3;
  }
  if (id === 'producto-magico') {
    if (/el centro es (\d+)\. ¿Qué producto/.test(t)) { const c = +t.match(/el centro es (\d+)/)[1]; return c * c * c; }
    if (/Qué número va en el centro/.test(t)) { const P = num(t.match(/da ([\d ]+)[.(]/)[1]); for (let c = 1; c <= 100; c++) if (c * c * c === P) return c; assert.fail(t); }
    const m = t.match(/el centro es (\d+) y .+? es (\d+)/);
    if (m) { const c = +m[1], a = +m[2]; assert.equal((c * c) % a, 0, t); return c * c / a; }
    const P = nums(t.match(/multiplica ([\d ]+) en/)[1])[0], ab = nums(t.match(/tiene ([\d ]+) y ([\d ]+)\./).slice(1).join(' , '));
    return P / prod(ab);
  }
  if (id === 'piramide-de-sumas') {
    const m = t.match(/abajo: ([\d, y]+), en ese orden/);
    if (m) return cimaDe(nums(m[1]));
    const cima = nums(t.match(/cima vale ([\d ]+)/)[1])[0], base = t.match(/Abajo están ([\d, ?]+)\./)[1].split(',').map(x => x.trim());
    const xs = []; for (let x = 1; x <= 60; x++) if (cimaDe(base.map(v => (v === '?' ? x : +v))) === cima) xs.push(x);
    assert.equal(xs.length, 1, t); return xs[0];
  }
  throw new Error(id);
}
const valor = o => { const s = plano(o.texto); return /^[\d\s ,]+$/.test(s) ? num(s) : s; };

test('juegos: la misión no está cumplida al abrir y se puede lograr en la grilla', () => {
  for (const i of def.ideas) {
    const j = i.juega, base = Teoria.inicio(j);
    assert.ok(!j.mision.logrado(base), i.id);
    assert.ok(Teoria.grilla(j.controles).some(v => j.mision.logrado(Object.assign({}, base, v))), i.id);
  }
});

test('predicciones: la correcta es la del resolvedor', () => {
  // 2, 4, 6, 8 y 10: no; triángulo 1 a 6 con esquinas 1, 3 y 5: 10; cuadrado 1 a 8: 15; 1 a 9: centro 5; 216: 6; muro: 23.
  assert.equal(mitad([2, 4, 6, 8, 10]), 'par');
  assert.deepEqual(sumasMarco([1, 2, 3, 4, 5, 6], 3, [1, 3, 5]), [10]);
  const sq8 = sumasMarco([1, 2, 3, 4, 5, 6, 7, 8], 4);
  // Fuerza bruta completa (8! acomodos) para el cuadrado con 1 a 8: las mismas cuatro sumas.
  const todas = new Set(); for (const p of perms([1, 2, 3, 4, 5, 6, 7, 8])) { const v = p.slice(0, 4), m = p.slice(4), Ls = v.map((a, k) => a + m[k] + v[(k + 1) % 4]); if (Ls.every(x => x === Ls[0])) todas.add(Ls[0]); }
  assert.deepEqual([...todas].sort((a, b) => a - b), sq8);
  assert.equal(Math.max(...sq8), 15);
  assert.ok(MAG9.every(q => q[4] === 5) && MAG9.length === 8);
  assert.equal(cimaDe([2, 5, 1, 3]), 23);
  const espera = { 'vertices-dos-veces': '10', 'mayor-suma': '15', 'suma-magica': '5', 'producto-magico': '6', 'piramide-de-sumas': '23' };
  for (const [id, v] of Object.entries(espera)) assert.equal(idea(id).predice.opciones.find(o => o.correcta).texto, v, id);
  let c6 = 0; for (let c = 1; c < 20; c++) if (c * c * c === 216) c6 = c; assert.equal(c6, 6);
});

test('«Ahora tú» en 400 semillas: una sola opción correcta, la del resolvedor, y 4 opciones o más', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), ok = a.opciones.filter(o => o.correcta), t = plano(a.pregunta);
    assert.equal(ok.length, 1, `${i.id} ${s}`);
    assert.ok(a.opciones.length >= 4, `${i.id} ${s}: ${a.opciones.length} opciones`);
    assert.equal(new Set(a.opciones.map(o => plano(o.texto))).size, a.opciones.length, `${i.id} ${s}: opciones repetidas`);
    assert.equal(valor(ok[0]), resolver(i.id, t), `${i.id} ${s}: ${t}`);
  }
});

test('«Así se resuelve» en 200 semillas: la respuesta es la del resolvedor', () => {
  for (const i of def.ideas) for (let s = 0; s < 200; s++) {
    const r = i.resuelve.generar(s), t = plano(r.enunciado), resp = plano(r.respuesta), bien = resolver(i.id, t);
    if (typeof bien === 'number') assert.ok(nums(resp).includes(bien), `${i.id} ${s}: ${resp} ≠ ${bien} (${t})`);
    else assert.ok(/Sí/.test(bien) ? /Sí/.test(resp) : /No/.test(resp), `${i.id} ${s}: ${resp} ≠ ${bien}`);
  }
});

test('ejemplos: 15 por idea, 5 por nivel; con alternativas, la respuesta es una sola de ellas', () => {
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id} nivel ${n}`);
    for (const e of i.ejemplos.filter(x => x.alternativas)) {
      const r = plano(e.respuesta), hay = e.alternativas.filter(a => r === a || r.split(/[ =:;]+/).includes(a));
      assert.equal(hay.length, 1, `${i.id} «${e.titulo}»: ${r}`);
    }
  }
});

test('ejemplos que el resolvedor lee: la respuesta es la suya', () => {
  const casos = [['reparto-parejo', 'Dos filas de cuatro'], ['reparto-parejo', 'Del 5 al 16'], ['reparto-parejo', 'Tres filas con un hueco'],
    ['mayor-suma', 'El cuadrado, la menor'], ['mayor-suma', 'El pentágono, la mayor'], ['mayor-suma', 'Impares en el pentágono'],
    ['piramide-de-sumas', 'Del 1 al 5 abajo'], ['piramide-de-sumas', 'Cuatro adobes: 4, 1, 3, 2']];
  for (const [id, tit] of casos) {
    const e = idea(id).ejemplos.find(x => x.titulo === tit), t = plano(e.enunciado), r = plano(e.respuesta);
    let bien;
    if (id === 'mayor-suma') { const ss = sumasMarco(lista(t), ladosDe(t)); bien = /menos la menor/.test(t) ? ss[ss.length - 1] - ss[0] : /mayor/.test(t) ? Math.max(...ss) : Math.min(...ss); }
    else if (/tiene el 9 y el 2/.test(t)) bien = 15 - 11;
    else bien = resolver(id, t.replace('van en dos filas de cuatro, una vez cada una, y las dos filas', 'van en dos filas de cuatro, una vez cada una, y todas las filas').replace('tres filas de cuatro, una vez cada una, y las tres', 'tres filas de cuatro, una vez cada una, y todas las'));
    assert.ok(nums(r).includes(bien), `${tit}: ${r} ≠ ${bien}`);
  }
  // La suma de lado 15 no se arma en el pentágono del 1 al 10, aunque la cuenta da entera (ejemplo 12 de la idea 3).
  const ss = sumasMarco([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
  assert.deepEqual(ss, [14, 16, 17, 19]);
});

test('no se repite: «Ahora tú» y «Así se resuelve» no traen la pregunta del juego ni de la predicción', () => {
  for (const i of def.ideas) {
    const prohibidas = [plano(i.predice.pregunta)];
    for (let s = 0; s < 200; s++) {
      assert.ok(!prohibidas.includes(plano(i.ahoraTu.generar(s).pregunta)), `${i.id} ${s}`);
      const e = new Set(i.ejemplos.map(x => plano(x.enunciado)));
      assert.ok(!e.has(plano(i.ahoraTu.generar(s).pregunta)), `${i.id} ${s}: repite un ejemplo`);
      assert.ok(!e.has(plano(i.resuelve.generar(s).enunciado)), `${i.id} ${s}: «Así se resuelve» repite un ejemplo`);
    }
  }
});

test('paleta: sin verde en la unidad; T naranja, lo compartido turquesa, S y P violeta, x carmín', () => {
  const txt = JSON.stringify(def.ideas.map(i => [i.lee, i.predice, i.mira, i.regla, i.ejemplos, i.ahoraTu.generar(0), i.resuelve.generar(0)]));
  assert.ok(!/c-d/.test(txt), 'verde');
  for (const [l, c] of [['T', 'c-o'], ['S', 'c-f'], ['P', 'c-f'], ['V', 'c-i'], ['c', 'c-i'], ['x', 'c-h']]) {
    const usos = [...txt.matchAll(new RegExp(`\\{"v":"(c-[a-z])","t":"${l}"\\}`, 'g'))].map(m => m[1]);
    assert.ok(usos.length > 0 && usos.every(u => u === c), `${l}: ${[...new Set(usos)]}`);
  }
});

test('lleva el validador con calidad 2 simulada sin hallazgos (200 semillas)', () => {
  const c = require('../../../catalogo/cursos/razonamiento-matematico.json').unidades.find(u => u.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: c.temas, semillas: 200 });
  assert.deepEqual(p, [], p.join('\n'));
});

// ---------- Correcciones de la auditoría y del lector en frío (26 nov) ----------
// Cada prueba falla con la versión anterior (rutinas/auditoria/razonamiento-matematico.arreglos-numericos.md).
test('auditoría: los Datos del cuadrado que multiplica no traen el centro (ni tabla de cubos ni primo al cubo)', () => {
  const pm = idea('producto-magico'), lineas = [];
  for (const e of pm.ejemplos) lineas.push([plano(e.enunciado), (e.datos || []).map(plano), plano(e.respuesta)]);
  for (let s = 0; s < 200; s++) {
    const a = pm.ahoraTu.generar(s), r = pm.resuelve.generar(s);
    lineas.push([plano(a.pregunta), (a.datos || []).map(plano), plano(a.opciones.find(o => o.correcta).texto)]);
    lineas.push([plano(r.enunciado), (r.datos || []).map(plano), plano(r.respuesta)]);
  }
  for (const [t, ds, resp] of lineas) {
    assert.ok(!ds.some(d => /→/.test(d)), `${t}: tabla en los Datos`);
    if (/centro\?$/.test(t)) {
      const c = nums(resp).pop();
      for (const d of ds) { const m = d.match(/^[\d ]+ = ([\d × ]+)$/); if (m) assert.ok(nums(m[1]).some(f => f !== c), `${t}: «${d}» da el centro, ${c}`); }
    }
  }
});
test('auditoría: la Predice 2 da 11 al contar dos veces las del medio, y el ejemplo de los cinco adobes explica cada alternativa', () => {
  const p = idea('vertices-dos-veces').predice, o = p.opciones.find(x => x.error === 'RMP182');
  assert.equal(num(o.texto), (2 * 21 - (1 + 3 + 5)) / 3);
  const e = idea('piramide-de-sumas').ejemplos.find(x => x.titulo === 'Cinco adobes iguales');
  const base = [2, 2, 2, 2, 2], previstos = { 10: suma(base), 20: 2 * suma(base), 22: 2 + 3 * 6 + 2, 16: 1 + 4 + 6 + 4 + 1, 32: 32 };
  assert.deepEqual(e.alternativas.map(num).sort((a, b) => a - b), Object.keys(previstos).map(Number).sort((a, b) => a - b));
  for (const [k, v] of Object.entries(previstos)) assert.equal(+k, v);
});
test('lector en frío: «Así se resuelve» de la idea 3 dice por qué la cota entera no se arma', () => {
  const t3 = idea('mayor-suma');
  for (let s = 0; s < 200; s++) for (const p of t3.resuelve.generar(s).pasos.filter(q => q.tipo === 'cuentas')) {
    const t = plano(p.texto);
    if (/Es entera, pero/.test(t)) assert.match(t, /siempre suman|con ninguna elección/, `semilla ${s}: ${t}`);
  }
});
test('lector en frío: la cruz de nivel 3 de la idea 3 no repite la de nivel 1 de la idea 2', () => {
  const a = plano(idea('vertices-dos-veces').ejemplos.find(e => e.titulo === 'La cruz con el 5').enunciado);
  for (const e of idea('mayor-suma').ejemplos.filter(x => x.nivel === 3 && /cruz/.test(plano(x.enunciado)))) assert.notDeepEqual(lista(plano(e.enunciado)), lista(a));
});
test('lector en frío: en todo marco, las esquinas llevan el papel de lo compartido (también vacías)', () => {
  const mira = [];
  const ver = d => { if (d && d.datos && d.datos.escena === 'marco') mira.push(d.datos); };
  for (const i of def.ideas) {
    for (const e of i.ejemplos || []) ver(e.figura);
    for (let s = 0; s < 30; s++) { ver(i.ahoraTu.generar(s).dibujo); ver(i.resuelve.generar(s).dibujo); }
  }
  assert.ok(mira.length > 20);
  for (const d of mira) for (const q of d.esquinas) if (q && !q.hueco) assert.equal(q.papel, 'compartida');
});
