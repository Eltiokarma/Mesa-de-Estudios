// Pruebas del generador G4 (vector unitario): casos.json (verificados aparte, a ciegas) y un
// recálculo independiente en cada uno de 600 problemas. La respuesta es una clave de armarTexto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// El módulo entero se busca probando, no con Math.hypot.
function moduloEntero(c) {
  const s = c.reduce((t, x) => t + x * x, 0);
  for (let r = 1; r * r <= s; r++) if (r * r === s) return r;
  throw new Error('módulo no entero: ' + c);
}
const sobre = (c, d) => P.vector(c.map(x => [x, d])).clave;
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'unitario') return sobre(d.c, moduloEntero(d.c));
  if (d.tipo === 'con-modulo') return sobre(d.c.map(x => (d.anti ? -1 : 1) * d.k * x), moduloEntero(d.c));
  if (d.tipo === 'constante') { const f = P.frac(1, moduloEntero(d.c)); return `num:${f.n}/${f.d}`; }
  if (d.tipo === 'unitario-suma') { const s = d.a.map((x, i) => x + d.b[i]); return sobre(s, moduloEntero(s)); }
  return sobre([d.q, d.p], moduloEntero([d.q, d.p])); // recta: dirección (1; p/q) escalada por q
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.texto, c.esperado.respuesta);
  });
}

test('salen los cinco tipos, y el unitario de la suma muestra la suma de unitarios cuando se puede', () => {
  const tipos = new Set(); let sumaUnit = 0;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s); tipos.add(p._datos.tipo);
    if (p.alternativas.some(a => a.error && a.error.id === 'VE-suma-de-unitarios')) sumaUnit++;
  }
  assert.equal(tipos.size, 5); assert.ok(sumaUnit > 0);
});

test('notación: A⃗ con flecha, î ĵ k̂ con sombrerito y el módulo sin flecha (A, o |A⃗| donde hace falta distinguir)', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s);
    const visto = [p.enunciado, p.pregunta, p.solucion, p.alternativas.map(a => a.texto), p.alternativas.filter(a => a.error).map(a => a.error.explicacion), (p.pasos || []).map(q => [q.texto, q.ecuacion])].map(plano).join(' ');
    assert.ok(!/\d[ijk](?![\p{L}\p{M}])|[ +−(·][ijk](?![\p{L}\p{M}])/u.test(visto), `semilla ${s}: unitario sin sombrerito en «${visto}»`);
    assert.ok(!/(?<![\p{L}\p{M}|])[AB](?![\p{L}\p{M}|²])(?! =)/u.test(visto.replace(/\|[^|]*\|/g, '')), `semilla ${s}: vector sin flecha en «${visto}»`);
    // El módulo va sin flecha (A); |A⃗| solo donde hace falta distinguir: «|c·A⃗| = c·|A⃗|».
    assert.ok(!/(?<!c·)\|[AB]⃗\|/.test(visto), `semilla ${s}: el módulo lleva flecha`);
  }
});

// ---------- Escena viva (docs/escena-viva.md): A⃗ a escala con î y ĵ, sus componentes y û de largo 1 ----------
const { probarViva } = require('../../nucleo/kit/piezas/probar-viva.js');
const conEscena = p => ['unitario', 'constante', 'unitario-suma'].includes(p._datos.tipo) && (!p._datos.c || p._datos.c.length === 2);
probarViva(gen, {
  semillas: 300, pieza: 'flechas', conEscena, presupuestoSoloEscena: true,
  final: (p, fin, s) => {
    const d = p.escena.datos, dd = p._datos;
    assert.ok(d.ejes && fin.includes('>î<') && fin.includes('>ĵ<'), 'los ejes llevan î y ĵ');
    const c = dd.tipo === 'unitario-suma' ? [dd.a[0] + dd.b[0], dd.a[1] + dd.b[1]] : dd.c;
    // Fidelidad: A⃗ (o A⃗ + B⃗) mide su módulo; û sale del origen, mide 1 y apunta igual.
    const dividido = d.flechas.find(f => !f.discontinua && f.de[0] === 0 && f.de[1] === 0 && f.a[0] === c[0] && f.a[1] === c[1]);
    assert.ok(dividido, `semilla ${s}: falta el vector que se divide`);
    assert.ok(Math.abs(Math.hypot(...dividido.a) - moduloEntero(c)) < 1e-9);
    const u = d.flechas.find(f => f.rotulo === 'û');
    assert.ok(u && u.de[0] === 0 && u.de[1] === 0, `semilla ${s}: û no sale del origen`);
    assert.ok(Math.abs(Math.hypot(...u.a) - 1) < 1e-12, `semilla ${s}: û no mide 1`);
    assert.ok(Math.abs(u.a[0] * c[1] - u.a[1] * c[0]) < 1e-9 && u.a[0] * c[0] + u.a[1] * c[1] > 0, `semilla ${s}: û no apunta como el vector`);
    assert.ok(fin.includes('>û<'), `semilla ${s}: el final no rotula û`);
    // Las componentes llegan a la punta: una sobre x y otra paralela a y.
    const comp = d.flechas.filter(f => f.discontinua && f.color !== 'i');
    if (c[0] && c[1]) assert.ok(comp.some(f => f.a[1] === 0 && f.a[0] === c[0]) && comp.some(f => f.a[0] === c[0] && f.a[1] === c[1]), `semilla ${s}: faltan las componentes`);
    // Los pasos: módulo, dividir y comprobar (la suma empieza sumando).
    const textos = p.pasos.map(q => q.texto.map(x => (typeof x === 'object' ? x.t : x)).join(''));
    assert.ok(/módulo/.test(textos[textos.length - 3]) && /Comprobación/.test(textos[textos.length - 1]), `semilla ${s}: ${textos}`);
  },
});

test('escena viva: los tres tipos del plano la llevan; 3D, la recta y «con módulo», no', () => {
  const con = new Set(), sin = new Set();
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), k = p._datos.tipo + (p._datos.c ? p._datos.c.length : '');
    (p.escena ? con : sin).add(k);
  }
  assert.deepEqual([...con].sort(), ['constante2', 'unitario-suma', 'unitario2']);
  assert.ok(sin.has('unitario3') && sin.has('constante3') && sin.has('recta') && sin.has('con-modulo2'));
});

// Recuadro «Datos» (docs/plan-calidad.md, contrato, punto 13): datos y fórmulas en una lista, una por línea, en texto
// plano y cortas (22 palabras o menos). El generador dice qué se puede usar; el alumno decide qué usa.
test('datos: una lista de líneas cortas en texto plano, en todos los tipos', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    revisarDatos(p, p.datos.join('\n'), s);
  }
});

function revisarDatos(p, d, s) {
  assert.ok(d.includes('√(V_x² + V_y²'), `semilla ${s}: falta el módulo`);
  if (p._datos.tipo === 'recta') assert.ok(d.includes('(1; m)'), `semilla ${s}: falta la dirección de la recta`);
  assert.ok(!d.includes(p.respuesta.texto), `semilla ${s}: los datos dicen la respuesta`);
}
