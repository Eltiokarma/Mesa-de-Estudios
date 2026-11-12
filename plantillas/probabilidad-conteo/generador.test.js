// Pruebas del generador «probabilidad-conteo»: casos.json (verificados aparte, a ciegas), un recálculo
// independiente por fuerza bruta en cada uno de 600 problemas y las respuestas de papel.json.
// El recálculo no usa fórmulas de conteo: enumera todas las permutaciones, todas las secuencias de
// éxitos y fallos o todas las bolas con nombre, y cuenta con enteros.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const clave = (n, d) => { const f = P.frac(n, d); return `num:${f.n}/${f.d}`; };

// Recorre todas las permutaciones de [0, …, n − 1] (Heap) y llama a f con cada una.
function permutaciones(n, f) {
  const a = Array.from({ length: n }, (_, i) => i), c = Array(n).fill(0);
  f(a);
  let i = 0;
  while (i < n) {
    if (c[i] < i) { const j = i % 2 ? c[i] : 0; [a[j], a[i]] = [a[i], a[j]]; f(a); c[i]++; i = 0; } else { c[i] = 0; i++; }
  }
}
// ¿Las personas de un grupo ocupan lugares contiguos? En ronda, el último lugar toca al primero.
function contiguo(lugares, n, ronda) {
  const s = new Set(lugares), k = lugares.length;
  if (k === n) return true;
  for (let ini = 0; ini < (ronda ? n : n - k + 1); ini++) {
    let ok = true;
    for (let t = 0; t < k; t++) if (!s.has((ini + t) % n)) { ok = false; break; }
    if (ok) return true;
  }
  return false;
}
const memo = new Map();
const recordar = (k, f) => { if (!memo.has(k)) memo.set(k, f()); return memo.get(k); };

// Cuenta las permutaciones de n personas (persona → lugar) en que cada grupo queda contiguo.
function contarJuntos(n, grupos, ronda) {
  return recordar(JSON.stringify({ n, grupos, ronda }), () => {
    let cuenta = 0;
    permutaciones(n, perm => { if (grupos.every(g => contiguo(g.map(x => perm[x]), n, ronda))) cuenta++; });
    let total = 0; permutaciones(n, () => total++);
    return { cuenta, total };
  });
}
const grupos = (tam) => { let i = 0; return tam.map(t => Array.from({ length: t }, () => i++)); };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'bayes') {
    // Una población de 10 000: p_j·100 casos de cada causa, y de ellos p_j·q_j con el efecto.
    const casosCausa = d.p.map(x => x * 100);
    const conEvento = casosCausa.map((c, j) => c * (d.condicion === 'si' ? d.q[j] : 100 - d.q[j]) / 100);
    assert.equal(casosCausa.reduce((a, b) => a + b), 10000);
    return clave(conEvento[d.causa], conEvento.reduce((a, b) => a + b));
  }
  if (d.tipo === 'exactamente') {
    // Cada secuencia de éxitos y fallos con su peso entero (numeradores) sobre el producto de denominadores.
    const ps = d.sub === 'distintas' ? d.p : Array(d.n).fill(d.p);
    let fav = 0, tot = 0;
    for (let m = 0; m < 2 ** ps.length; m++) {
      let w = 1, exitos = 0;
      ps.forEach(([a, b], j) => { const s = (m >> j) & 1; exitos += s; w *= s ? a : b - a; });
      tot += w; if (exitos === d.k) fav += w;
    }
    assert.equal(tot, ps.reduce((acc, [, b]) => acc * b, 1));
    return clave(fav, tot);
  }
  if (d.tipo === 'bloques-prob') {
    if (d.sub === 'materias') {
      const N = d.libros.reduce((a, b) => a + b);
      const { cuenta, total } = contarJuntos(N, grupos(d.libros), false);
      return clave(cuenta, total);
    }
    const { cuenta, total } = contarJuntos(d.n, [[0, 1]], d.lugar === 'ronda');
    return clave(cuenta, total); // en ronda, los giros se cancelan arriba y abajo
  }
  if (d.tipo === 'traspaso') {
    // Bolas con nombre: 'r' es del color pedido. Se recorre cada traspaso ordenado y cada extracción final.
    const caja1 = [...Array(d.A[0]).fill('r'), ...Array(d.A[1]).fill('o')];
    const caja2 = [...Array(d.B[0]).fill('r'), ...Array(d.B[1]).fill('o')];
    let fav = 0, tot = 0;
    const pasar = d.sub === 'una' ? caja1.map((x, i) => [i]) : caja1.flatMap((x, i) => caja1.map((y, j) => [i, j]).filter(([a, b]) => a !== b));
    for (const idx of pasar) {
      const final = caja2.concat(idx.map(i => caja1[i]));
      for (const bola of final) { tot++; if (bola === 'r') fav++; }
    }
    return clave(fav, tot);
  }
  // circular y fila: personas 0..n − 1; los grupos son las primeras.
  const tam = d.b ? [d.a, d.b] : [d.a];
  const { cuenta } = contarJuntos(d.n, grupos(tam), d.tipo === 'circular');
  if (d.tipo === 'circular') { assert.equal(cuenta % d.n, 0); return clave(cuenta / d.n, 1); }
  return clave(cuenta, 1);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const [n, dd] = p.respuesta.valor.slice(4).split('/').map(Number);
    assert.ok(Math.abs(n / dd - c.esperado.respuesta) <= casos.tolerancia, `da ${n}/${dd}`);
    assert.equal(p.respuesta.texto, c.esperado.exacta);
  });
}

const PROBABILIDAD = ['bayes', 'exactamente', 'bloques-prob', 'traspaso'];
test('salen todos los tipos y subtipos, y las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(`${d.tipo}/${d.sub}`);
    const alt = p.alternativas;
    if (PROBABILIDAD.includes(d.tipo)) {
      for (const a of alt) {
        assert.match(a.texto, /^\d+\/\d+$/, `semilla ${s}: «${a.texto}» no es una fracción`);
        const [n, dd] = a.texto.split('/').map(Number);
        assert.ok(n > 0 && n < dd, `semilla ${s}: ${a.texto} no es una probabilidad entre 0 y 1`);
        assert.equal(P.frac(n, dd).d, dd, `semilla ${s}: ${a.texto} no es irreducible`);
      }
    } else {
      for (const a of alt) assert.match(a.texto, /^\d{1,3}( \d{3})*$/, `semilla ${s}: «${a.texto}» no es un entero`);
    }
  }
  assert.deepEqual([...vistos].sort(), ['bayes/dos', 'bayes/tres', 'bloques-prob/materias', 'bloques-prob/pareja', 'circular/dos', 'circular/uno',
    'exactamente/binomial', 'exactamente/distintas', 'fila/dos', 'fila/uno', 'traspaso/dos', 'traspaso/una']);
});

test('ningún distractor da la respuesta correcta (recalculada aparte) y cada error tiene explicación propia', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), esperado = recalcular(p);
    for (const a of p.alternativas.filter(a => !a.correcta)) {
      assert.notEqual(a.valor, esperado, `semilla ${s}: el distractor ${a.error.id} da la correcta`);
      assert.ok(a.error.explicacion.length > 40, `semilla ${s}: explicación corta`);
    }
  }
});

test('los datos son creíbles', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo === 'bayes') {
      assert.equal(d.p.reduce((a, b) => a + b), 100);
      assert.ok(d.p.every(x => x >= 15 && x <= 85) && d.q.every(x => x > 0 && x < 100), `semilla ${s}`);
    }
    if (d.tipo === 'exactamente' && d.sub === 'binomial') assert.ok(d.n <= 5, `semilla ${s}`);
    if (d.tipo === 'bloques-prob' && d.sub === 'materias') assert.ok(d.libros.reduce((a, b) => a + b) <= 8, `semilla ${s}`);
    if (d.n) assert.ok(d.n <= 8, `semilla ${s}: ${d.n} personas`);
    if (d.tipo === 'traspaso') assert.ok(d.A[0] + d.A[1] <= 10 && d.B[0] + d.B[1] <= 9, `semilla ${s}`);
    if (d.tipo === 'circular' || d.tipo === 'fila') assert.ok(Number(p.respuesta.valor.slice(4).split('/')[0]) <= 20000, `semilla ${s}`);
  }
});

test('ningún texto trae «undefined», «NaN» ni «−−», y los colores son los de la app', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto),
      ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)];
    for (const t of textos) assert.ok(!/undefined|NaN|−−|--|\[object/.test(t), `semilla ${s}: «${t}»`);
    const claves = new Set([...p.enunciado, ...p.pregunta, ...p.solucion.flat()].filter(x => typeof x === 'object').map(x => x.v));
    for (const k of claves) assert.ok(p.variables[k], `semilla ${s}: la clave ${k} no está en variables`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.every(c => ['o', 'i', 'h', 'd'].includes(c)), `semilla ${s}: color raro`);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    assert.ok(plano(p.solucion[p.solucion.length - 1]).includes(p.respuesta.texto), `semilla ${s}: el último paso no da la respuesta`);
  }
});

test('papel.json: de 5 a 10 problemas completos, y cada respuesta se recalcula', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const pr of papel.problemas) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta', 'pasos']) assert.ok(pr[campo], `${pr.id}: falta ${campo}`);
    assert.ok(!ids.has(pr.id)); ids.add(pr.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    assert.ok(Array.isArray(pr.pasos) && pr.pasos.length >= 2);
    assert.ok(pr.verificar, `${pr.id}: sin datos para verificar`);
    const r = gen.resolver(pr.verificar);
    assert.equal(r.clave, recalcular({ _datos: pr.verificar }), `${pr.id}: el recálculo por fuerza bruta no coincide`);
    assert.equal(pr.respuesta.replace(/\.$/, ''), r.texto, `${pr.id}: la respuesta escrita no es ${r.texto}`);
    assert.ok(pr.pasos.join(' ').includes(r.texto), `${pr.id}: los pasos no llegan a ${r.texto}`);
  }
});
