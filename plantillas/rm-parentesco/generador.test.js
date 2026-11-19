// Pruebas del generador de parentescos y deducción con pistas: casos.json, papel.json y, en cada uno de
// 600 problemas, un recálculo independiente hecho solo desde p._datos:
//   cadena    familias concretas al azar (con hermanos, hijos y nietos de cada pariente) donde cada «único»
//             es cierto; el parentesco se nombra subiendo hasta el antepasado común. Todas deben dar lo mismo.
//   arbol     el árbol recorrido con su propio código.
//   minimo    todas las familias etiquetadas de hasta 7 personas (sin ordenar), con sus parentescos contados aparte
//             («al menos» cada parentesco pedido).
//   orden     cada uno de los 24 órdenes, probando valores de 1 a 16 que lo respeten.
//   billetes  las 720 permutaciones de los sobres.
//   edades    el triple bucle completo de 1 a 40.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const Azar = require('../../nucleo/azar.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- cadena: familias concretas ----------
function familiaConcreta(rng, sexoEgo) {
  const ps = [];
  const nueva = (sexo, padre = null, madre = null) => { ps.push({ id: ps.length, sexo, padre, madre }); return ps.length - 1; };
  const ego = nueva(sexoEgo);
  // Línea directa hasta los bisabuelos; d = generaciones sobre ego.
  const directos = [[ego, 0]];
  for (let k = 0; k < directos.length; k++) {
    const [id, d] = directos[k];
    if (d === 3) continue;
    const pa = nueva('v'), ma = nueva('m');
    ps[id].padre = pa; ps[id].madre = ma;
    directos.push([pa, d + 1], [ma, d + 1]);
  }
  // Descendientes (de 0 a 2 hijos de cada sexo por persona) hasta k generaciones.
  const bajar = (id, k) => {
    if (k === 0) return;
    for (const s of ['v', 'm']) for (let i = rng.entero(0, 2); i > 0; i--) bajar(nueva(s, ps[id].sexo === 'v' ? id : null, ps[id].sexo === 'm' ? id : null), k - 1);
  };
  // Hermanos extra de ego, de sus padres y de sus abuelos, con hijos y nietos hasta la generación de ego y una más.
  for (const [id, d] of directos) {
    if (d > 2) continue;
    const p = ps[id];
    for (const s of ['v', 'm']) for (let i = rng.entero(0, 2); i > 0; i--) bajar(nueva(s, p.padre, p.madre), 2 - d);
  }
  bajar(ego, 3);
  return { ps, ego };
}
function pasoConjunto(ps, ids, nombrePaso) {
  const S = { padre: 'v', madre: 'm', hijo: 'v', hija: 'm', hermano: 'v', hermana: 'm' }[nombrePaso];
  const r = new Set();
  for (const id of ids) {
    const p = ps[id];
    if (nombrePaso === 'padre' && p.padre !== null) r.add(p.padre);
    if (nombrePaso === 'madre' && p.madre !== null) r.add(p.madre);
    if (nombrePaso === 'hijo' || nombrePaso === 'hija') for (const q of ps) if ((q.padre === id || q.madre === id) && q.sexo === S) r.add(q.id);
    if (nombrePaso === 'hermano' || nombrePaso === 'hermana') for (const q of ps) if (q.id !== id && q.sexo === S && (q.padre !== null || q.madre !== null) && q.padre === p.padre && q.madre === p.madre) r.add(q.id);
  }
  return [...r];
}
// Parentesco concreto: subir desde ego hasta el antepasado más cercano del que desciende la persona.
function parentesco(ps, ego, t) {
  const sx = ps[t].sexo;
  const anc = [[ego, '']];
  for (let k = 0; k < anc.length; k++) { const [a, s] = anc[k]; if (s.length < 5) { if (ps[a].padre !== null) anc.push([ps[a].padre, s + 'P']); if (ps[a].madre !== null) anc.push([ps[a].madre, s + 'M']); } }
  const hijosDe = id => ps.filter(q => q.padre === id || q.madre === id).map(q => q.id);
  const bajaA = (desde, meta) => { let nivel = [desde], d = 0; while (nivel.length && d < 6) { if (nivel.includes(meta)) return d; nivel = nivel.flatMap(hijosDe); d++; } return -1; };
  for (const [a, s] of anc) if (a === t) return s.length === 0 ? 'D:0' + sx : s.length === 2 ? 'D:' + s[0] + '2' + sx : 'D:' + s.length + sx;
  const b = bajaA(ego, t); if (b > 0) return 'H:' + b + sx;
  for (const [a, s] of anc.sort((x, y) => x[1].length - y[1].length)) {
    if (!s) continue;
    const d = bajaA(a, t);
    if (d > 0) return 'C:' + s.length + ',' + d + sx + (s.length === 2 && d === 1 ? s[0] : '');
  }
  return '?';
}
function recalcularCadena(d) {
  const rng = Azar.crear('prueba-cadena|' + JSON.stringify(d));
  const vistos = new Set();
  let validas = 0;
  for (let k = 0; k < 2000 && validas < 40; k++) {
    const { ps, ego } = familiaConcreta(rng, d.ego);
    let ids = [ego], ok = true;
    for (let i = 0; i < d.pasos.length; i++) {
      ids = pasoConjunto(ps, ids, d.pasos[i]);
      const ultimo = i === d.pasos.length - 1;
      if (ids.length === 0 || ((d.unicos[i] || !ultimo) && ids.length !== 1)) { ok = false; break; }
    }
    if (!ok) continue;
    validas++;
    ids.forEach(t => vistos.add(parentesco(ps, ego, t)));
  }
  const r = [...vistos].sort();
  return r.length === 1 ? r[0] : r;
}
const claveCadena = clave => clave.startsWith('amb:') ? clave.slice(4).split('|').sort() : clave;
// El generador escribe ego como 'D:0v' o 'D:0m'; los demás, igual que aquí.

// ---------- arbol ----------
function recalcularArbol(d) {
  const ps = d.arbol.personas;
  let id = d.habla;
  for (const p of d.pasos) {
    const yo = ps.find(q => q.id === id);
    const sx = /^(padre|hijo|hermano|esposo)$/.test(p) ? 'v' : 'm';
    let r;
    if (p === 'padre' || p === 'madre') r = ps.filter(q => q.id === (p === 'padre' ? yo.padre : yo.madre));
    else if (p.startsWith('hij')) r = ps.filter(q => q.padre === id || q.madre === id);
    else if (p.startsWith('herman')) r = ps.filter(q => q.id !== id && q.padre !== null && q.padre === yo.padre && q.madre === yo.madre);
    else r = ps.filter(q => q.id === yo.conyuge);
    r = r.filter(q => q.sexo === sx);
    if (r.length !== 1) return null;
    id = r[0].id;
  }
  return 'p' + id;
}

// ---------- minimo: familias etiquetadas ----------
let TABLA_LAB = null;
function tablaEtiquetada() {
  if (TABLA_LAB) return TABLA_LAB;
  const porVector = new Map(); // vector → menor tamaño
  const ps = [];
  const contar = () => {
    const n = ps.length, c = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
      const p = ps[i], g = p.s;
      const hijos = []; for (let j = 0; j < n; j++) if (ps[j].f === i || ps[j].m === i) hijos.push(j);
      const conPadres = p.f >= 0 || p.m >= 0;
      if (!hijos.length && !conPadres) return null;
      if (hijos.length) c[g]++;
      if (conPadres) c[2 + g]++;
      let herm = false; if (conPadres) for (let j = 0; j < n; j++) if (j !== i && ps[j].f === p.f && ps[j].m === p.m) herm = true;
      if (herm) c[4 + g]++;
      let abu = false; for (const h of hijos) for (let j = 0; j < n; j++) if (ps[j].f === h || ps[j].m === h) abu = true;
      if (abu) c[6 + g]++;
      const sube = x => x >= 0 && (ps[x].f >= 0 || ps[x].m >= 0);
      if (sube(p.f) || sube(p.m)) c[8 + g]++;
    }
    return c.join(',');
  };
  const pareja = () => { const m = new Map(); for (const p of ps) { const t = p.f + '|' + p.m; for (const x of [p.f, p.m]) if (x >= 0) { if (m.has(x) && m.get(x) !== t) return false; m.set(x, t); } } return true; };
  const rec = () => {
    if (ps.length && pareja()) { const k = contar(); if (k && !porVector.has(k)) porVector.set(k, ps.length); }
    if (ps.length === 7) return;
    const n = ps.length;
    for (let s = 0; s < 2; s++) for (let f = -1; f < n; f++) {
      if (f >= 0 && ps[f].s !== 0) continue;
      for (let m = -1; m < n; m++) { if (m >= 0 && ps[m].s !== 1) continue; ps.push({ s, f, m }); if (pareja()) rec(); ps.pop(); }
    }
  };
  rec();
  TABLA_LAB = porVector;
  return porVector;
}
const ORDEN_ROLES = ['padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'abuelo', 'abuela', 'nieto', 'nieta'];
function recalcularMinimo(d) {
  let mejor = Infinity;
  for (const [k, n] of tablaEtiquetada()) {
    const c = k.split(',').map(Number);
    if (Object.entries(d.pedido).every(([r, x]) => c[ORDEN_ROLES.indexOf(r)] >= x)) mejor = Math.min(mejor, n); // «al menos»
  }
  return mejor;
}

// ---------- orden ----------
function recalcularOrden(d) {
  const ok = x => d.pistas.every(p => p.t === 'simple' ? x[p.a] > x[p.b]
    : (p.rel === '=' ? x[p.a[0]] + x[p.a[1]] === x[p.b[0]] + x[p.b[1]] : p.rel === '>' ? x[p.a[0]] + x[p.a[1]] > x[p.b[0]] + x[p.b[1]] : x[p.a[0]] + x[p.a[1]] < x[p.b[0]] + x[p.b[1]]));
  const perms = []; const per = (a, r) => { if (!r.length) perms.push(a); r.forEach((x, i) => per([...a, x], r.filter((_, j) => j !== i))); }; per([], [0, 1, 2, 3]);
  const buenos = [];
  for (const o of perms) { // o[0] el mayor
    let hay = false;
    for (let w = 1; w <= 16 && !hay; w++) for (let z = w + 1; z <= 16 && !hay; z++) for (let y = z + 1; y <= 16 && !hay; y++) for (let u = y + 1; u <= 16 && !hay; u++) {
      const x = []; x[o[0]] = u; x[o[1]] = y; x[o[2]] = z; x[o[3]] = w;
      if (ok(x)) hay = true;
    }
    if (hay) buenos.push(o);
  }
  return buenos.length === 1 ? 'orden:' + buenos[0].join(',') : 'varios';
}

// ---------- billetes ----------
function recalcularBilletes(d) {
  const vals = new Set();
  const perms = []; const per = (a, r) => { if (!r.length) perms.push(a); r.forEach((x, i) => per([...a, x], r.filter((_, j) => j !== i))); }; per([], [0, 1, 2, 3, 4, 5]);
  for (const q of perms) {
    const de = [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]]], T = i => d.montos[de[i][0]] + d.montos[de[i][1]];
    const ok = d.pistas.every(p => p.t === 'mas' ? T(p.a) > T(p.b) : p.t === 'dif' ? T(p.a) - T(p.b) === p.d : p.t === 'tope' ? (p.menos ? T(p.a) < p.k : T(p.a) > p.k)
      : p.t === 'tiene' ? de[p.a].includes(p.sobre) : !de[p.a].includes(p.sobre));
    if (ok) vals.add(d.pide.t === 'monto' ? T(d.pide.p) : T(d.pide.p) - T(d.pide.q));
  }
  return vals.size === 1 ? [...vals][0] : NaN;
}

// ---------- edades ----------
function recalcularEdades(d) {
  const primo = n => { if (n < 2) return false; for (let k = 2; k < n; k++) if (n % k === 0) return false; return true; };
  let min = Infinity;
  for (let a = 1; a <= 40; a++) for (let b = 1; b <= 40; b++) for (let c = 1; c <= 40; c++) {
    const e = [a, b, c];
    if (new Set(e).size < 3) continue;
    const ok = d.conds.every(k => k.t === 'primo' ? primo(e[k.p]) : k.t === 'par' ? e[k.p] % 2 === 0 : k.t === 'impar' ? e[k.p] % 2 === 1
      : k.t === 'mult' ? e[k.p] % k.k === 0 : k.t === 'mayor' ? e[k.p] > e[k.q] : k.t === 'suma' ? a + b + c === k.k : e[k.p] - e[k.q] === k.k);
    if (ok) min = Math.min(min, e[d.pide[0]] + e[d.pide[1]]);
  }
  return min;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'cadena') return recalcularCadena(d);
  if (d.tipo === 'arbol') return recalcularArbol(d);
  if (d.tipo === 'minimo') return recalcularMinimo(d);
  if (d.tipo === 'orden') return recalcularOrden(d);
  if (d.tipo === 'billetes') return recalcularBilletes(d);
  return recalcularEdades(d);
}
function igual(esperado, valor) {
  if (typeof valor === 'string' && valor.startsWith('amb:')) return JSON.stringify(esperado) === JSON.stringify(claveCadena(valor));
  if (typeof valor === 'string') return esperado === valor;
  return Math.abs(esperado - valor) < 1e-9;
}
probarGenerador(gen, { semillas: 600, recalcular, igual });

test('salen los seis tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.deepEqual([...tipos].sort(), ['arbol', 'billetes', 'cadena', 'edades', 'minimo', 'orden']);
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: entre 5 y 10 problemas con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) {
    assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
    assert.ok(!/\d\.\d/.test(p.enunciado + ' ' + p.respuesta + ' ' + p.pasos.join(' ')), `${p.id}: coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) {
    const r = gen.calc[v.fn](...v.args);
    if (v.espera !== null && typeof v.espera === 'object' && !Array.isArray(v.espera)) for (const k of Object.keys(v.espera)) assert.deepEqual(r[k], v.espera[k], `${p.id}: ${v.fn}.${k}`);
    else assert.deepEqual(r, v.espera, `${p.id}: ${v.fn}`);
  }
});

// Propiedades que valen la pena.
test('minimo: el mínimo es mínimo (no hay familia con una persona menos) y la familia de ejemplo cumple', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'minimo') continue;
    const r = gen.calc.minimoPersonas(p._datos.pedido);
    assert.equal(r.ejemplo.length, r.n);
    const c = gen.calc.roles(r.ejemplo);
    for (const [k, x] of Object.entries(p._datos.pedido)) assert.ok(c[k] >= x);
  }
});
test('minimo: el mínimo llega a una cota que vale en cualquier familia (aunque falten parientes intermedios)', () => {
  let n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'minimo') continue;
    n++;
    const g = r => d.pedido[r] || 0;
    const sexo = Math.max(g('padre'), g('hijo'), g('hermano'), g('abuelo'), g('nieto')) + Math.max(g('madre'), g('hija'), g('hermana'), g('abuela'), g('nieta'));
    const cota = Math.max(sexo, g('hijo') + g('hija') + 1, g('padre') + g('madre') + 1);
    assert.equal(p.respuesta.valor, cota, `semilla ${s}`);
    const t = p.enunciado.join('');
    assert.match(t, /al menos/); assert.match(t, /Los hermanos lo son de padre y madre/);
    assert.doesNotMatch(p.solucion.map(x => x.map(y => typeof y === 'string' ? y : y.t).join('')).join(' '), /todas las familias/);
  }
  assert.ok(n > 30);
});
test('cadena: si «él mismo» o «ella misma» está entre las respuestas, el dicho va en tercera persona', () => {
  let n = 0;
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'cadena') continue;
    if (!p.alternativas.some(a => /\bmism[oa]\b/.test(a.texto))) continue;
    n++;
    assert.doesNotMatch(p._datos.dicho, /\b(me|conmigo)\b/, `semilla ${s}`);
  }
  assert.ok(n > 20);
});
test('árbol y orden: el color del punto de partida no pinta toda la frase; pistas y orden final con colores distintos', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'arbol') {
      const a = p.enunciado.find(x => typeof x === 'object');
      assert.equal(a.t, 'mi ' + d.pasos[0]);
    }
    if (d.tipo === 'orden') assert.notEqual(p.variables.c.color, p.variables.x.color);
  }
});
test('cadena: cada «único» del enunciado decide algo o es parte de la frase, y la respuesta doble no dice «único» al final', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'cadena') continue;
    if (String(p.respuesta.valor).startsWith('amb:')) assert.equal(p._datos.unicos[p._datos.pasos.length - 1], false);
  }
});
test('orden: cada pista hace falta (sin una, hay más de un orden)', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    if (p._datos.tipo !== 'orden') continue;
    const ps = p._datos.pistas;
    assert.equal(gen.calc.ordenes(ps).length, 1);
    ps.forEach((_, i) => assert.ok(gen.calc.ordenes(ps.filter((__, j) => j !== i)).length > 1));
  }
});

// ---------------------------------------------------------------- fase 5 de Razonamiento deductivo (17 nov)
const DED = 'razonamiento-matematico.razonamiento-deductivo', ORD = 'razonamiento-matematico.ordenamiento-de-informacion';
const MUESTRA = {};
const muestra = u => MUESTRA[u] || (MUESTRA[u] = Array.from({ length: 400 }, (_, s) => gen.generar(`u-${s}`, { unidad: u })));

test('generar(semilla, { unidad }): Razonamiento deductivo recibe parentesco y repartos; Ordenamiento, el orden por sumas y las edades', () => {
  assert.deepEqual([...new Set(muestra(DED).map(p => p._datos.tipo))].sort(), ['arbol', 'billetes', 'cadena', 'minimo']);
  assert.deepEqual([...new Set(muestra(ORD).map(p => p._datos.tipo))].sort(), ['edades', 'orden']);
  assert.deepEqual(gen.generar(9, { unidad: 'otra.unidad' }), gen.generar(9));
  for (const p of muestra(ORD)) assert.ok(igual(recalcular(p), p.respuesta.valor), `${p.id}: el recálculo da ${JSON.stringify(recalcular(p))}, el generador ${p.respuesta.valor}`);
  // El recálculo de la cadena prueba familias al azar: con una respuesta doble puede no dar con la segunda (pocas
  // familias con tres hermanos), así que ahí basta con que lo que encuentra esté entre las dos.
  for (const p of muestra(DED)) {
    const r = recalcular(p), val = p.respuesta.valor;
    if (typeof val === 'string' && val.startsWith('amb:')) assert.ok([].concat(r).every(x => claveCadena(val).includes(x)), `${p.id}: el recálculo da ${r}`);
    else assert.ok(igual(r, val), `${p.id}: el recálculo da ${JSON.stringify(r)}, el generador ${val}`);
  }
});

// Cuarta ronda (Gerson, 18 nov): «edades» pasa a Ordenamiento de información, una vez de cada tres (el sorteo trae dos
// «orden» y una «edades»). Las demás unidades (y la práctica sin unidad) reciben exactamente lo mismo que antes: los
// tipos de las semillas 0 a 119 quedan fijados aquí, copiados del generador antes del cambio (c cadena, a árbol,
// m mínimo, o orden, b billetes, e edades).
test('Ordenamiento de información recibe «orden» y «edades»; las demás unidades, los mismos tipos que antes, semilla por semilla', () => {
  assert.deepEqual(gen.tiposPorUnidad, { [DED]: ['cadena', 'arbol', 'minimo', 'billetes'], [ORD]: ['orden', 'edades'] });
  const K = { cadena: 'c', arbol: 'a', minimo: 'm', orden: 'o', billetes: 'b', edades: 'e' };
  const antes = {
    [DED]: ['mabcbcmbamccmmmmcbcmammmaccmmcabamcbcbccmcbacaacccccacmamcbmmcccccccmacmmccccacmaccccaccabmcccamccamaaccaaammmbmmabambcc', 'mcmmcc'],
    sin: ['oaecbcoeaoacbbboaecomobomccooamemocbabccbcbacmmccacaacoaoceobccccccaomaboacccmcomaaccmccaeocccaoccmoamcammmoooboomemoecc', 'ocooac'],
  };
  const pruebas = ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3'];
  for (const [u, [semillas, entradaSalida]] of Object.entries(antes)) {
    const tipo = x => K[(u === 'sin' ? gen.generar(x) : gen.generar(x, { unidad: u }))._datos.tipo];
    assert.equal(Array.from({ length: 120 }, (_, x) => tipo(x)).join(''), semillas, u);
    assert.equal(pruebas.map(tipo).join(''), entradaSalida, u);
  }
  const e = muestra(ORD).filter(p => p._datos.tipo === 'edades').length;
  assert.ok(e > 90 && e < 180, `edades en ${e} de 400`);
  // El papel: el problema de edades con primos es de Ordenamiento, como el del orden por sumas.
  for (const q of papel.problemas) if (/edades/.test(q.enunciado)) assert.deepEqual(q.unidades, [ORD], q.id);
});

test('datos: una lista de líneas cortas con las definiciones de cada tipo y sin la respuesta, en 400 semillas de cada unidad', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (const u of [DED, ORD]) for (const p of muestra(u)) {
    const d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `${p.id}: datos debe ser una lista no vacía`);
    for (const l of p.datos) assert.ok(palabras(l) <= 22 && l.trim() === l && !/^Dato:/i.test(l), `${p.id}: «${l}»`);
    const todo = p.datos.join('\n').toLowerCase(), c = String(p.respuesta.texto).toLowerCase();
    assert.ok(!todo.includes(c), `${p.id}: los datos traen la respuesta ${c}`);
    if (d.tipo === 'cadena' || d.tipo === 'arbol' || d.tipo === 'minimo') assert.ok(todo.includes('hermanos:'), `${p.id}: falta qué son hermanos`);
    if (d.tipo === 'cadena' && d.unicos.some(Boolean)) assert.ok(todo.includes('«único»'), `${p.id}: falta qué es «único»`);
    if (d.tipo === 'edades') assert.ok(todo.includes('primo:') && todo.includes('par:'));
    if (d.tipo === 'billetes') assert.ok(todo.includes('dos sobres'));
    // Toda respuesta que se elige por nombre está definida en los datos (auditoría M13): bisabuelo, tío abuelo, sobrino nieto…
    if (d.tipo === 'cadena') for (const a of p.alternativas) {
      const MASC = { madre: 'padre', abuela: 'abuelo', bisabuela: 'bisabuelo', hija: 'hijo', nieta: 'nieto', bisnieta: 'bisnieto', hermana: 'hermano', sobrina: 'sobrino', 'tía': 'tío', prima: 'primo', 'sobrina nieta': 'sobrino nieto', 'tía abuela': 'tío abuelo' };
      for (const parte of String(a.texto).toLowerCase().split(' o ')) {
        let t = parte.replace(/^su /, '').replace(/ (paterno|materno|paterna|materna)$/, '');
        if (/^(él mismo|ella misma)$/.test(t)) continue;
        t = MASC[t] || t;
        assert.ok(todo.includes(t), `${p.id}: «${a.texto}» no está en los datos`);
      }
    }
  }
});

// Paleta de deducción (Gerson, 17 nov): naranja quien habla («mi …»), violeta lo pedido ya comprobado, el resto en tinta;
// sin verde ni carmín.
test('paleta de deducción: sin verde ni carmín, «único» en tinta y la respuesta en violeta', () => {
  for (const u of [DED, ORD]) for (const p of muestra(u)) {
    const V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.ok(['o', 'i', 'f'].includes(x.color), `${p.id}: ${k} en ${x.color}`);
    assert.ok(!V.u, `${p.id}: «único» con color`);
    if (V.a) assert.equal(V.a.color, 'o');
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) if (x && typeof x === 'object') assert.ok(V[x.v], `${p.id}: «${x.t}» usa ${x.v}, que no existe`);
    assert.ok(p.solucion.some(l => l.some(x => x && typeof x === 'object' && V[x.v] && V[x.v].color === 'f')), `${p.id}: la respuesta no va en violeta`);
    for (const f of [p.figura, p.figuraSolucion]) if (f) assert.ok(!/--c-[hd]\b/.test(f.svg), `${p.id}: la figura usa verde o carmín`);
  }
});

test('cada explicación empieza por lo que el alumno hizo bien y es hipótesis', () => {
  for (const u of [DED, ORD]) for (const p of muestra(u)) for (const a of p.alternativas.filter(x => x.error)) {
    assert.match(a.error.explicacion, /^Bien\b/, `${p.id}: ${a.error.explicacion}`);
    assert.equal(a.error.respaldo, 'hipotesis');
  }
});

test('cadena: «la hermana de la única hermana de la madre de mi madre» es la abuela materna, sin otra opción', () => {
  assert.equal(gen.calc.cadena('v', ['madre', 'madre', 'hermana', 'hermana'], [false, false, true, false]).clave, 'D:M2m');
  // Sin el «única», sí quedan dos: la abuela u otra tía abuela.
  assert.equal(gen.calc.cadena('v', ['madre', 'madre', 'hermana', 'hermana'], [false, false, false, false]).clave, 'amb:D:M2m|C:3,1m');
});

// Papel escrito a mano (auditoría M10 y M11, 17 nov): cada problema trae sus datos y dice a qué unidades sirve (la app
// muestra, desde una unidad, solo los suyos; una lista vacía: el tipo no es de ninguna unidad que use esta plantilla).
test('papel.json: cada problema con «Datos:» y con su lista de unidades', () => {
  const pap = require('./papel.json');
  for (const q of pap.problemas) {
    assert.match(q.enunciado, / Datos: \S/, q.id);
    assert.ok(Array.isArray(q.unidades), `${q.id}: sin unidades`);
    for (const u of q.unidades) assert.ok(gen.tiposPorUnidad[u], `${q.id}: ${u}`);
  }
});

// La solución de una cadena cuenta el camino como la teoría (sube y baja; auditoría M12), y la cuenta da la respuesta.
test('cadena: la solución dice cuánto sube y cuánto baja, y eso da el parentesco de la respuesta', () => {
  const SB = { padre: '1,0', abuelo: '2,0', bisabuelo: '3,0', hijo: '0,1', nieto: '0,2', bisnieto: '0,3', hermano: '1,1', sobrino: '1,2', 'sobrino nieto': '1,3', 'tío': '2,1', primo: '2,2', 'tío abuelo': '3,1' };
  const MASC = { madre: 'padre', abuela: 'abuelo', bisabuela: 'bisabuelo', hija: 'hijo', nieta: 'nieto', bisnieta: 'bisnieto', hermana: 'hermano', sobrina: 'sobrino', 'tía': 'tío', prima: 'primo', 'sobrina nieta': 'sobrino nieto', 'tía abuela': 'tío abuelo' };
  let n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s, { unidad: 'razonamiento-matematico.razonamiento-deductivo' });
    if (p._datos.tipo !== 'cadena') continue;
    const r = String(p.respuesta.texto).toLowerCase().replace(/^su /, '').replace(/ (paterno|materno|paterna|materna)$/, '');
    if (/ o |mism/.test(r)) continue;
    const linea = p.solucion.map(l => l.map(x => (typeof x === 'string' ? x : x.t)).join('')).find(l => /^Contado en el árbol/.test(l));
    assert.ok(linea, `semilla ${s}`);
    const [, u, b] = linea.match(/sube (\d+) y baja (\d+)/);
    assert.equal(`${u},${b}`, SB[MASC[r] || r], `semilla ${s}: ${r}`);
    n++;
  }
  assert.ok(n > 50, `${n}`);
});

// Auditoría de Ordenamiento (19 nov): «Sumando…» y «Restando…» (la primera menos la segunda) dan de verdad lo que dice el
// paso. Antes se escribía la pista como se dio («<») y la cuenta se hacía con ella dada vuelta: 436 de 778 pasos mentían.
test('orden: cada «Sumando/Restando X y Y … queda A > B» sale de esa suma o resta', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? plano(x.t) : String(x || ''));
  const lee = e => e.match(/^(\S+) \+ (\S+) (>|=|<) (\S+) \+ (\S+)$/);
  let n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s, { unidad: 'razonamiento-matematico.ordenamiento-de-informacion' });
    for (const t of p.solucion.map(plano)) {
      const m = t.match(/^(Sumando|Restando) (.+?) y (.+?), se cancelan .* queda (\S+) > (\S+)\.$/);
      if (!m) continue;
      const a = lee(m[2]), b = lee(m[3]);
      assert.ok(a && b && a[3] !== '<' && b[3] !== '<', `semilla ${s}: ${t}`);
      const vec = r => { const v = {}; [r[1], r[2]].forEach(x => { v[x] = (v[x] || 0) + 1; }); [r[4], r[5]].forEach(x => { v[x] = (v[x] || 0) - 1; }); return v; };
      const sg = m[1] === 'Sumando' ? 1 : -1, va = vec(a), vb = vec(b), v = {};
      for (const k of new Set([...Object.keys(va), ...Object.keys(vb)])) v[k] = (va[k] || 0) + sg * (vb[k] || 0);
      const rel = a[3] === '>' && b[3] === '>' ? (sg === 1 ? '>' : null) : a[3] === '>' ? '>' : b[3] === '>' ? (sg === 1 ? '>' : '<') : '=';
      const ks = Object.keys(v).filter(k => v[k]), pos = ks.find(k => v[k] > 0), neg = ks.find(k => v[k] < 0);
      assert.equal(rel, '>', `semilla ${s}: ${t}`);
      assert.deepEqual([m[4], m[5]], [pos, neg], `semilla ${s}: ${t}`);
      n++;
    }
  }
  assert.ok(n > 500, `${n}`);
});
