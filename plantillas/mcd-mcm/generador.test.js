// Pruebas de «Los rollos y la rifa»: casos.json (calculados aparte, con un script que no usa el generador), un recálculo
// independiente en 600 problemas (fuerza bruta: MCD y MCM probando divisores, conteos uno por uno, divisiones
// sucesivas), fugas, los tipos por idea, los colores de la unidad, la notación, el recuadro «Datos» en 400 semillas y el
// papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const GCD = (...xs) => { let d = 1; for (let k = 1; k <= Math.min(...xs); k++) if (xs.every(x => x % k === 0)) d = k; return d; };
const LCM = (...xs) => { for (let m = Math.max(...xs); ; m++) if (xs.every(x => m % x === 0)) return m; };
const cuentaEn = (lo, hi, ok) => { let c = 0; for (let x = lo; x <= hi; x++) if (ok(x)) c++; return c; };
const primero = (desde, ok) => { for (let n = desde; ; n++) if (ok(n)) return n; };
const cocs = (a, b) => { const q = []; while (b) { q.push(Math.floor(a / b)); [a, b] = [b, a % b]; } return { q, g: a }; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'trozo': return `${GCD(d.A, d.B)} m`;
    case 'total': return String((d.A + d.B) / GCD(d.A, d.B));
    case 'tres': return `${GCD(d.A, d.B, d.C)} m`;
    case 'decimales': return `${GCD(d.A, d.B)} cm`;
    case 'estacas': { const g = GCD(d.A, d.B); return String((d.A / g + 1) * (d.B / g + 1)); }
    case 'boleto': return String(LCM(d.a, d.b));
    case 'alarmas': { const t = d.h0 * 60 + LCM(d.a, d.b); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }
    case 'tercera': { const j = []; for (let x = 0; j.length < 3; x++) if (x % d.a === 0 && x % d.b === 0) j.push(x); return `${j[2]} días`; }
    case 'tomas': { let j = 0, t = 0; for (let h = 0; j < 3; h++) { const k = [d.a, d.b, d.c].filter(x => h % x === 0).length; t += k; if (k === 3) j++; } return String(t); }
    case 'otro': { const s = []; for (let B = 1; B <= d.M; B++) if (GCD(d.A, B) === d.g && LCM(d.A, B) === d.M) s.push(B); assert.equal(s.length, 1); return String(s[0]); }
    case 'producto': { const s = new Set(); for (let a = 1; a * a <= d.P; a++) if (d.P % a === 0 && GCD(a, d.P / a) === d.g) s.add(LCM(a, d.P / a)); assert.equal(s.size, 1); return String([...s][0]); }
    case 'diferencia': { const s = []; for (let a = 1; a + d.D <= d.M; a++) if (LCM(a, a + d.D) === d.M) s.push(2 * a + d.D); assert.equal(s.length, 1); return String(s[0]); }
    case 'pares': { let c = 0; for (let a = 1; a <= d.M; a++) for (let b = a + 1; b <= d.M; b++) if (d.M % a === 0 && d.M % b === 0 && GCD(a, b) === d.g && LCM(a, b) === d.M) c++; return String(c); }
    case 'mismo': return String(primero(d.b + 1, n => n % d.a === d.r && n % d.b === d.r));
    case 'falta': return String(primero(1, n => d.ds.every(x => n % x === x - d.fa)));
    case 'tres-cifras': return String(primero(100, n => d.ds.every(x => n % x === d.r)));
    case 'tercero': return String(primero(1, n => n % d.a === 1 && n % d.b === 1 && n % d.c === 0));
    case 'ambos': return String(cuentaEn(1, d.L, x => x % d.a === 0 && x % d.b === 0));
    case 'alguno': return String(cuentaEn(1, d.L, x => x % d.a === 0 || x % d.b === 0));
    case 'ninguno': return String(cuentaEn(1, d.L, x => x % d.a && x % d.b));
    case 'tachar': return String(cuentaEn(1, d.L, x => x % d.a === 0 || x % d.b === 0 || x % d.c === 0));
    case 'mcd': return String(GCD(d.A, d.B));
    case 'fraccion': { const { q } = cocs(d.A, d.B); return `[${q[0]}; ${q.slice(1).join(', ')}]`; }
    case 'valor': { const [a, b, c] = d.qs; let [n, m] = [b * c + 1, c]; [n, m] = [a * n + m, n]; const g = GCD(n, m); return m / g === 1 ? String(n / g) : `${n / g}/${m / g}`; }
    case 'reconstruir': {
      // Continuantes (otro camino que el del generador), y comprobación con las divisiones de ida.
      const [q1, q2, q3] = d.qs, K2 = q2 * q3 + 1, K3 = q1 * K2 + q3, A = d.d * K3, B = d.d * K2, r = cocs(A, B);
      assert.deepEqual(r.q, d.qs); assert.equal(r.g, d.d); return String(A + B);
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => String(a).replace(/[\s   ]/g, '') === String(b).replace(/[\s   ]/g, '') });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const TEORIA = require('../../contenido/teoria/aritmetica/mcd-y-mcm.js');
const IDEAS = TEORIA.ideas.map(i => i.id);
test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  assert.deepEqual(gen.TIPOS_POR_UNIDAD['aritmetica.mcd-y-mcm'], Object.values(gen.TIPOS_POR_IDEA).flat());
  assert.equal(casos.casos.length, Object.values(gen.TIPOS_POR_IDEA).flat().length, 'un caso por tipo');
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(`i${s}`, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('niveles: cada idea llega a examen y tiene nivel 1; los de San Marcos son de nivel 3', () => {
  for (const idea of IDEAS) { assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 3), idea); assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 1), idea); }
  for (const t of ['decimales', 'estacas', 'tercera', 'tomas', 'diferencia', 'tres-cifras', 'tercero', 'tachar', 'reconstruir']) assert.equal(gen.NIVEL[t], 3, t);
});

test('cada error usa un código de la teoría, empieza por lo que hizo bien y está en la tabla del informe', () => {
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/aritmetica/mcd-y-mcm.js'), 'utf8');
  const informe = fs.readFileSync(require.resolve('../../docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md'), 'utf8');
  assert.ok(informe.includes('## MCD y MCM (19 nov)'), 'falta la sección del informe');
  const tabla = informe.slice(informe.indexOf('## MCD y MCM (19 nov)'));
  const deLaTeoria = new Set([...(teoria.match(/AT-[A-ZÑ0-9-]+[A-ZÑ0-9]/g) || []), 'AR13']);
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    assert.ok(deLaTeoria.has(a.error.id), `semilla ${s}: ${a.error.id} no es de la teoría`);
    assert.equal(a.error.respaldo, a.error.id === 'AR13' ? 'parcial' : 'hipotesis');
    assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
    assert.ok(a.error.explicacion.split(/\s+/).length <= 30, a.error.explicacion);
    vistos.add(a.error.id);
  }
  for (const id of vistos) if (id !== 'AR13') assert.ok(new RegExp(`(\\| |, )${id}( \\||,)`).test(tabla), `${id} no está en la tabla del informe`);
});

test('un color por magnitud: el MCD turquesa, el MCM violeta, lo que sobra naranja; sin verde ni carmín', () => {
  const COLOR = { d: TEORIA.colores.divisor, m: TEORIA.colores.multiplo, r: TEORIA.colores.sobra };
  const MCD_MCM = { trozo: 'd', tres: 'd', decimales: 'd', mcd: 'd', boleto: 'm', producto: 'm' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), V = p.variables;
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') assert.ok(V[x.v]); else assert.equal(typeof x, 'string');
    }
    for (const x of [...p.enunciado, ...p.pregunta]) assert.equal(typeof x, 'string', `semilla ${s}: lo que se pide va en tinta`);
    // Un MCD o un MCM como respuesta va con su color en la solución.
    const k = MCD_MCM[p._datos.tipo];
    if (k) assert.ok(p.solucion.flat().some(x => x && typeof x === 'object' && x.v === k && p.respuesta.texto.startsWith(x.t.split(' ')[0])), `semilla ${s} (${p._datos.tipo})`);
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
  const F = { mcd: /MCD\(A, B\): el mayor|el MCD lleva/, mcm: /MCM\(A, B\): el menor|el MCM lleva/, prod: /MCD\(A, B\) × MCM\(A, B\) = A × B/, coc: /A = MCD × p/,
    resto: /N = un múltiplo de A \+ r/, ie: /Múltiplos de A o de B|De A, de B o de C|a la vez son los múltiplos/, euc: /MCD\(A, B\) = MCD\(B, r\)|Fracción continua|Se anota \[2; 1, 3\]/ };
  const FORMULA = { trozo: F.mcd, total: F.mcd, tres: F.mcd, decimales: F.mcd, estacas: F.mcd, boleto: F.mcm, alarmas: F.mcm, tercera: F.mcm, tomas: /múltiplos comunes/,
    otro: F.prod, producto: F.prod, diferencia: F.coc, pares: F.coc, mismo: F.resto, falta: F.resto, 'tres-cifras': F.resto, tercero: F.resto,
    ambos: F.ie, alguno: F.ie, ninguno: F.ie, tachar: F.ie, mcd: F.euc, fraccion: F.euc, valor: F.euc, reconstruir: F.euc };
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
    if (/\d{2,}/.test(c)) assert.ok(!new RegExp(`(?<![\\d])${c.replace(/[[\]]/g, '\\$&')}(?![\\d])`).test(p.datos.join('\n')), `semilla ${s} (${d.tipo}): los datos traen ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 3000, de texto y por idea)', () => {
  for (let s = 0; s <= 3000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'salida-2', 'papel-1', 'examen-x']) gen.generar(s, { unidad: 'aritmetica.mcd-y-mcm' });
  for (const idea of IDEAS) for (let s = 0; s < 200; s++) gen.generar(`p${s}`, { idea });
});

test('papel.json: 8 problemas de las seis ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.match(pr.enunciado, /Datos: .+ Alternativas: /, pr.id);
    assert.ok(pr.respuesta.replace(/[\s  ]/g, '').endsWith(recalcular(p).replace(/[\s  ]/g, '')), `${pr.id}: ${pr.respuesta}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  assert.deepEqual([7, 8].map(i => gen.generar(`papel-${i}`)._datos.tipo), ['tercera', 'tres-cifras']);
});

test('cada distractor da el valor de su error (rehecho aquí, en 600 semillas)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos, alt = id => (p.alternativas.find(a => a.error && a.error.id === id) || {}).texto;
    const num = t => (t === undefined ? undefined : Number(String(t).replace(/[^\d]/g, '')));
    if (d.tipo === 'boleto') { if (alt('AR13')) assert.equal(num(alt('AR13')), GCD(d.a, d.b)); if (alt('AT-PRODUCTO')) assert.equal(num(alt('AT-PRODUCTO')), d.a * d.b); if (alt('AT-SUMA')) assert.equal(num(alt('AT-SUMA')), d.a + d.b); }
    if (d.tipo === 'tercera') { const M = LCM(d.a, d.b); if (alt('AT-CUENTA-HOY')) assert.equal(num(alt('AT-CUENTA-HOY')), 3 * M); if (alt('AT-PRIMERA')) assert.equal(num(alt('AT-PRIMERA')), M); }
    if (d.tipo === 'mismo') { const M = LCM(d.a, d.b); if (alt('AT-RESTO-OLVIDA')) assert.equal(num(alt('AT-RESTO-OLVIDA')), M); if (alt('AT-RESTO-PRODUCTO')) assert.equal(num(alt('AT-RESTO-PRODUCTO')), d.a * d.b + d.r); }
    if (d.tipo === 'alguno') { const cA = Math.floor(d.L / d.a), cB = Math.floor(d.L / d.b), cM = Math.floor(d.L / LCM(d.a, d.b)); if (alt('AT-IE-SUMA')) assert.equal(num(alt('AT-IE-SUMA')), cA + cB); if (alt('AT-IE-SOLO-AMBOS')) assert.equal(num(alt('AT-IE-SOLO-AMBOS')), cM); }
    if (d.tipo === 'mcd') { const r = cocs(d.A, d.B); if (alt('AT-EUC-COCIENTE')) assert.equal(num(alt('AT-EUC-COCIENTE')), r.q[0]); if (alt('AR13')) assert.equal(num(alt('AR13')), LCM(d.A, d.B)); }
  }
});
