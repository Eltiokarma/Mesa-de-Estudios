// Pruebas de «La vitrina de los primos»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (fuerza bruta: divisores, primos, PESI y restos con BigInt), fugas, los tipos
// por idea, los colores de la unidad, la notación, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const DIV = n => { const o = []; for (let k = 1; k <= n; k++) if (n % k === 0) o.push(k); return o; };
const PRIMO = n => DIV(n).length === 2;
const GCD = (a, b) => (b ? GCD(b, a % b) : a);
const PHI = n => { let c = 0; for (let k = 1; k <= n; k++) if (GCD(k, n) === 1) c++; return c; };
const POT = (b, e, m) => Number((BigInt(b) ** BigInt(e)) % BigInt(m));
const SUPS = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const CANON = n => { const o = []; for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) o.push(e > 1 ? p + [...String(e)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('') : String(p)); } return o.join(' × '); };
const exp = (n, p) => { let k = 0; while (n % p === 0) { n /= p; k++; } return k; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'cual-primo': { const m = d.opciones.filter(PRIMO); assert.equal(m.length, 1); return String(m[0]); }
    case 'cuantos-divisores': return String(DIV(d.N).length);
    case 'formas-cuadrado': return String(DIV(d.N).filter(a => a * a <= d.N).length);
    case 'dos-primos': { const s = []; for (let a = 2; a <= d.S / 2; a++) if (PRIMO(a) && PRIMO(d.S - a)) s.push(a * (d.S - a)); assert.equal(s.length, 1); return String(s[0]); }
    case 'hasta-primo': { let m = 0; for (let q = 2; q * q <= d.N; q++) if (PRIMO(q)) m = q; return String(m); }
    case 'menor-primo': return String(DIV(d.N)[1]);
    case 'primos-tramo': { let c = 0; for (let x = d.a + 1; x < d.b; x++) if (PRIMO(x)) c++; return String(c); }
    case 'primos-pa': { const s = []; for (let q = 2; q < d.B; q++) { const t = Array.from({ length: d.n }, (_, i) => q + i * d.d); if (t[d.n - 1] < d.B && t.every(PRIMO)) s.push(t[d.n - 1]); } assert.equal(s.length, 1); return String(s[0]); }
    case 'canonica': return CANON(d.N);
    case 'exponente': return String(exp(d.N, 2));
    case 'pesi': { const ok = d.pares.filter(([a, b]) => GCD(a, b) === 1); assert.equal(ok.length, 1); return `${ok[0][0]} y ${ok[0][1]}`; }
    case 'potencias': return String(exp(d.A, d.P) * d.x + exp(d.B, d.P) * d.y);
    case 'cd': return String(DIV(d.N).length);
    case 'sd': return String(DIV(d.N).reduce((x, y) => x + y, 0));
    case 'condicion': return String(DIV(d.N).filter(x => (d.k === 'impares' ? x % 2 === 1 : x % d.k === 0)).length);
    case 'compuestos': return String(DIV(d.N).filter(x => x > 1 && !PRIMO(x)).length);
    case 'exp-oculto': { const s = []; for (let a = 0; a < 15; a++) if (DIV(2 ** a * 3 ** d.b).length === d.T) s.push(2 ** a * 3 ** d.b); assert.equal(s.length, 1); return String(s[0]); }
    case 'phi': case 'phi-tres': return String(PHI(d.N));
    case 'irreductibles': { let c = 0; for (let k = 1; k < d.N; k++) if (GCD(k, d.N) === 1) c++; return String(c); }
    case 'cota': { let c = 0; for (let k = 1; k < d.N; k++) if (2 * k > d.N && GCD(k, d.N) === 1) c++; return String(c); }
    case 'wilson': case 'wilson-mas': { let x = 1; for (let k = 1; k < d.p; k++) x = x * k % d.p; return String((x + d.c) % d.p); }
    case 'fermat': case 'no-vale': return String(POT(d.a, d.n, d.p));
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => String(a).replace(/[\s\u00a0\u202f\u2009]/g, '') === String(b).replace(/[\s\u00a0\u202f\u2009]/g, '') });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const TEORIA = require('../../contenido/teoria/aritmetica/numeros-primos-y-divisores.js');
const IDEAS = TEORIA.ideas.map(i => i.id);
test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  assert.deepEqual(gen.TIPOS_POR_UNIDAD['aritmetica.numeros-primos-y-divisores'], Object.values(gen.TIPOS_POR_IDEA).flat());
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(`i${s}`, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('niveles: cada idea llega a examen y tiene nivel 1; los de San Marcos son de nivel 3', () => {
  for (const idea of IDEAS) { assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 3), idea); assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 1), idea); }
  for (const t of ['primos-pa', 'potencias', 'compuestos', 'exp-oculto', 'cota']) assert.equal(gen.NIVEL[t], 3, t);
});

test('cada error usa un código de la teoría, es hipótesis, empieza por lo que hizo bien y está en la tabla del informe', () => {
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/aritmetica/numeros-primos-y-divisores.js'), 'utf8');
  const informe = fs.readFileSync(require.resolve('../../docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md'), 'utf8');
  const tabla = informe.slice(informe.indexOf('## Números primos y divisores (19 nov)'));
  assert.ok(informe.includes('## Números primos y divisores (19 nov)'), 'falta la sección del informe');
  const deLaTeoria = new Set(teoria.match(/AT-[A-ZÑ0-9-]+[A-ZÑ0-9]/g));
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    assert.ok(deLaTeoria.has(a.error.id), `semilla ${s}: ${a.error.id} no es de la teoría`);
    assert.equal(a.error.respaldo, 'hipotesis');
    assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
    assert.ok(a.error.explicacion.split(/\s+/).length <= 30, a.error.explicacion);
    vistos.add(a.error.id);
  }
  for (const id of vistos) assert.ok(new RegExp(`(\\| |, )${id}( \\||,)`).test(tabla), `${id} no está en la tabla del informe`);
});

test('un color por magnitud: envase turquesa, lo que sobra naranja, lo que se busca violeta; sin verde ni carmín', () => {
  const COLOR = { e: TEORIA.colores.envase, r: TEORIA.colores.sobra, b: TEORIA.colores.busca };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v]); usadas.add(x.v); } else assert.equal(typeof x, 'string');
    }
    for (const x of p.pregunta) if (x && typeof x === 'object') assert.equal(x.v, 'e', `semilla ${s}: la pregunta colorea «${x.t}»`);
    const ult = p.solucion.flat().filter(x => x && typeof x === 'object' && x.t === p.respuesta.texto && x.v !== 'e');
    assert.ok(ult.length, `semilla ${s} (${p._datos.tipo}): la solución no escribe la respuesta con color`);
  }
});

test('notación: × y nunca «·»; sin guion como menos; sin NaN', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [[p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' '), p.datos.join(' | '), p.alternativas.map(a => a.texto + ' | ' + (a.error ? a.error.explicacion : '')).join(' | ')].join(' | ');
    assert.ok(!/·|\*|(^|[\s(])-\d|\d\s?-\s?\d/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(!/NaN|undefined|null/.test(todo), `semilla ${s}: ${todo}`);
  }
});

test('datos: una lista de líneas cortas, sin la respuesta, con la herramienta de cada tipo, en 400 semillas', () => {
  const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  const F = { primo: /exactamente dos divisores/, pareja: /pareja de divisores/, raiz: /p × p ≤ N/, canon: /Forma canónica|un producto de primos/, cd: /CD\(N\) =/, sd: /SD\(N\) =/, phi: /φ\(N\) =/, fermat: /Fermat:/, wilson: /Wilson:/, pesi: /PESI si/, pot: /Potencia de un producto/ };
  const FORMULA = { 'cual-primo': F.primo, 'cuantos-divisores': F.pareja, 'formas-cuadrado': F.pareja, 'dos-primos': F.primo,
    'hasta-primo': F.raiz, 'menor-primo': F.raiz, 'primos-tramo': F.raiz, 'primos-pa': F.raiz,
    canonica: F.canon, exponente: F.canon, pesi: F.pesi, potencias: F.pot,
    cd: F.cd, sd: F.sd, condicion: F.cd, compuestos: F.cd, 'exp-oculto': F.cd,
    phi: F.phi, 'phi-tres': F.phi, irreductibles: F.phi, cota: F.phi,
    wilson: F.wilson, fermat: F.fermat, 'no-vale': F.fermat, 'wilson-mas': F.wilson };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate)/i.test(l));
    }
    assert.match(p.datos.join('\n'), FORMULA[d.tipo], `semilla ${s} (${d.tipo}): falta su herramienta`);
    const c = p.respuesta.texto;
    if (/\d{2,}/.test(c) && !['primos-tramo', 'hasta-primo', 'menor-primo'].includes(d.tipo)) assert.ok(!new RegExp(`(?<![\\d])${c}(?![\\d])`).test(p.datos.join('\n')), `semilla ${s} (${d.tipo}): los datos traen ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 3000, de texto y por idea)', () => {
  for (let s = 0; s <= 3000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'salida-2', 'papel-1', 'examen-x']) gen.generar(s, { unidad: 'aritmetica.numeros-primos-y-divisores' });
  for (const idea of IDEAS) for (let s = 0; s < 200; s++) gen.generar(`p${s}`, { idea });
});

test('papel.json: 8 problemas de las seis ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.match(pr.enunciado, /Datos: .+ Alternativas: /, pr.id);
    assert.ok(pr.respuesta.endsWith(recalcular(p)), `${pr.id}: ${pr.respuesta}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  assert.deepEqual([7, 8].map(i => gen.generar(`papel-${i}`)._datos.tipo), ['primos-pa', 'cota']);
});

// ---------- Auditoría (19 nov, rutinas/auditoria/aritmetica.numeros-primos-y-divisores.md): fallan con la versión de antes ----------
test('A1: AT-FACT-EXPONENTE solo dice «más de una vez» de los primos que se repiten', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'factorizacion' });
    if (p._datos.tipo !== 'canonica') continue;
    const a = p.alternativas.find(x => x.error && x.error.id === 'AT-FACT-EXPONENTE');
    if (!a) continue;
    const N = p._datos.N, rep = []; let n = N; for (let q = 2; n > 1; q++) { let e = 0; while (n % q === 0) { n /= q; e++; } if (e > 1) rep.push(q); }
    assert.ok(!/cada uno/.test(a.error.explicacion), a.error.explicacion);
    assert.deepEqual([...a.error.explicacion.matchAll(/el (\d+)/g)].map(m => +m[1]), rep, `${N}: ${a.error.explicacion}`);
  }
});
test('M1: Fermat que no vale con un divisor compuesto: ciclos de 2 a 6, y la solución los muestra', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s, { idea: 'fermat-wilson' });
    if (p._datos.tipo !== 'no-vale' || PRIMO(p._datos.p)) continue;
    const { a, p: m } = p._datos; let k = 1, x = a % m; while (x !== 1 && k < 50) { x = (x * a) % m; k++; }
    assert.ok(k <= 6, `${a} entre ${m}: ciclo de ${k}`);
    assert.match(p.solucion[0].join(''), /ciclo de restos de \d+: \d+, \d+/);
  }
});
test('B4: el resto de una potencia grande no se cuenta en caramelos (12⁹⁹ caramelos no es creíble)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'fermat-wilson' });
    assert.ok(!/caramelos/.test(JSON.stringify(p.enunciado)), JSON.stringify(p.enunciado));
  }
});
