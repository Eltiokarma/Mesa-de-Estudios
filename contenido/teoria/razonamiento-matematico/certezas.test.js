// Pruebas propias de «Certezas» (etapa 7: las seis ideas rehechas).
// Todo se vuelve a resolver aquí con un resolvedor propio, que no usa el código de la unidad: lee el TEXTO que ve el
// alumno (enunciado o pregunta y recuadro «Datos») y prueba todas las extracciones posibles (las cantidades de cada clase,
// todos los grupos de fichas o un conjunto independiente máximo) o, en las llaves, todas las estrategias contra todos los
// repartos (minimax) hasta 4 llaves.
//   1. Los juegos (la misión se cumple solo con el peor caso) y las predicciones de las seis ideas.
//   2. Los 90 ejemplos: la respuesta y, en los de nivel 3, la letra, y que cada alternativa incorrecta no es la respuesta.
//   3. «Ahora tú» en 400 semillas por idea: una sola opción correcta, la que da la fuerza bruta; los errores dan su valor.
//   4. «Así se resuelve» en 200 semillas: la respuesta es la de la fuerza bruta.
//   5. Lo que no se repite (ni el juego ni la predicción en «Ahora tú»), la paleta, las letras repartidas y el validador
//      con calidad 2 (la marca la puso el cierre: lector en frío y auditor).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./certezas.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const plano = x => Teoria.plano(x);
const idea = id => def.ideas.find(i => i.id === id);
const COL = { roja: 'R', rojas: 'R', verde: 'V', verdes: 'V', negra: 'N', negras: 'N', blanca: 'B', blancas: 'B' };
const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const primo = n => n > 1 && rango(2, n - 1).every(d => n % d);

// ---------- Fuerza bruta ----------
function peorCuentas(topes, logra) {
  let mejor = -1;
  const v = [];
  (function rec(i) {
    if (i === topes.length) { if (!logra(v)) mejor = Math.max(mejor, v.reduce((a, b) => a + b, 0)); return; }
    for (let c = 0; c <= topes[i]; c++) { v.push(c); rec(i + 1); v.pop(); }
  })(0);
  return mejor;
}
// Conjunto independiente máximo: el mayor grupo sin dos que «choquen» (que juntos cumplan la meta).
function mis(xs, malo) {
  const memo = new Map();
  function rec(vivos) {
    if (!vivos.length) return 0;
    const k = vivos.join(',');
    if (memo.has(k)) return memo.get(k);
    const [v, ...resto] = vivos;
    const r = Math.max(rec(resto), 1 + rec(resto.filter(u => !malo(xs[v], xs[u]))));
    memo.set(k, r);
    return r;
  }
  return rec(xs.map((_, i) => i));
}
function peorSub(xs, logra) {
  let mejor = 0;
  for (let m = 0; m < 1 << xs.length; m++) {
    const s = xs.filter((_, i) => (m >> i) & 1);
    if (s.length > mejor && !logra(s)) mejor = s.length;
  }
  return mejor;
}
// Llaves: k llaves y n candados; el menor número de pruebas que asegura saber todas, contra el peor reparto.
function llavesMinimax(k, n) {
  const perms = [];
  (function rec(p) { if (p.length === k) { perms.push(p.slice()); return; } for (let y = 0; y < n; y++) if (!p.includes(y)) { p.push(y); rec(p); p.pop(); } })([]);
  const memo = new Map();
  function mejor(est) {
    const key = est.join(',');
    if (memo.has(key)) return memo.get(key);
    const ps = est.map(i => perms[i]);
    let r = 0;
    if (!rango(0, k - 1).every(x => new Set(ps.map(p => p[x])).size === 1)) {
      r = Infinity;
      for (let x = 0; x < k; x++) for (let y = 0; y < n; y++) {
        const si = est.filter(i => perms[i][x] === y), no = est.filter(i => perms[i][x] !== y);
        if (si.length && no.length) r = Math.min(r, 1 + Math.max(mejor(si), mejor(no)));
      }
    }
    memo.set(key, r);
    return r;
  }
  return mejor(perms.map((_, i) => i));
}
const llaves = (k, n) => (n <= 4 ? llavesMinimax(k, n) : rango(1, k).reduce((s, i) => s + n - i, 0));
assert.equal(llavesMinimax(4, 4), 3 + 2 + 1);
assert.equal(llavesMinimax(2, 4), 3 + 2);

const urnaDe = t => [...t.split('¿')[0].matchAll(/(\d+) (rojas?|verdes?|negras?|blancas?)\b/g)].map(m => [COL[m[2]], +m[1]]);
const num = s => +String(s).replace(/\s/g, '');

// ---------- El resolvedor: lee el texto y devuelve la respuesta ----------
function resolver(t) {
  let m;
  t = t.replace(/ /g, ' ');
  if (/rótulos/.test(t) && /mal puestos/.test(t)) return 1;   // se comprueba aparte (abajo)
  if ((m = t.match(/Hay (\d+) casilleros con candado, pero solo (\d+) llaves/))) return llaves(+m[2], +m[1]);
  if ((m = t.match(/(\d+) candados y (\d+) llaves/) || t.match(/(\d+) armarios con candado y sus (\d+) llaves/) || t.match(/(\d+) casilleros con candado y (?:sus )?(\d+) llaves/)
    || t.match(/(\d+) puertas de aulas y (\d+) llaves/) || t.match(/(\d+) llaves mezcladas para las (\d+) puertas/))) {
    const n = +m[1];
    if (/candado 1, solo ese/.test(t)) return n;
    if (/abre la primera llave/.test(t)) return n - 1;
    const ya = t.match(/Ya se sabe qué llave abre (\d+)/);
    return ya ? llaves(n - +ya[1], n - +ya[1]) : llaves(n, n);
  }
  if ((m = t.match(/(\d+) (?:de ell[oa]s )?cumplan años (el mismo mes|el mismo día de la semana|el mismo día del mes|el mismo día y mes)/))) {
    const k = +m[1], c = { 'el mismo mes': 12, 'el mismo día de la semana': 7, 'el mismo día del mes': 31, 'el mismo día y mes': 366 }[m[2]];
    // Se llena casilla por casilla mientras no haya k en ninguna.
    const cuenta = new Array(c).fill(0); let gente = 0;
    for (;;) { const i = cuenta.findIndex(x => x < k - 1); if (i < 0) break; cuenta[i]++; gente++; }
    const ya = t.match(/ya hay (\d+)/);
    return gente + 1 - (ya ? +ya[1] : 0);
  }
  const pares = [...t.matchAll(/(\d+) pares? de guantes (negros|blancos)/g)];
  if (pares.length) {
    const ps = pares.map(x => [x[2][0].toUpperCase(), +x[1]]), solo = t.match(/un par (negro|blanco) que/), sc = solo ? solo[1][0].toUpperCase() : null;
    return peorCuentas(ps.flatMap(x => [x[1], x[1]]), v => ps.some((x, i) => (!sc || x[0] === sc) && v[2 * i] >= 1 && v[2 * i + 1] >= 1)) + 1;
  }
  const formas = [...t.matchAll(/(rojas|negras): (\d+) cuadradas y (\d+) redondas/g)];
  if (formas.length) return peorCuentas(formas.flatMap(x => [+x[2], +x[3]]), v => formas.some((_, i) => v[2 * i] >= 1 && v[2 * i + 1] >= 1)) + 1;
  if ((m = t.match(/(\d+) medias negras y (\d+) blancas/))) { const k = +t.match(/certeza (\d+) del mismo color/)[1]; return peorCuentas([+m[1], +m[2]], v => Math.max(...v) >= k) + 1; }
  const bil = [...t.matchAll(/(\d+) de S\/ (\d+)/g)];
  if (bil.length) {
    const M = +t.match(/sumen S\/ (\d+)/)[1], vals = bil.map(x => +x[2]);
    return peorCuentas(bil.map(x => +x[1]), v => vals.some((a, i) => vals.some((b, j) => j >= i && a + b === M && (i === j ? v[i] >= 2 : v[i] >= 1 && v[j] >= 1)))) + 1;
  }
  if ((m = t.match(/bolos blancos numerados del 1 al (\d+) y negros/))) {
    const N = +m[1], S = +t.match(/sumen (\d+)/)[1], xs = ['B', 'N'].flatMap(c => rango(1, N).map(x => [c, x]));
    return mis(xs, (a, b) => a[0] !== b[0] && a[1] !== b[1] && a[1] + b[1] === S) + 1;
  }
  if ((m = t.match(/pase de (\d+)/))) {
    const S = +m[1], lst = t.match(/con los números ([\d, y]+)\./);
    const vals = lst ? lst[1].match(/\d+/g).map(Number) : rango(1, +t.match(/numeradas del 1 al (\d+)/)[1]);
    return peorSub(vals, s => s.reduce((a, b) => a + b, 0) > S) + 1;
  }
  if ((m = t.match(/(?:[Cc]artas|fichas|discos numerados) del 1 al (\d+)/)) && /sumen/.test(t)) {
    const N = +m[1], S = +t.match(/sumen (\d+)/)[1], cop = t.match(/(dos|tres) de cada número/), c = cop ? { dos: 2, tres: 3 }[cop[1]] : 1;
    if (/no tienen pareja/.test(t)) return `solos:${rango(1, N).filter(x => !(S - x >= 1 && S - x <= N && S - x !== x)).join(',')}`;
    if (c === 1) return mis(rango(1, N), (a, b) => a + b === S) + 1;
    // Con copias, la meta solo junta a un número con su compañero: cada pareja (o número suelto) se prueba aparte, con todas
    // las cantidades posibles de cada uno, y se suman los máximos.
    let total = 0;
    for (let a = 1; a <= N; a++) {
      const b = S - a;
      if (b >= 1 && b <= N && b < a) continue;
      if (b >= 1 && b <= N && b !== a) total += peorCuentas([c, c], v => v[0] >= 1 && v[1] >= 1);
      else if (b === a) total += peorCuentas([c], v => v[0] >= 2);
      else total += c;
    }
    return total + 1;
  }
  if ((m = t.match(/bolillas (?:van )?del (\d+) al (\d+)/))) {
    let nums = rango(+m[1], +m[2]);
    const ya = t.match(/ya salieron ([^.]+)\./);
    if (ya) { const fuera = ya[1].match(/\d+/g).map(Number); nums = nums.filter(x => !fuera.includes(x)); }
    const imp = nums.filter(x => x % 2).length, par = nums.length - imp;
    if (/producto sea par/.test(t)) return peorCuentas([imp, par], v => v[1] >= 1 && v[0] + v[1] >= 2) + 1;
    if (/suma sea impar/.test(t)) return peorCuentas([imp, par], v => v[0] >= 1 && v[1] >= 1) + 1;
    let cond, q;
    if ((q = t.match(/múltiplos? de (\d+) o de (\d+)/))) cond = x => x % +q[1] === 0 || x % +q[2] === 0;
    else if ((q = t.match(/múltiplos? de (\d+)/))) cond = x => x % +q[1] === 0;
    else if ((q = t.match(/terminan? en (\d)/))) cond = x => x % 10 === +q[1];
    else if (/primo/.test(t)) cond = primo;
    else if (/\bimpar(es)?\b/.test(t)) cond = x => x % 2 === 1;
    else if (/\bpar(es)?\b/.test(t)) cond = x => x % 2 === 0;
    if (/no sirven/.test(t)) return nums.filter(x => !cond(x)).length;
    const kk = t.match(/certeza (una|un|\d+) /), k = /^un/.test(kk[1]) ? 1 : +kk[1];
    const si = nums.filter(cond).length;
    return nums.length <= 16 ? peorSub(nums, s => s.filter(cond).length >= k) + 1 : peorCuentas([nums.length - si, si], v => v[1] >= k) + 1;
  }
  if (/suma de cifras/.test(t)) {
    const N = +t.match(/del 1 al (\d+)/)[1], k = +t.match(/certeza (\d+) cuya/)[1], cnt = {};
    for (let x = 1; x <= N; x++) { const s = String(x).split('').reduce((a, b) => a + +b, 0); cnt[s] = (cnt[s] || 0) + 1; }
    return peorCuentas(Object.values(cnt), v => Math.max(...v) >= k) + 1;
  }
  let urna;
  if ((m = t.match(/hay (\d+) bolitas: (\d+) rojas, la mitad de verdes que de rojas y el resto, negras/))) { const T = +m[1], R = +m[2]; urna = [['R', R], ['V', R / 2], ['N', T - R - R / 2]]; }
  else if ((m = t.match(/había ([^.]+)\. Ya salieron ([^.]+)\./))) {
    const u0 = urnaDe(m[1]), sal = urnaDe(m[2] + ' '), q = t.match(/certeza (\d+) (rojas?|verdes?|negras?|blancas?)/), c = COL[q[2]];
    const u = u0.map(([cc, n]) => [cc, n - sal.filter(x => x[0] === cc).reduce((a, x) => a + x[1], 0)]), i = u.findIndex(x => x[0] === c);
    const falta = +q[1] - sal.filter(x => x[0] === c).reduce((a, x) => a + x[1], 0);
    return peorCuentas(u.map(x => x[1]), v => v[i] >= falta) + 1;
  } else urna = urnaDe(t);
  const topes = urna.map(x => x[1]), cs = urna.map(x => x[0]);
  if ((m = t.match(/salieron (\d+) bolitas sin mirar\. ¿Cuántas (rojas|verdes|negras|blancas) salieron, como mínimo/))) {
    const i = cs.indexOf(COL[m[2]]); let mn = Infinity;
    peorCuentas(topes, v => { if (v.reduce((a, b) => a + b, 0) === +m[1]) mn = Math.min(mn, v[i]); return false; });
    return mn;
  }
  if ((m = t.match(/sin que salga ninguna (\w+)\?/))) { const i = cs.indexOf(COL[m[1]]); return peorCuentas(topes, v => v[i] >= 1); }
  if (/una de cada color/.test(t)) return peorCuentas(topes, v => Math.min(...v) >= 1) + 1;
  if ((m = t.match(/certeza (\d+) del mismo color/))) return peorCuentas(topes, v => Math.max(...v) >= +m[1]) + 1;
  if ((m = t.match(/certeza (\d+) bolitas que sean (\w+) o (\w+)\?/))) { const a = cs.indexOf(COL[m[2]]), b = cs.indexOf(COL[m[3]]); return peorCuentas(topes, v => v[a] + v[b] >= +m[1]) + 1; }
  if ((m = t.match(/certeza (\d+) (\w+) y (\d+) (\w+)\?/))) { const a = cs.indexOf(COL[m[2]]), b = cs.indexOf(COL[m[4]]); return peorCuentas(topes, v => v[a] >= +m[1] && v[b] >= +m[3]) + 1; }
  if ((m = t.match(/certeza (una|\d+) (rojas?|verdes?|negras?|blancas?)\?/))) { const i = cs.indexOf(COL[m[2]]), k = m[1] === 'una' ? 1 : +m[1]; return peorCuentas(topes, v => v[i] >= k) + 1; }
  throw new Error(`no sé leer: ${t}`);
}
// «¿Qué es seguro?»: cada opción se prueba en todas las extracciones de m bolitas.
function seguro(t, opciones) {
  const urna = urnaDe(t), topes = urna.map(x => x[1]), cs = urna.map(x => x[0]), m = +t.match(/salieron (\d+) bolitas/)[1], ext = [];
  peorCuentas(topes, v => { if (v.reduce((a, b) => a + b, 0) === m) ext.push(v.slice()); return false; });
  const lee = o => {
    let q;
    if ((q = o.match(/^Salieron al menos (\d+) (\w+)$/))) { const i = cs.indexOf(COL[q[2]]); return v => v[i] >= +q[1]; }
    if ((q = o.match(/^Salió al menos una (\w+)$/))) { const i = cs.indexOf(COL[q[1]]); return v => v[i] >= 1; }
    if (o === 'Salieron de los tres colores') return v => v.every(x => x >= 1);
    if (o === 'No se puede asegurar nada') return null;
    throw new Error(o);
  };
  let res = opciones.map(o => { const f = lee(o); return f !== null && ext.every(f); });
  if (!res.some(Boolean)) res = opciones.map(o => lee(o) === null);
  return { res, ext, cs };
}
const valor = s => { const m = String(s).replace(/ /g, ' ').match(/(\d[\d ]*)/); return m ? num(m[1]) : null; };

// ---------- 1. Juegos y predicciones ----------
test('juegos: la misión se cumple solo con el peor caso, no al abrir, y el peor caso es el de la fuerza bruta', () => {
  const peor = { 'peor-caso': 8, palomar: 6, 'una-de-cada': 9, condicion: 15, parejas: 4, llaves: 6 };
  // Por fuerza bruta: la tómbola de 5 rojas, 4 verdes y 3 negras; el bingo del 1 al 20; las cartas del 1 al 7.
  assert.equal(peorCuentas([5, 4, 3], v => v[0] >= 2), peor['peor-caso']);
  assert.equal(peorCuentas([5, 4, 3], v => Math.max(...v) >= 3), peor.palomar);
  assert.equal(peorCuentas([5, 4, 3], v => Math.min(...v) >= 1), peor['una-de-cada']);
  assert.equal(peorSub(rango(1, 20), s => s.filter(x => x % 3 === 0).length >= 2), peor.condicion);
  assert.equal(peorSub(rango(1, 7), s => s.some(a => s.some(b => a < b && a + b === 8))), peor.parejas);
  for (const I of def.ideas) {
    const j = I.juega, base = Teoria.inicio(j), casos = Teoria.grilla(j.controles);
    assert.ok(!j.mision.logrado(base), `${I.id}: cumplida al abrir`);
    const cumplen = casos.map(v => Object.assign({}, base, v)).filter(v => j.mision.logrado(v));
    assert.ok(cumplen.length >= 1, I.id);
    for (const v of cumplen) {
      const lect = plano(j.lectura(v));
      assert.ok(!/la meta (ya )?se cumple/.test(lect), `${I.id}: la misión cumplida no puede cumplir la meta (${lect})`);
    }
    // La lectura al abrir no dice cuánto cabe (eso es lo que busca la misión).
    assert.match(plano(j.lectura(base)), /^(Todavía no sale nada|Pruebas: )/, I.id);
  }
});

test('predicciones: la correcta es la de la fuerza bruta, y cada error da el valor que dice', () => {
  const enunciado = {
    'peor-caso': 'En la tómbola hay 5 rojas, 4 verdes y 3 negras. ' + plano(idea('peor-caso').predice.pregunta),
    condicion: plano(idea('condicion').predice.pregunta).replace('del 1 al 20', 'bolillas del 1 al 20'),
  };
  for (const I of def.ideas) {
    const P = I.predice, t = enunciado[I.id] || plano(P.pregunta), r = resolver(t);
    assert.deepEqual(P.opciones.filter(o => o.correcta).map(o => valor(plano(o.texto))), [r], I.id);
    for (const o of P.opciones) if (!o.correcta) assert.notEqual(valor(plano(o.texto)), r, `${I.id}: ${o.id}`);
  }
  // Los errores con su cuenta: sin la que obliga (uno menos), sacar todo (el total), 3 en cada mes (36), todas con todas (100).
  const v = (id, op) => valor(plano(idea(id).predice.opciones.find(o => o.id === op).texto));
  assert.equal(v('peor-caso', 'doce'), 12);
  assert.equal(v('palomar', 'sin1'), 24); assert.equal(v('palomar', 'cada'), 36);
  assert.equal(v('una-de-cada', 'sin1'), 7); assert.equal(v('una-de-cada', 'todo'), 14);
  assert.equal(v('condicion', 'sirven'), rango(1, 20).filter(primo).length + 1);
  assert.equal(v('parejas', 'sinsolas'), 4 + 1);
  assert.equal(v('llaves', 'ultima'), 45 + 10); assert.equal(v('llaves', 'todas'), 100);
});

// ---------- 2. Ejemplos ----------
test('ejemplos: cada respuesta es la de la fuerza bruta, y en los de nivel 3 la letra; 6 veces cada letra', () => {
  const letras = [];
  for (const I of def.ideas) I.ejemplos.forEach((e, k) => {
    const t = plano(e.enunciado), d = `${I.id} ${k + 1} «${e.titulo}»`, resp = plano(e.respuesta), alts = (e.alternativas || []).map(plano);
    if (/¿Qué es seguro\?/.test(t)) {
      const { res } = seguro(t, alts);
      assert.equal(res.filter(Boolean).length, 1, d);
      assert.ok(resp.includes(alts[res.indexOf(true)]), d);
      letras.push('ABCDE'[res.indexOf(true)]);
      return;
    }
    if (/rótulos/.test(t)) {
      // Tres cajas, rótulos «fresa», «limón», «mezcla», todos mal: hay dos repartos posibles; de la rotulada «mezcla»
      // sale fresa o limón, y eso deja un solo reparto. Ninguna otra caja basta con un caramelo.
      const reps = [['L', 'M', 'F'], ['M', 'F', 'L']];
      const basta = b => ['F', 'L'].every(sale => reps.filter(q => q[b] === sale || q[b] === 'M').length <= 1);
      assert.ok(basta(2) && !basta(0) && !basta(1), d);
      letras.push('ABCDE'[alts.indexOf('De una caja')]);
      assert.match(resp, /De una caja/);
      return;
    }
    if (/para la última llave/.test(t)) { assert.match(resp, /Ninguna/); return; }
    const r = resolver(t);
    if (typeof r === 'string') { for (const x of r.slice(6).split(',')) assert.ok(resp.includes(`el ${x}`) || resp.includes(`El ${x}`), d); return; }
    assert.equal(valor(resp), r, d);
    if (alts.length) {
      const vals = alts.map(valor);
      assert.equal(vals.filter(x => x === r).length, 1, `${d}: ${vals}`);
      letras.push('ABCDE'[vals.indexOf(r)]);
    }
  });
  assert.deepEqual(['A', 'B', 'C', 'D', 'E'].map(l => letras.filter(x => x === l).length), [6, 6, 6, 6, 6]);
});

test('ejemplos de nivel 3: la correcta no es la única más larga ni la única más corta', () => {
  for (const I of def.ideas) for (const [k, e] of I.ejemplos.entries()) {
    if (!e.alternativas) continue;
    const L = e.alternativas.map(a => plano(a).length), resp = plano(e.respuesta);
    const i = e.alternativas.map(plano).findIndex(a => resp.includes(a) && !e.alternativas.map(plano).some(b => b !== a && b.includes(a) && resp.includes(b)));
    const c = L[i];
    assert.ok(!(c === Math.max(...L) && L.filter(x => x === c).length === 1), `${I.id} ${k + 1}: la más larga`);
    assert.ok(!(c === Math.min(...L) && L.filter(x => x === c).length === 1), `${I.id} ${k + 1}: la más corta`);
  }
});

// ---------- 3. «Ahora tú» ----------
test('«Ahora tú» en 400 semillas por idea: una sola correcta, la de la fuerza bruta; y lo que dice cada error', () => {
  for (const I of def.ideas) for (let s = 0; s < 400; s++) {
    const a = I.ahoraTu.generar(s), t = plano(a.pregunta), d = `${I.id} semilla ${s}`, ops = a.opciones;
    if (/¿Qué es seguro\?/.test(t)) {
      const { res, ext, cs } = seguro(t, ops.map(o => plano(o.texto)));
      assert.deepEqual(res, ops.map(o => !!o.correcta), d);
      // El contraejemplo de cada distractor es una extracción posible que lo rompe.
      ops.forEach(o => {
        const q = plano(o.siFuera || '').match(/con ([^.:]+?) (?:salen solo|no sale|falta)/);
        if (o.correcta || !q) return;
        const v = cs.map(c => [...q[1].matchAll(/(\d+) (rojas?|verdes?|negras?|blancas?)/g)].filter(x => COL[x[2]] === c).reduce((x, y) => x + +y[1], 0));
        assert.ok(ext.some(w => w.join() === v.join()), `${d}: «${plano(o.siFuera)}» no es una extracción posible`);
      });
      continue;
    }
    const r = resolver(t), vals = ops.map(o => valor(plano(o.texto)));
    assert.deepEqual(ops.filter(o => o.correcta).map(o => valor(plano(o.texto))), [r], `${d}: ${t}`);
    assert.equal(new Set(vals).size, vals.length, d);
    for (const o of ops) {
      if (o.correcta) continue;
      const v = valor(plano(o.texto)), sf = plano(o.siFuera);
      if (/^Armaste bien el peor caso/.test(sf)) assert.equal(v, r - 1, `${d}: ${sf}`);
      if (o.error === 'RMP152') assert.ok(v > r, d);
      if (/^Sumaste una de más/.test(sf)) assert.equal(v, r + 1, d);
      assert.ok(!/undefined|NaN|null/.test(sf), d);
    }
  }
});

// ---------- 4. «Así se resuelve» ----------
test('«Así se resuelve» en 200 semillas por idea: la respuesta es la de la fuerza bruta', () => {
  for (const I of def.ideas) for (let s = 0; s < 200; s++) {
    const c = I.resuelve.generar(s);
    assert.equal(valor(plano(c.respuesta)), resolver(plano(c.enunciado)), `${I.id} semilla ${s}`);
  }
});

// ---------- 5. Lo que no se repite, la paleta y el contrato ----------
test('«Ahora tú» y «Así se resuelve» no traen el caso del juego ni el de la predicción', () => {
  const prohibido = {
    'peor-caso': [/hay 5 rojas, 4 verdes y 3 negras\. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza [23] rojas\?/],
    palomar: [/hay 5 rojas, 4 verdes y 3 negras\. .*3 del mismo color/],
    'una-de-cada': [/(hay|tiene) 5 rojas, 4 verdes y 3 negras\. .*una de cada color/],
    condicion: [/del 1 al 20, .*(2 bolillas con número múltiplo de 3|una bolilla con número primo)\?/],
    parejas: [/del 1 al 7, .*sumen 8\?/, /del 1 al 10, una de cada número, .*sumen 12\?/],
    llaves: [/^Hay (4|10) (casilleros con candado|puertas de aulas) y (4|10) llaves mezcladas;/, /hay (4|10) armarios/],
  };
  for (const I of def.ideas) for (let s = 0; s < 400; s++) for (const t of [plano(I.ahoraTu.generar(s).pregunta), plano(I.resuelve.generar(s).enunciado)]) {
    for (const re of prohibido[I.id]) assert.ok(!re.test(t), `${I.id} semilla ${s}: ${t}`);
  }
});

test('paleta de la rama: ningún texto ni figura en verde o carmín', () => {
  const txt = JSON.stringify(def.ideas.map(I => [I.lee, I.predice, I.mira, I.regla, I.ejemplos, I.juega.leyenda, I.ahoraTu.generar(0), I.resuelve.generar(0)]));
  assert.ok(!/c-[dh]"/.test(txt), 'un texto en verde o carmín');
  for (const I of def.ideas) for (const c of I.juega.controles) assert.ok(!c.color || !/c-[dh]/.test(c.color), `${I.id}: control ${c.id}`);
});

test('la unidad: ids, temas, calidad 2 y validador sin faltas', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const cat = require('../../../catalogo/cursos/razonamiento-matematico.json').unidades.find(u => u.id === def.unidad);
  assert.deepEqual(def.ideas.map(i => i.id), ['peor-caso', 'palomar', 'una-de-cada', 'condicion', 'parejas', 'llaves']);
  assert.deepEqual(cat.requiere, ['razonamiento-matematico.razonamiento-deductivo']);
  assert.deepEqual(Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 }), []);
  assert.deepEqual(Teoria.problemas(def, { temas: cat.temas }), []);
  assert.deepEqual(def.letras, {});
  // Cada idea estrena de 2 a 4 palabras; «peor caso» es de la idea 1 y «casillero», de la 2.
  const G = require('../../../nucleo/glosario.js').porIdea(def);
  assert.ok(G[0].some(e => e.termino === 'peor caso'));
  assert.ok(G[1].some(e => e.termino === 'casillero'));
});

// ---------- 6. Cierre del 19 nov (auditoría y lectores en frío): cada prueba falla con la versión anterior ----------
const Kit = require('../../../nucleo/kit/kit.js');
const textosIdea = (I, semillas = 400) => {
  const out = [];
  out.push(...I.predice.opciones.map(o => o.siFuera || ''));
  for (const e of I.ejemplos) out.push(...e.solucion.map(x => plano(x.texto)));
  for (let s = 0; s < semillas; s++) out.push(...I.ahoraTu.generar(s).opciones.map(o => o.siFuera || ''));
  return out;
};
test('cierre A1: ninguna explicación dice que pedir lo pedido en cada casillero «asegura» algo', () => {
  for (const I of def.ideas) for (const t of textosIdea(I)) assert.ok(!/asegura \d+ en cada|asegura \d+ en todos|Eso asegura/.test(t), `${I.id}: ${t}`);
});
test('cierre A2: en las llaves, lo que se llama «buena suerte» tiene el valor de la buena suerte (la última no se prueba)', () => {
  // Con buena suerte cada llave abre al primer intento y la última no se prueba: k llaves y n candados dan k pruebas si
  // n > k, y n − 1 si n = k.
  const suerte = (k, n) => (k < n ? k : n - 1);
  const I = idea('llaves');
  const caso = t => {
    let m;
    if ((m = t.match(/Hay (\d+) casilleros con candado, pero solo (\d+) llaves/))) return [+m[2], +m[1]];
    if ((m = t.match(/(\d+) llaves mezcladas para las (\d+) puertas/))) return [+m[1], +m[2]];
    m = t.match(/(\d+) (?:candados|casilleros con candado|puertas de aulas|puertas|armarios con candado)/); const n = +m[1];
    const ya = t.match(/Ya se sabe qué llave abre (\d+)/), q = n - (ya ? +ya[1] : 0);
    return [q, q];
  };
  for (let s = 0; s < 400; s++) {
    const p = I.ahoraTu.generar(s), [k, n] = caso(plano(p.pregunta));
    for (const o of p.opciones) {
      const m = (o.siFuera || '').match(/buena suerte[^.]*?: (\d+)\./);
      if (m) assert.equal(+m[1], suerte(k, n), `semilla ${s}: ${o.siFuera}`);
      if (o.error === 'RM6' && k === n) assert.ok(!/^Con buena suerte/.test(o.siFuera), `semilla ${s}: ${o.siFuera}`);
    }
  }
  for (const o of I.predice.opciones) assert.ok(!/buena suerte[^.]*: 10/.test(o.siFuera || ''), o.siFuera);
  for (const e of I.ejemplos.filter(x => x.alternativas && /llave/.test(plano(x.enunciado)))) {
    const [k, n] = caso(plano(e.enunciado)), ex = plano(e.solucion[e.solucion.length - 1].texto);
    for (const m of ex.matchAll(/(\d+) es con buena suerte/g)) assert.equal(+m[1], suerte(k, n), `${e.titulo}: ${ex}`);
  }
});
test('cierre M5: «N cuenta los que sí cumplen» dice cuántos cumplen', () => {
  for (const I of def.ideas) for (const e of I.ejemplos) for (const x of e.solucion) {
    const t = plano(x.texto);
    assert.ok(!/\d+ cuenta (?:los|las) (?:que sí|pares\b|que sí son)/.test(t), `${e.titulo}: ${t}`);
  }
});
test('cierre M7: los dos ejemplos de «ya se saben» no dan la misma cuenta', () => {
  const ya = idea('llaves').ejemplos.filter(e => /Ya se saben/.test(e.titulo)).map(e => plano(e.respuesta));
  assert.equal(ya.length, 2);
  assert.notEqual(ya[0], ya[1]);
});
// Firma de un caso: los números del enunciado y las palabras que deciden la meta. Dos casos con la misma firma son el
// mismo problema (con otro recipiente u otra redacción).
const VOCES = ['mismo color', 'una de cada', 'mes', 'semana', 'día del mes', 'día y mes', 'guantes', 'par negro', 'par blanco', 'múltiplo',
  'primo', ' par', 'impar', 'producto', 'suma sea impar', 'pase de', 'discos', 'billetes', 'candado', 'puerta', 'Ya se sabe', 'pero solo',
  'rojas', 'verdes', 'negras', 'blancas', ' y ', 'dos de cada', 'tres de cada'];
const firma = (id, t) => `${id}|${(t.match(/\d+/g) || []).join(',')}|${VOCES.filter(v => t.includes(v)).join(',')}|${(t.split('certeza')[1] || '').match(/rojas?|verdes?|negras?|blancas?/g) || ''}`;
test('cierre: «Ahora tú» y «Así se resuelve» no repiten un ejemplo, la predicción ni el juego (400 semillas)', () => {
  for (const I of def.ideas) {
    const usados = new Set(I.ejemplos.map(e => firma(I.id, plano(e.enunciado))).concat([firma(I.id, I.predice.datos.join(' ') + ' ' + I.predice.pregunta), firma(I.id, I.predice.pregunta)]));
    for (let s = 0; s < 400; s++) {
      for (const t of [plano(I.ahoraTu.generar(s).pregunta), plano(I.resuelve.generar(s).enunciado)]) {
        const t2 = t.replace(/^Para el sorteo de la kermés, una bolsa tiene|^Una bolsa del sorteo tiene/, 'En la tómbola hay').replace(/^En otro juego de la feria hay fichas/, 'Con cartas')
          .replace(/^En la sala de cómputo hay (\d+) armarios con candado y sus (\d+) llaves, mezcladas\./, 'En el gimnasio hay $1 casilleros con candado y sus $2 llaves, mezcladas.');
        assert.ok(!usados.has(firma(I.id, t2)), `${I.id} semilla ${s}: ${t}`);
      }
    }
  }
});
test('cierre M3: el bingo de «Ahora tú», «Así se resuelve» y los ejemplos muestra los números (ninguna bolilla tapada)', () => {
  const I = idea('condicion');
  const figs = I.ejemplos.map(e => e.figura).filter(Boolean).map(f => f.datos);
  for (let s = 0; s < 40; s++) figs.push(I.ahoraTu.generar(s).dibujo.datos, I.resuelve.generar(s).dibujo.datos);
  for (const d of figs) assert.ok(d.objetos.every(o => o.t !== ''), JSON.stringify(d.meta));
});
test('cierre M2: Así se resuelve de la idea 3 resuelve guantes; los Datos de los guantes piden izquierdo y derecho', () => {
  const I = idea('una-de-cada');
  for (let s = 0; s < 50; s++) assert.match(plano(I.resuelve.generar(s).enunciado), /pares de guantes/);
  const usable = I.predice.datos.find(d => /se (puede )?usa/.test(d));
  assert.ok(usable && /izquierdo/.test(usable) && /derecho/.test(usable), usable);
  for (const x of usable.split(';')) if (/se (puede )?usa/.test(x)) assert.ok(/izquierdo/.test(x) && /derecho/.test(x), x);
});
test('cierre M2: un guante negro que sale conserva su gris (la figura de Mira de la idea 3)', () => {
  const I = idea('una-de-cada');
  const svg = Kit.dibujar ? Kit.dibujar('rm-certeza', I.mira.datos, { corte: 4 }) : require('../../../nucleo/kit/piezas/rm-certeza.js').dibujar(I.mira.datos, { corte: 4 });
  // 4 negros quedan en el cajón (derechos) y 4 izquierdos negros salieron: los 8 con su gris.
  const grises = (svg.match(/fill="currentColor" fill-opacity="0.3"/g) || []).length;
  assert.ok(grises >= 2 * 8, `grises: ${grises}`);
});
test('cierre M1: la regla del palomar multiplica por los casilleros', () => {
  assert.ok(JSON.stringify(idea('palomar').regla.ecuacion).includes('× casilleros'));
  assert.ok(!/menos objetos que eso/.test(idea('palomar').regla.condicion));
});
