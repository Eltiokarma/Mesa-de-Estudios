// Pruebas del generador «Ponle nombre: moléculas con varios grupos»: casos.json (para verificar aparte, a ciegas),
// el papel y un recálculo independiente en 600 problemas. El camino independiente no usa el plan del generador:
//   - lee la fórmula que ve el alumno (_datos.semi) con un lector propio y arma el grafo de átomos, comprobando la
//     valencia de cada átomo (C 4, O 2, N 3) con los H escritos;
//   - nombra por FUERZA BRUTA: prueba todas las cadenas posibles (todo camino entre dos carbonos) y las dos
//     numeraciones de cada una, elige la cadena con las reglas de la cabecera (grupos principales, largo, enlaces
//     múltiples, prefijos) con el orden de 2013 y también con el de 1993 (enlaces múltiples antes que el largo), exige
//     que las dos den el mismo nombre, y elige la numeración por los localizadores;
//   - el anillo del ácido aromático se recorre desde los seis carbonos en los dos sentidos;
//   - la clase de amina, el éster y la oxidación se recalculan contando átomos en el grafo leído;
//   - la fórmula molecular de _datos.smiles (lector de SMILES mínimo) debe coincidir con la de la semidesarrollada.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Lector de la semidesarrollada ----------
const VAL = { C: 4, O: 2, N: 3, Ph: 1, Ar: 2 };
function nuevoG() { return { at: [], en: [] }; }
const atomo = (G, el, h) => (G.at.push({ el, h }), G.at.length - 1);
const enlace = (G, a, b, o = 1) => G.en.push({ a, b, o });
function partir(s, seps) {
  const out = [], bonds = []; let d = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') d++; if (ch === ')') d--;
    if (d === 0 && seps.includes(ch)) { out.push(cur); bonds.push(ch); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return { unidades: out, enlaces: bonds };
}
const ORDEN = { '-': 1, '=': 2, '≡': 3 };
// Unidad → { ini, fin } (átomo que recibe el enlace de la izquierda y el que da el de la derecha).
function unidad(G, u) {
  const C = h => atomo(G, 'C', h), O = h => atomo(G, 'O', h), N = h => atomo(G, 'N', h);
  const con = (c, ...xs) => { for (const [x, o] of xs) enlace(G, c, x, o); return c; };
  const uno = c => ({ ini: c, fin: c });
  switch (u) {
    case 'HOOC': case 'COOH': return uno(con(C(0), [O(0), 2], [O(1), 1]));
    case 'OHC': case 'CHO': return uno(con(C(1), [O(0), 2]));
    case 'CO': return uno(con(C(0), [O(0), 2]));
    case 'HOCH2': case 'CH2OH': return uno(con(C(2), [O(1), 1]));
    case 'H2NCH2': case 'CH2NH2': return uno(con(C(2), [N(2), 1]));
    case 'HO': case 'OH': return uno(O(1));
    case 'H2N': case 'NH2': return uno(N(2));
    case 'NH': return uno(N(1));
    case 'C6H5': return uno(atomo(G, 'Ph', 0));
    case 'C6H4': return uno(atomo(G, 'Ar', 0));
    case 'CH4': return uno(C(4));
    case 'CH3OH': return uno(con(C(3), [O(1), 1]));
    case 'HCHO': return uno(con(C(2), [O(0), 2]));
    case 'HCOOH': return uno(con(C(1), [O(0), 2], [O(1), 1]));
    case 'COO': { const c = con(C(0), [O(0), 2]), o = O(0); enlace(G, c, o); return { ini: c, fin: o }; }
    case 'HCOO': { const c = con(C(1), [O(0), 2]), o = O(0); enlace(G, c, o); return { ini: c, fin: o }; }
    case 'OOC': { const c = con(C(0), [O(0), 2]), o = O(0); enlace(G, o, c); return { ini: o, fin: c }; }
    case 'OOCH': { const c = con(C(1), [O(0), 2]), o = O(0); enlace(G, o, c); return { ini: o, fin: c }; }
  }
  // General: (rama)k … C|N Hk (rama)k …
  let i = 0; const ramas = [];
  const leerRamas = () => {
    while (u[i] === '(') {
      let d = 0, j = i;
      for (; j < u.length; j++) { if (u[j] === '(') d++; if (u[j] === ')') { d--; if (!d) break; } }
      const x = u.slice(i + 1, j); i = j + 1;
      let k = 1; if (/\d/.test(u[i] || '')) k = +u[i++];
      for (let r = 0; r < k; r++) ramas.push(x);
    }
  };
  leerRamas();
  const el = u[i++]; if (el !== 'C' && el !== 'N') throw new Error(`no entiendo «${u}»`);
  let h = 0;
  if (u[i] === 'H') { i++; h = /\d/.test(u[i] || '') ? +u[i++] : 1; }
  leerRamas();
  if (i !== u.length) throw new Error(`sobra algo en «${u}»`);
  const c = atomo(G, el, h);
  for (const x of ramas) { const L = linea(G, x); enlace(G, c, L.ini); }
  return uno(c);
}
function linea(G, s) {
  const { unidades, enlaces } = partir(s, ['-', '=', '≡']);
  let prim = null, ant = null;
  unidades.forEach((u, k) => {
    const U = unidad(G, u);
    if (ant) enlace(G, ant.fin, U.ini, ORDEN[enlaces[k - 1]]);
    else prim = U;
    ant = U;
  });
  return { ini: prim.ini, fin: ant.fin };
}
function leer(s) {
  const G = nuevoG(); linea(G, s);
  G.at.forEach((a, i) => {
    const b = G.en.filter(e => e.a === i || e.b === i).reduce((t, e) => t + e.o, 0);
    assert.equal(b + a.h, VAL[a.el], `valencia del átomo ${i} (${a.el}) en «${s}»`);
  });
  return G;
}
function vecinos(G) {
  const v = G.at.map(() => []);
  G.en.forEach(e => { v[e.a].push({ j: e.b, o: e.o }); v[e.b].push({ j: e.a, o: e.o }); });
  return v;
}

// ---------- Nombrador por fuerza bruta ----------
const RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
const MUL = { 2: 'di', 3: 'tri', 4: 'tetra', 5: 'penta', 6: 'hexa' };
const sinTilde = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const alfa = (a, b) => { const x = sinTilde(a).replace(/[^a-z]/g, ''), y = sinTilde(b).replace(/[^a-z]/g, ''); return x < y ? -1 : x > y ? 1 : 0; };
const lex = (a, b) => { for (let k = 0; k < Math.min(a.length, b.length); k++) if (a[k] !== b[k]) return a[k] - b[k]; return a.length - b.length; };
const lexLista = (A, B) => { for (let k = 0; k < A.length; k++) { const c = lex(A[k], B[k]); if (c) return c; } return 0; };
const asc = a => a.slice().sort((x, y) => x - y);

function nombrarG(G, op = {}) {
  const at = G.at, v = vecinos(G), esC = i => at[i].el === 'C';
  const Cs = at.map((a, i) => i).filter(esC);
  const oxo = i => v[i].filter(x => at[x.j].el === 'O' && x.o === 2).length;
  const oh = i => v[i].filter(x => at[x.j].el === 'O' && x.o === 1 && at[x.j].h === 1).length;
  const nh2 = i => v[i].filter(x => at[x.j].el === 'N' && at[x.j].h === 2).length;
  const cv = i => v[i].filter(x => esC(x.j)).map(x => x.j);
  const cooh = i => esC(i) && oxo(i) === 1 && oh(i) === 1 && cv(i).length <= 1;
  const nCOOH = Cs.filter(cooh).length, carbox = nCOOH >= 3;
  const tipo = nCOOH ? 'acido' : Cs.some(i => oxo(i) && at[i].h >= 1) ? 'aldehido' : Cs.some(oxo) ? 'cetona' : Cs.some(oh) ? 'alcohol' : 'amina';
  const permitido = i => esC(i) && !(carbox && cooh(i));
  // Todas las cadenas: el camino entre cada par de carbonos permitidos (el esqueleto es un árbol).
  const camino = (a, b) => {
    const prev = new Map([[a, -1]]), cola = [a];
    while (cola.length) { const x = cola.shift(); for (const y of cv(x)) if (permitido(y) && !prev.has(y)) { prev.set(y, x); cola.push(y); } }
    if (!prev.has(b)) return null;
    const p = []; for (let x = b; x !== -1; x = prev.get(x)) p.unshift(x); return p;
  };
  const cand = [];
  for (const a of Cs) for (const b of Cs) if (permitido(a) && permitido(b)) { const p = camino(a, b); if (p) cand.push(p); }
  // Rasgos de una cadena con su numeración (posición k → localizador k + 1).
  function rasgosCadena(ch) {
    const enC = new Set(ch), pos = new Map(ch.map((x, k) => [x, k + 1]));
    const pri = [], pre = [], mul = [];
    ch.forEach((x, k) => {
      const L = k + 1, ext = k === 0 || k === ch.length - 1;
      // Grupo principal sobre este carbono.
      let usado = { oxo: false, oh: 0, nh2: 0, cooh: new Set() };
      if (tipo === 'acido' && !carbox && cooh(x) && ext) { pri.push(L); usado.oxo = true; usado.oh = 1; }
      if (tipo === 'acido' && carbox) for (const y of cv(x)) if (cooh(y)) { pri.push(L); usado.cooh.add(y); }
      if (tipo === 'aldehido' && oxo(x) && at[x].h >= 1 && ext) { pri.push(L); usado.oxo = true; }
      if (tipo === 'cetona' && oxo(x) && cv(x).every(y => enC.has(y)) && cv(x).length === 2) { pri.push(L); usado.oxo = true; }
      if (tipo === 'alcohol') for (let r = 0; r < oh(x); r++) { pri.push(L); usado.oh++; }
      if (tipo === 'amina') for (let r = 0; r < nh2(x); r++) { pri.push(L); usado.nh2++; }
      // Prefijos: lo que cuelga y no es el grupo principal.
      let ohs = oh(x) - usado.oh, nhs = nh2(x) - usado.nh2;
      if (oxo(x) && !usado.oxo) pre.push({ n: 'oxo', L });
      for (let r = 0; r < ohs; r++) pre.push({ n: 'hidroxi', L });
      for (let r = 0; r < nhs; r++) pre.push({ n: 'amino', L });
      for (const y of v[x].map(z => z.j)) {
        if (enC.has(y) || usado.cooh.has(y)) continue;
        if (at[y].el === 'Ph') pre.push({ n: 'fenil', L });
        else if (at[y].el === 'Ar') pre.push({ n: v[y].some(z => at[z.j].el === 'O' && at[z.j].h === 1) ? '(4-hidroxifenil)' : '?', L });
        else if (esC(y)) {
          if (cooh(y)) { pre.push({ n: 'carboxi', L }); continue; }
          // Rama de carbonos: se cuentan y se revisa que sea recta y sin heteroátomos.
          const vis = new Set([x, y]), pila = [y]; let c = 0, raro = false;
          while (pila.length) { const z = pila.pop(); if (esC(z)) c++; else raro = true; if (esC(z) && (oxo(z) || oh(z) || nh2(z))) raro = true;
            for (const w of v[z].map(q => q.j)) if (!vis.has(w)) { vis.add(w); pila.push(w); } }
          pre.push({ n: raro ? '?' : c === 1 ? 'metil' : c === 2 ? 'etil' : '?', L });
        }
      }
      if (k < ch.length - 1) { const o = v[x].find(z => z.j === ch[k + 1]).o; if (o > 1) mul.push({ L, o }); }
    });
    return { n: ch.length, pri, pre, mul };
  }
  const R = cand.flatMap(ch => [ch, ch.slice().reverse()]).map(ch => ({ ch, r: rasgosCadena(ch) }));
  const elegirCadena = orden => {
    const llave = ({ r }) => {
      const k = { pri: r.pri.length, largo: r.n, mul: r.mul.length, dob: r.mul.filter(m => m.o === 2).length, pre: r.pre.length };
      return orden.map(x => k[x]);
    };
    const mejor = R.reduce((m, x) => { const a = llave(x), b = m.length ? llave(m[0]) : null; const c = b ? lex(b, a) : -1; return c < 0 ? [x] : c === 0 ? [...m, x] : m; }, []);
    // Numeración: localizadores más bajos (principal, múltiples, dobles, prefijos, alfabético).
    const crit = ({ r }) => [asc(r.pri), asc(r.mul.map(m => m.L)), asc(r.mul.filter(m => m.o === 2).map(m => m.L)), asc(r.pre.map(p => p.L)),
      ...[...new Set(r.pre.map(p => p.n))].sort(alfa).map(nm => asc(r.pre.filter(p => p.n === nm).map(p => p.L)))];
    const orden2 = mejor.slice().sort((a, b) => lexLista(crit(a), crit(b)));
    return orden2[0];
  };
  const e13 = elegirCadena(['pri', 'largo', 'mul', 'dob', 'pre']), e93 = elegirCadena(['pri', 'mul', 'largo', 'dob', 'pre']);
  const nom = escribirNombre(tipo, carbox, e13.r, op), nom93 = escribirNombre(tipo, carbox, e93.r, op);
  assert.equal(nom, nom93, 'las reglas de 1993 y de 2013 dan nombres distintos');
  return { nombre: nom, tipo, n: e13.r.n, carbox };
}
function escribirNombre(tipo, carbox, r, op = {}) {
  const grupos = {};
  for (const p of r.pre) (grupos[p.n] = grupos[p.n] || []).push(p.L);
  if (grupos['?']) return '?';
  const prefijos = Object.keys(grupos).sort(alfa).map(nm => { const l = asc(grupos[nm]); return `${l.join(',')}-${l.length > 1 ? MUL[l.length] : ''}${nm}`; }).join('-');
  const dob = asc(r.mul.filter(m => m.o === 2).map(m => m.L)), tri = asc(r.mul.filter(m => m.o === 3).map(m => m.L));
  let tallo = RAIZ[r.n];
  if (dob.length + tri.length === 0) tallo += 'an';
  else {
    const multiplicador = dob.length > 1 || (dob.length === 0 && tri.length > 1);
    tallo += (multiplicador ? 'a' : '') + (dob.length ? `-${dob}-${MUL[dob.length] || ''}en` : '') + (tri.length ? `-${tri}-${MUL[tri.length] || ''}in` : '');
  }
  const pl = asc(r.pri), c = pl.length;
  const sufijo = {
    acido: carbox ? `-${pl}-${MUL[c]}carboxílico` : (c === 2 ? 'dioico' : 'oico'),
    aldehido: c === 2 ? 'dial' : 'al',
    cetona: `-${pl}-${MUL[c] || ''}ona`,
    alcohol: op.sinLocCorto && r.n <= 2 && !r.pre.length && c === 1 ? 'ol' : `-${pl}-${c === 1 ? '' : c <= 3 ? MUL[c] : MUL[c].slice(0, -1)}ol`,
    amina: `-${pl}-${MUL[c] || ''}amina`,
  }[tipo];
  const vocal = /^[aeiou]/.test(sufijo.replace(/^-[0-9,]+-/, ''));
  const nombre = prefijos + tallo + (vocal ? '' : 'o') + sufijo;
  return tipo === 'acido' ? 'ácido ' + nombre : nombre;
}
// Ácido aromático: «C(COOH)=CH-…-» con seis carbonos.
function nombrarAnillo(semi) {
  const s = semi.replace(/-$/, '');
  const { unidades } = partir(s, ['-', '=']);
  assert.equal(unidades.length, 6, semi);
  const R = unidades.map(u => (u === 'CH' ? null : { '(COOH)': 'COOH', '(OH)': 'OH', '(NH2)': 'NH2', '(CH3)': 'CH3' }[u.slice(1)]));
  assert.ok(R.every(x => x !== undefined), semi);
  const NOM = { OH: 'hidroxi', NH2: 'amino', CH3: 'metil' };
  let mejor = null;
  for (let ini = 0; ini < 6; ini++) for (const d of [1, -1]) {
    if (R[ini] !== 'COOH') continue;
    const pre = [];
    for (let k = 1; k < 6; k++) { const x = R[(ini + d * k + 12) % 6]; if (x) pre.push({ n: NOM[x], L: k + 1 }); }
    const crit = [asc(pre.map(p => p.L)), ...[...new Set(pre.map(p => p.n))].sort(alfa).map(nm => asc(pre.filter(p => p.n === nm).map(p => p.L)))];
    if (!mejor || lexLista(crit, mejor.crit) < 0) mejor = { crit, pre };
  }
  const g = {}; for (const p of mejor.pre) (g[p.n] = g[p.n] || []).push(p.L);
  return 'ácido ' + Object.keys(g).sort(alfa).map(nm => `${asc(g[nm]).join(',')}-${g[nm].length > 1 ? MUL[g[nm].length] : ''}${nm}`).join('-') + 'benzoico';
}

// ---------- Fórmula molecular desde un SMILES mínimo y desde el grafo ----------
function formulaSmiles(s) {
  const at = [], en = [], pila = [], anillos = {};
  let prev = null, orden = 1;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') { pila.push(prev); continue; }
    if (ch === ')') { prev = pila.pop(); continue; }
    if (ch === '=') { orden = 2; continue; }
    if (ch === '#') { orden = 3; continue; }
    if (/\d/.test(ch)) { if (anillos[ch] !== undefined) { en.push({ a: anillos[ch], b: prev, o: 1.5 }); delete anillos[ch]; } else anillos[ch] = prev; continue; }
    const arom = ch === 'c', el = ch.toUpperCase();
    at.push({ el, arom }); const k = at.length - 1;
    if (prev !== null) en.push({ a: prev, b: k, o: arom && at[prev].arom ? 1.5 : orden });
    prev = k; orden = 1;
  }
  const f = { C: 0, H: 0, N: 0, O: 0 };
  at.forEach((a, i) => { const b = en.filter(e => e.a === i || e.b === i).reduce((t, e) => t + e.o, 0); f[a.el]++; f.H += Math.round({ C: 4, N: 3, O: 2 }[a.el] - b); });
  return f;
}
function formulaG(G) {
  const f = { C: 0, H: 0, N: 0, O: 0 };
  for (const a of G.at) {
    if (a.el === 'Ph') { f.C += 6; f.H += 5; } else if (a.el === 'Ar') { f.C += 6; f.H += 4; } else { f[a.el]++; f.H += a.h; }
  }
  return f;
}
function formulaAnillo(semi) {
  const { unidades } = partir(semi.replace(/-$/, ''), ['-', '=']);
  const f = { C: 6, H: 0, N: 0, O: 0 }, SUST = { COOH: { C: 1, H: 1, O: 2 }, OH: { H: 1, O: 1 }, NH2: { N: 1, H: 2 }, CH3: { C: 1, H: 3 } };
  for (const u of unidades) { if (u === 'CH') f.H++; else for (const [k, x] of Object.entries(SUST[u.slice(2, -1)])) f[k] += x; }
  return f;
}

// ---------- Recálculo independiente de cada tipo ----------
const CLASE = ['', 'primaria', 'secundaria', 'terciaria'];
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'nombre') return 'nom:' + (d.familia === 'aromatico' ? nombrarAnillo(d.semi) : nombrarG(leer(d.semi)).nombre);
  if (d.tipo === 'cadena') return nombrarG(leer(d.semi)).n;
  if (d.tipo === 'sufijo') return 'suf:' + nombrarG(leer(d.semi)).tipo;
  if (d.tipo === 'amina') {
    const G = leer(d.semi), v = vecinos(G), n = G.at.findIndex(a => a.el === 'N');
    return 'am:' + CLASE[v[n].filter(x => G.at[x.j].el === 'C').length];
  }
  if (d.tipo === 'ester') return 'es:' + partesEster(d.semi).join('|');
  if (d.tipo === 'oxidacion') {
    const S = d.secuencia.map(s => estadoC(s, d.sub));
    if (d.paso === 'estado') return `eo:${S[d.j].eo}:${S[d.j].hib}`;
    if (d.paso === 'cambio') return 'hib:' + S.findIndex(x => x.hib !== 'sp3');
    return 'serie:' + S.map(x => x.eo).join(',');
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
// Éster: el C con =O y −O− es el del ácido. Se corta el enlace O–C del alcohol, se pone −OH a cada lado y se nombran.
function partesEster(semi) {
  const G = leer(semi), v = vecinos(G);
  const c = G.at.findIndex((a, i) => a.el === 'C' && v[i].some(x => G.at[x.j].el === 'O' && x.o === 2) && v[i].some(x => G.at[x.j].el === 'O' && x.o === 1));
  const o = v[c].find(x => G.at[x.j].el === 'O' && x.o === 1).j, r = v[o].find(x => x.j !== c).j;
  const sub = (desde, prohibido) => { const vis = new Set([desde]), pila = [desde]; while (pila.length) { const z = pila.pop(); for (const w of v[z].map(q => q.j)) if (w !== prohibido && !vis.has(w)) { vis.add(w); pila.push(w); } } return vis; };
  const copia = (set, extra) => {
    const H = nuevoG(), idx = new Map();
    for (const i of set) idx.set(i, atomo(H, G.at[i].el, G.at[i].h));
    for (const e of G.en) if (set.has(e.a) && set.has(e.b)) enlace(H, idx.get(e.a), idx.get(e.b), e.o);
    const oh = atomo(H, 'O', 1); enlace(H, idx.get(extra), oh);
    return H;
  };
  const acido = copia(sub(c, o), c), alcohol = copia(sub(r, o), r);
  return [nombrarG(acido).nombre, nombrarG(alcohol, { sinLocCorto: true }).nombre];
}
function estadoC(semi, sub) {
  const G = leer(semi), v = vecinos(G);
  const Cs = G.at.map((a, i) => i).filter(i => G.at[i].el === 'C');
  // El carbono que se oxida: el que tiene O (o, en el alcano, el último escrito; en «dos», el primero).
  const conO = Cs.filter(i => v[i].some(x => G.at[x.j].el === 'O'));
  const i = conO.length ? conO[sub === 'dos' ? 0 : conO.length - 1] : Cs[sub === 'dos' ? 0 : Cs.length - 1];
  const eo = v[i].filter(x => G.at[x.j].el === 'O').reduce((t, x) => t + x.o, 0) - G.at[i].h;
  const hib = v[i].some(x => x.o === 3) ? 'sp' : v[i].some(x => x.o === 2) ? 'sp2' : 'sp3';
  return { eo, hib };
}

probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

test('la fórmula de _datos.smiles coincide con la semidesarrollada; cada nombre correcto es de una sola molécula', () => {
  const porNombre = new Map();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (!d.smiles) continue;
    const f1 = formulaSmiles(d.smiles);
    const f2 = d.familia === 'aromatico' ? formulaAnillo(d.semi) : formulaG(leer(d.semi));
    assert.deepEqual(f1, f2, `semilla ${s}: ${d.smiles} contra ${d.semi}`);
    if (d.tipo === 'nombre') {
      const k = p.respuesta.valor;
      if (!porNombre.has(k)) porNombre.set(k, new Set());
      porNombre.get(k).add(JSON.stringify(f1));
    }
  }
  for (const [k, set] of porNombre) assert.equal(set.size, 1, `${k} sale con fórmulas distintas`);
});

test('salen los seis tipos, las ocho familias, la línea con rama y los errores clave', () => {
  const tipos = new Set(), fams = new Set(), ids = new Set(); let rama = 0;
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo); if (p._datos.tipo === 'nombre') fams.add(p._datos.familia);
    if (p._datos.dibujo === 'rama') rama++;
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...tipos].sort(), ['amina', 'cadena', 'ester', 'nombre', 'oxidacion', 'sufijo']);
  assert.deepEqual([...fams].sort(), ['acidoSec', 'aminoacido', 'aromatico', 'azucar', 'bifuncional', 'diacido', 'diolEnIno', 'tricarboxilico']);
  assert.ok(rama >= 20, `pocas líneas con rama: ${rama}`);
  for (const id of ['HC3-cadena-horizontal', 'HC3-numeracion-al-reves', 'AQ-carboxilo-en-cadena', 'AQ-numera-por-insaturacion', 'FO4-sufijo-del-secundario',
    'AQ-oxo-por-hidroxi', 'AQ-metil-por-etil', 'HC3-orden-por-localizador', 'AQ-numera-desde-hidroxilo', 'AQ-bencilo-por-fenilo', 'AQ-amina-como-alcohol',
    'AQ-ester-partes-cruzadas', 'FO3-ester-por-eter', 'AQ-sin-localizador-del-sufijo', 'AQ-carboxilo-sp3', 'AQ-oh-da-sp2', 'AQ-aldehido-sp', 'AQ-falta-localizador', 'AQ-olvida-multiplicador'])
    assert.ok(ids.has(id), `no aparece ${id}`);
});

test('el ácido cítrico, la fenilalanina, la tirosina, la aldohexosa y el etano-1,2-diol no salen, y las opciones de nombre no se delatan por el largo', () => {
  let n = 0, larga = 0;
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s);
    for (const x of ['ácido 2-hidroxipropano-1,2,3-tricarboxílico', 'ácido 2-amino-3-fenilpropanoico', 'ácido 2-amino-3-(4-hidroxifenil)propanoico', '2,3,4,5,6-pentahidroxihexanal'])
      assert.ok(!p.alternativas.some(a => a.correcta && a.texto === x), `semilla ${s}: sale ${x}`);
    if (p._datos.secuencia) assert.ok(!p._datos.secuencia.includes('HOCH2-CH2OH'), `semilla ${s}: sale la secuencia del etano-1,2-diol`);
    if (p._datos.tipo !== 'nombre') continue;
    n++;
    const L = p.alternativas.map(a => [...a.texto].length), c = p.alternativas.findIndex(a => a.correcta);
    if (L.every((l, i) => i === c || l < L[c])) larga++;
  }
  assert.ok(larga / n <= 0.35, `la correcta es la más larga, sola, en el ${Math.round(100 * larga / n)} % de los nombres`);
});

test('en pantalla la fórmula lleva subíndices y los grupos su color', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const x of p.enunciado) if (x && x.v) assert.ok(p.variables[x.v], `semilla ${s}: variable ${x.v} sin color`);
    const txt = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    if (p._datos.semi) assert.ok(!/[A-Z]\d/.test(txt), `semilla ${s}: dígito sin subíndice en ${txt}`);
  }
});


// ---------- Nombre sin el número del sufijo: debe servir para dos o más moléculas ----------
// Se lee el nombre (prefijos, raíz, enlaces y sufijo -ona/-ol/-amina sin número), se pone el grupo principal en cada carbono
// de la cadena recta, se descartan las moléculas imposibles y se nombran las demás con el nombrador por fuerza bruta.
function moleculasSinLocalizador(nombre) {
  const m = nombre.match(/^(.*?)(met|et|prop|but|pent|hex|hept|oct)((?:an)|a?(?:-[\d,]+-(?:di)?en)?(?:-[\d,]+-(?:di)?in)?)o?(ona|ol|amina)$/);
  assert.ok(m, `no leo «${nombre}»`);
  const [, pre, raiz, tallo, suf] = m, n = RAIZ.indexOf(raiz);
  const prefijos = [];
  for (const g of pre.matchAll(/([\d,]+)-(?:di|tri|tetra|penta)?(hidroxi|amino|oxo|metil|etil)/g)) for (const L of g[1].split(',')) prefijos.push({ n: g[2], L: +L });
  const orden = Array(n + 1).fill(1);
  for (const [x, o] of [[/-([\d,]+)-(?:di)?en/, 2], [/-([\d,]+)-(?:di)?in/, 3]]) { const y = tallo.match(x); if (y) for (const L of y[1].split(',')) orden[+L] = o; }
  const nombres = new Set();
  for (let k = 1; k <= n; k++) {
    const G = nuevoG(), C = [];
    for (let i = 1; i <= n; i++) C[i] = atomo(G, 'C', 0);
    for (let i = 1; i < n; i++) enlace(G, C[i], C[i + 1], orden[i]);
    const grupos = prefijos.map(p => [p.n, p.L]).concat([[{ ona: 'oxo', ol: 'hidroxi', amina: 'amino' }[suf], k]]);
    const het = Array(n + 1).fill(0);
    for (const [g, L] of grupos) {
      if (g === 'hidroxi') { enlace(G, C[L], atomo(G, 'O', 1)); het[L]++; }
      if (g === 'amino') { enlace(G, C[L], atomo(G, 'N', 2)); het[L]++; }
      if (g === 'oxo') { enlace(G, C[L], atomo(G, 'O', 0), 2); het[L] += 2; }
      if (g === 'metil') enlace(G, C[L], atomo(G, 'C', 3));
      if (g === 'etil') { const a = atomo(G, 'C', 2); enlace(G, C[L], a); enlace(G, a, atomo(G, 'C', 3)); }
    }
    let ok = true;
    for (let i = 1; i <= n; i++) {
      const b = G.en.filter(e => e.a === C[i] || e.b === C[i]).reduce((t, e) => t + e.o, 0);
      const multiple = (i > 1 && orden[i - 1] > 1) || (i < n && orden[i] > 1);
      if (b > 4 || het[i] > 2 || (het[i] && multiple) || (het[i] === 2 && grupos.some(([g, L]) => L === i && g === 'oxo') && (i === 1 || i === n))) ok = false;
      G.at[C[i]].h = 4 - b;
    }
    if (!ok) continue;
    const r = nombrarG(G);
    if (r.tipo !== { ona: 'cetona', ol: 'alcohol', amina: 'amina' }[suf]) continue;
    if (r.nombre.replace(/-[\d,]+-((?:di|tri|tetr|pent)?(?:ona|ol|amina))$/, '$1') === nombre) nombres.add(r.nombre);
  }
  return nombres;
}

test('un nombre sin el número del sufijo solo se ofrece si sirve para dos o más moléculas (20000 semillas)', () => {
  let n = 0;
  for (let s = 0; s < 20000; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) if (a.error && a.error.id === 'AQ-sin-localizador-del-sufijo') {
      n++;
      const mol = moleculasSinLocalizador(a.texto);
      assert.ok(mol.size >= 2, `semilla ${s}: «${a.texto}» solo puede ser ${[...mol].join(', ')}`);
    }
  }
  assert.ok(n >= 50, `pocas opciones sin localizador: ${n}`);
});

test('ninguna opción nombra la misma molécula con la regla de 1993 (…carboxi…dioico, -dicarboxílico)', () => {
  for (let s = 0; s < 5000; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) {
      assert.ok(!/carboxi.*dioico|dicarboxílico/.test(a.texto), `semilla ${s}: ${a.texto}`);
      if (p._datos.tipo === 'cadena' && p._datos.familia === 'tricarboxilico') assert.notEqual(a.valor, p.respuesta.valor + 2, `semilla ${s}`);
    }
  }
});

test('en cada tipo la correcta es la más larga, sola, a lo más en el 35 % de los problemas', () => {
  const cuenta = {};
  for (let s = 0; s < 4000; s++) {
    const p = gen.generar(s), t = p._datos.tipo, c = cuenta[t] = cuenta[t] || { n: 0, larga: 0 };
    const L = p.alternativas.map(a => [...a.texto].length), k = p.alternativas.findIndex(a => a.correcta);
    c.n++; if (L.every((l, i) => i === k || l < L[k])) c.larga++;
  }
  for (const [t, c] of Object.entries(cuenta)) assert.ok(c.larga / c.n <= 0.35, `${t}: ${Math.round(100 * c.larga / c.n)} %`);
});

// ---------- casos.json y papel ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.clave);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

test('papel.json: entre 8 y 10 problemas con pasos, y sus verificaciones dan lo esperado', () => {
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const q of papel.problemas) {
    assert.ok(q.enunciado && q.respuesta && q.pasos.length >= 2, q.id);
    assert.ok((q.verificar || []).length, `${q.id}: sin verificar`);
    for (const ver of q.verificar) {
      const [x] = ver.args;
      if (ver.fn === 'nombre') assert.equal(nombrarG(leer(x)).nombre, ver.espera, q.id);
      else if (ver.fn === 'anillo') assert.equal(nombrarAnillo(x), ver.espera, q.id);
      else if (ver.fn === 'cadena') assert.equal(nombrarG(leer(x)).n, ver.espera, q.id);
      else if (ver.fn === 'amina') { const G = leer(x), v = vecinos(G), n = G.at.findIndex(a => a.el === 'N'); assert.equal(CLASE[v[n].filter(y => G.at[y.j].el === 'C').length], ver.espera, q.id); }
      else if (ver.fn === 'ester') assert.deepEqual(partesEster(x), ver.espera, q.id);
      else if (ver.fn === 'estado') assert.deepEqual(estadoC(x, ver.args[1] || 'terminal'), ver.espera, q.id);
      else throw new Error(`fn desconocida ${ver.fn}`);
    }
  }
});
