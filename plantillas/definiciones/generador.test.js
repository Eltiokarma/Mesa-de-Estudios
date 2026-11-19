// Pruebas de «Definiciones»: casos.json (calculados aparte, con un script que no usa el generador), un recálculo por
// otro camino en 600 problemas, fugas, los tipos por idea, el recuadro «Datos» y que el banco cuadre entero.
// El recálculo no usa las funciones del generador: con los datos del banco, evalúa cada alternativa con su propio
// código (conjuntos de rasgos, un clasificador de frases por su forma y la cercanía de palabras con cada oración).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const sinTilde = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const ok = t => `ok:${t}`;

// Idea 1: la definición que deja dentro solo a la palabra (conjuntos: cada ser es un Set de rasgos).
function recDef(it, textos) {
  const seres = Object.entries(it.seres).map(([n, r]) => [n, new Set([...r, ...((it.extra || {})[n] || [])])]);
  const buenas = it.ops.filter(([t]) => textos.includes(t)).filter(([, pide]) => { const d = seres.filter(([, r]) => pide.every(x => r.has(x))); return d.length === 1 && d[0][0] === it.p; });
  // Una sin clase puede dejar dentro solo a la palabra en este mundo chico (no pasa en el banco): la prueba lo diría.
  assert.equal(buenas.length, 1, `${it.id}: ${buenas.length} definiciones justas`);
  return ok(buenas[0][0]);
}
// Idea 2: el rasgo que está en todos los casos y en ningún vecino.
function recRasgo(it, textos) {
  const b = it.ops.filter(([t, pide]) => textos.includes(t) && pide && Object.values(it.casos).every(r => pide.every(x => r.includes(x))) && !Object.values(it.vecinos).some(r => pide.every(x => r.includes(x))));
  assert.equal(b.length, 1, it.id);
  return ok(b[0][0]);
}
// Idea 3: la palabra con la misma clase y el mismo conjunto de rasgos (comparado como texto ordenado).
function recPal(it, textos) {
  const clave = r => [...r].sort().join('|');
  const b = textos.filter(w => it.pals[w] && it.pals[w][0] === it.defi[0] && clave(it.pals[w][1]) === clave(it.defi[1]));
  assert.equal(b.length, 1, it.id);
  return ok(b[0]);
}
// Idea 4: un clasificador propio por la forma de la frase (no lee el campo «forma» del banco).
const FIG = /coraz|sembrar ideas|sueno|angel|nube|gigante|silencio sin fin|libertad|estatua|propia piel/;
const FALTAS = ['sordo', 'descalzo', 'inmovil', 'desnudo'];
function forma(p, frase) {
  const f = sinTilde(frase), r = sinTilde(p).slice(0, 4);
  if (FIG.test(f)) return 'figurada';
  if (f.split(/[^a-zñ]+/).some(w => w.startsWith(r)) || (r === 'trist' && /triste/.test(f)) || (r === 'escri' && /escrit/.test(f))) return 'circular';
  if (/\bno\b|\bni\b/.test(f)) {
    // En una palabra que nombra una falta, la negación define si dice esa falta (oír, zapatos, moverse, ropa).
    const falta = { sordo: /no puede oir/, descalzo: /no lleva zapatos/, inmovil: /no se mueve/, desnudo: /no lleva ropa/ }[sinTilde(p)];
    return falta && falta.test(f) ? 'define' : 'negativa';
  }
  return f.replace(/^dicho de [a-z ]+: /, '').split(/\s+/).length <= 4 ? 'amplia' : 'define';
}
function recFalla(it, textos) {
  const b = textos.filter(t => forma(it.p, t) === 'define');
  assert.equal(b.length, 1, `${it.id}: ${textos.map(t => forma(it.p, t))}`);
  return ok(b[0]);
}
// Idea 5: la alternativa que se parece más a la oración que dice «es» que a ninguna otra, empieza por la clase y no
// agrega un «solo» que el texto no trae.
const VACIAS = new Set('que con por para del los las una uno como este esta solo cada otro otra muy mas desde hasta sobre sin ser cuando'.split(' '));
const cont = t => new Set(sinTilde(t).split(/[^a-zñ]+/).filter(w => w.length > 3 && !VACIAS.has(w)).map(w => w.slice(0, 5)));
const parece = (a, b) => { const A = cont(a), B = cont(b); return [...A].filter(x => B.has(x)).length / Math.max(1, A.size); };
function recTexto(it, textos) {
  const ors = it.ors.map(o => o[0]), di = ors.findIndex(o => new RegExp(`${sinTilde(it.t)} es `).test(sinTilde(o)));
  assert.ok(di >= 0, it.id);
  const texto = sinTilde(ors.join(' '));
  const b = textos.filter(t => {
    const s = ors.map(o => parece(t, o)), max = Math.max(...s);
    return s[di] === max && s.filter(x => x === max).length === 1 && sinTilde(t).slice(0, 4) === sinTilde(it.cl).slice(0, 4) && !(/\bsolo\b/.test(sinTilde(t)) && !/\bsolo\b/.test(texto));
  });
  assert.equal(b.length, 1, `${it.id}: ${b}`);
  return ok(b[0]);
}

const BANCO = { definicion: 'DEF', rasgo: 'RASGO', palabra: 'PAL', define: 'FALLA', falta: 'FALTA', termino: 'TEXTO' };
const REC = { DEF: recDef, RASGO: recRasgo, PAL: recPal, FALLA: recFalla, FALTA: recFalla, TEXTO: recTexto };
function recalcular(p) {
  const base = p._datos.tipo.replace(/-examen$/, ''), banco = BANCO[base];
  const it = gen[banco].find(x => x.id === p._datos.item);
  return REC[banco](it, p.alternativas.map(a => a.texto));
}
const igual = (a, b) => a === b;
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla, { idea: c.idea });
    assert.deepEqual({ tipo: p._datos.tipo, item: p._datos.item }, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
    assert.deepEqual(p.alternativas.filter(a => a.error).map(a => [a.texto, a.error.id]).sort(), c.esperado.errores.slice().sort());
  });
}

test('cada idea tiene sus tipos, salen los tres niveles y todos los códigos', () => {
  const ideas = ['genero-diferencia', 'rasgo-necesario', 'definicion-a-palabra', 'definicion-defectuosa', 'definicion-en-texto'];
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ideas);
  const ids = new Set(), niveles = new Set();
  for (const idea of ideas) for (let s = 0; s < 120; s++) {
    const p = gen.generar(s, { idea });
    assert.equal(p._datos.idea, idea);
    assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo));
    niveles.add(p._datos.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  const codigos = require('../../contenido/razonamiento-verbal/codigos.json');
  for (const id of ['RVD1', 'RVD2', 'RVD3', 'RVD4', 'RVD6', 'RVD7', 'RVD8', 'RVD9', 'RVD10', 'RVD11', 'RVD12', 'RVD13', 'RVD14', 'RVD15', 'RV11', 'RV56']) {
    assert.ok(ids.has(id), `no sale ${id}`);
    assert.ok(codigos[id], `${id} no está en codigos.json`);
  }
});

test('el banco cuadra entero: en cada ítem, cada error falla por lo que dice su código', () => {
  // Se recorre cada ítem con todas sus alternativas (el generador muestra 3 o 4 de ellas).
  for (const it of gen.DEF) {
    assert.equal(recDef(it, it.ops.map(o => o[0])), ok(it.ops[0][0]));
    for (const [t, pide, cod] of it.ops.slice(1)) {
      const d = Object.entries(it.seres).filter(([n, r]) => pide.every(x => r.includes(x) || ((it.extra || {})[n] || []).includes(x))).map(([n]) => n);
      if (cod === 'RVD7') assert.ok(!d.includes(it.p) && d.length, `${it.id}: «${t}»`); else assert.ok(d.includes(it.p) && d.length > 1, `${it.id}: «${t}» (${cod})`);
      if (cod === 'RVD8') assert.ok(/^Que /.test(t), `${it.id}: la sin clase empieza por «Que»`);
    }
  }
  for (const it of gen.RASGO) {
    assert.equal(recRasgo(it, it.ops.map(o => o[0])), ok(it.ops[0][0]));
    for (const [t, pide, cod] of it.ops.slice(1)) {
      if (cod === 'RV56') { assert.ok(/\bcomo\b/.test(t), t); continue; }
      const todos = Object.values(it.casos).every(r => pide.every(x => r.includes(x))), vecino = Object.values(it.vecinos).some(r => pide.every(x => r.includes(x)));
      assert.ok(cod === 'RVD3' ? todos && vecino : !todos, `${it.id}: «${t}» (${cod})`);
    }
  }
  const COD = { RVD9: 'general', RVD10: 'especifica', RVD7: 'vecino', RVD11: 'otra' };
  for (const it of gen.PAL) {
    recPal(it, Object.keys(it.pals));
    const tipos = Object.entries(it.pals).map(([, [c, r]]) => (c !== it.defi[0] ? 'otra' : !r.length ? 'general' : it.defi[1].every(x => r.includes(x)) ? (r.length === it.defi[1].length ? 'ok' : 'especifica') : 'vecino'));
    assert.deepEqual(tipos.slice().sort(), ['especifica', 'general', 'ok', 'otra', 'vecino'], `${it.id}: una palabra de cada clase (${tipos})`);
    assert.ok(Object.values(COD).every(c => tipos.includes(c)));
  }
  for (const it of [...gen.FALLA, ...gen.FALTA]) {
    recFalla(it, it.fr.map(f => f[0]));
    for (const [t, f] of it.fr) assert.equal(forma(it.p, t), f, `${it.id}: «${t}»`);
  }
  for (const it of gen.TEXTO) {
    recTexto(it, it.ops.map(o => o[0]));
    assert.deepEqual(it.ops.slice(1).map(o => o[1]).sort(), ['RV11', 'RV56', 'RVD11', 'RVD15'], it.id);
    assert.ok(it.ors.some(o => o[1] === 'ejemplo') && /^Por ejemplo/.test(it.ors.find(o => o[1] === 'ejemplo')[0]), `${it.id}: el texto trae su ejemplo`);
  }
});

test('recuadro «Datos» en 400 semillas: lista de líneas cortas, sin la respuesta ni consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!sinTilde(l).includes(sinTilde(c)), `semilla ${s}: los datos traen la respuesta`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene)/.test(l), `semilla ${s}: consejo en Datos`);
    }
  }
});

test('la correcta no es siempre la más larga ni la más corta', () => {
  const por = {};
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), l = p.alternativas.map(a => a.texto.length), c = p.alternativas.find(a => a.correcta).texto.length;
    const o = por[p._datos.tipo] = por[p._datos.tipo] || { n: 0, larga: 0, corta: 0 };
    o.n++; if (c === Math.max(...l)) o.larga++; if (c === Math.min(...l)) o.corta++;
  }
  for (const [t, o] of Object.entries(por)) {
    assert.ok(o.larga / o.n < 0.45, `${t}: la correcta es la más larga en ${Math.round(100 * o.larga / o.n)} %`);
    assert.ok(o.corta / o.n < 0.45, `${t}: la correcta es la más corta en ${Math.round(100 * o.corta / o.n)} %`);
  }
});

// ---------- Auditoría (19 nov; rutinas/auditoria/razonamiento-verbal.definiciones.md) ----------
// Fallan con el generador de antes y pasan con este.
test('auditoría: en ningún problema la correcta es la más larga ni la más corta (200 semillas por idea)', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 200; s++) {
    const p = gen.generar(`aud-${s}`, { idea }), l = p.alternativas.map(a => a.texto.length), c = p.respuesta.texto.length;
    assert.ok(c < Math.max(...l) && c > Math.min(...l), `${idea} ${p._datos.tipo} ${p._datos.item}: la correcta mide ${c}; ${l}`);
  }
});
test('auditoría: la clase lejana (RVD6) pide también un rasgo, y lo que dice su explicación se cumple en la situación', () => {
  for (const it of gen.DEF) for (const [t, pide, cod] of it.ops) if (cod === 'RVD6') {
    assert.ok(pide.length >= 2, `${it.id}: «${t}» no pide ningún rasgo: deja entrar a todo, aun a lo que la situación excluye`);
  }
  const calc = gen.DEF.find(x => x.id === 'calculadora');
  assert.ok(!calc.ops.some(([t]) => /examen/.test(t)), 'el celular no se lleva al examen: no entra en «objeto que se lleva al examen»');
});
test('auditoría: la oración que define no está siempre en el mismo lugar del texto', () => {
  const lugares = new Set(gen.TEXTO.map(it => it.ors.findIndex(o => o[1] === 'define')));
  assert.ok(lugares.size >= 3, [...lugares].join());
});
test('auditoría: «entra» o «entran» según cuántos se cuelan, y «del» en vez de «de el»', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s, { idea: 'genero-diferencia' });
    for (const a of p.alternativas) if (a.error) {
      assert.ok(!/\bde el\b/.test(a.error.explicacion), a.error.explicacion);
      assert.ok(!/también entra [^.:]+ y (el|la|los|las) /.test(a.error.explicacion), a.error.explicacion);
    }
  }
});
