// Pruebas del armado de Estructura atómica (generar(semilla, { unidad: 'quimica.estructura-atomica' }); etapa 4, propuesta
// §9): solo los tipos de las ideas 1, 4, 5 y 6, recálculo independiente en 400 semillas contra una TABLA de
// configuraciones escrita aquí a mano (la configuración real de cada átomo neutro en su estado fundamental, no la regla
// de llenado), casos.json (bloque «estructuraAtomica»), datos en lista, códigos del informe, «Bien» al empezar, números
// cuánticos también con Z ≤ 36 y en cationes (nunca del Cr, el Cu, el Mo, la Ag ni el Au) y el papel de cada idea.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, medirFugas } = require('../../nucleo/probar-generador.js');
const EA = 'quimica.estructura-atomica';
const genEA = { id: 'configuracion-ubicacion (Estructura atómica)', generar: s => gen.generar(s, { unidad: EA }) };

// ---- La tabla escrita aparte: configuración de cada átomo neutro (estado fundamental), con el gas noble de adentro ----
// Sin lantánidos ni Nb, Ru, Rh, Pd y Pt, que el generador no usa. Escrita en el orden de llenado.
const TABLA = `
1 1s1|2 1s2|3 [He] 2s1|4 [He] 2s2|5 [He] 2s2 2p1|6 [He] 2s2 2p2|7 [He] 2s2 2p3|8 [He] 2s2 2p4|9 [He] 2s2 2p5|10 [He] 2s2 2p6
11 [Ne] 3s1|12 [Ne] 3s2|13 [Ne] 3s2 3p1|14 [Ne] 3s2 3p2|15 [Ne] 3s2 3p3|16 [Ne] 3s2 3p4|17 [Ne] 3s2 3p5|18 [Ne] 3s2 3p6
19 [Ar] 4s1|20 [Ar] 4s2|21 [Ar] 4s2 3d1|22 [Ar] 4s2 3d2|23 [Ar] 4s2 3d3|24 [Ar] 4s1 3d5|25 [Ar] 4s2 3d5|26 [Ar] 4s2 3d6
27 [Ar] 4s2 3d7|28 [Ar] 4s2 3d8|29 [Ar] 4s1 3d10|30 [Ar] 4s2 3d10|31 [Ar] 4s2 3d10 4p1|32 [Ar] 4s2 3d10 4p2|33 [Ar] 4s2 3d10 4p3
34 [Ar] 4s2 3d10 4p4|35 [Ar] 4s2 3d10 4p5|36 [Ar] 4s2 3d10 4p6
37 [Kr] 5s1|38 [Kr] 5s2|39 [Kr] 5s2 4d1|40 [Kr] 5s2 4d2|42 [Kr] 5s1 4d5|43 [Kr] 5s2 4d5|47 [Kr] 5s1 4d10|48 [Kr] 5s2 4d10
49 [Kr] 5s2 4d10 5p1|50 [Kr] 5s2 4d10 5p2|51 [Kr] 5s2 4d10 5p3|52 [Kr] 5s2 4d10 5p4|53 [Kr] 5s2 4d10 5p5|54 [Kr] 5s2 4d10 5p6
55 [Xe] 6s1|56 [Xe] 6s2|72 [Xe] 6s2 4f14 5d2|73 [Xe] 6s2 4f14 5d3|74 [Xe] 6s2 4f14 5d4|75 [Xe] 6s2 4f14 5d5|76 [Xe] 6s2 4f14 5d6
77 [Xe] 6s2 4f14 5d7|79 [Xe] 6s1 4f14 5d10|80 [Xe] 6s2 4f14 5d10|81 [Xe] 6s2 4f14 5d10 6p1|82 [Xe] 6s2 4f14 5d10 6p2
83 [Xe] 6s2 4f14 5d10 6p3|84 [Xe] 6s2 4f14 5d10 6p4|85 [Xe] 6s2 4f14 5d10 6p5|86 [Xe] 6s2 4f14 5d10 6p6`;
const NUCLEO = { He: '1s2', Ne: '1s2 2s2 2p6', Ar: '1s2 2s2 2p6 3s2 3p6', Kr: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6',
  Xe: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6', Rn: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6' };
const GAS_E = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 };
const ORDEN = '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s'.split(' ');
const CAP = { s: 2, p: 6, d: 10, f: 14 }, L = { s: 0, p: 1, d: 2, f: 3 };
const expandir = t => t.replace(/\[(\w+)\]/, (m, g) => NUCLEO[g]).trim().split(/\s+/).map(x => [x.slice(0, 2), +x.slice(2)]);
const NEUTRO = {};
for (const ent of TABLA.trim().split(/[|\n]/)) { const [z, ...r] = ent.trim().split(' '); NEUTRO[+z] = expandir(r.join(' ')); }
const total = c => c.reduce((t, [, e]) => t + e, 0);
const ordenar = c => c.filter(([, e]) => e > 0).sort((a, b) => ORDEN.indexOf(a[0]) - ORDEN.indexOf(b[0]));
function especie(z, q) {
  const c = NEUTRO[z].map(x => x.slice());
  assert.ok(c, `Z = ${z} no está en la tabla`);
  assert.equal(total(c), z, `la tabla de Z = ${z} no suma ${z}`);
  for (let k = 0; k < q; k++) c.filter(([, e]) => e > 0).sort((a, b) => (+b[0][0] - +a[0][0]) || (L[b[0][1]] - L[a[0][1]]))[0][1] -= 1;
  for (let k = 0; k < -q; k++) {
    const sub = ORDEN.find(s => { const x = c.find(y => y[0] === s); return !x || x[1] < CAP[s[1]]; });
    const x = c.find(y => y[0] === sub); if (x) x[1] += 1; else c.push([sub, 1]);
  }
  return ordenar(c);
}
const plano = c => c.map(([s, e]) => s + e).join(' ');
function abreviada(c) {
  const e = total(c);
  for (const g of ['Rn', 'Xe', 'Kr', 'Ar', 'Ne', 'He']) {
    if (GAS_E[g] >= e) continue;
    const nucleo = expandir(NUCLEO[g]);
    if (nucleo.every(([s, k]) => c.some(([s2, k2]) => s2 === s && k2 === k))) return `[${g}] ` + plano(c.filter(([s]) => !nucleo.some(([s2]) => s2 === s)));
  }
  return plano(c);
}
const solos = c => c.reduce((t, [s, e]) => { const k = 2 * L[s[1]] + 1; return t + (e <= k ? e : 2 * k - e); }, 0);
function ultimo(c) {
  const [s, e] = c[c.length - 1], k = 2 * L[s[1]] + 1, caja = e <= k ? e - 1 : e - k - 1;
  return `qn:${s[0]}:${L[s[1]]}:${caja - L[s[1]]}:${e <= k ? '+' : '-'}`;
}

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'particulas': return `part:${d.A - d.Z}:${d.Z - d.carga}`;
    case 'atomo-ion': { const c = especie(d.Z, d.carga); return `ion:${total(c)}|${plano(c)}`; }
    case 'neutro': return 'conf:' + (d.Z <= 20 ? plano(NEUTRO[d.Z]) : abreviada(NEUTRO[d.Z]));
    case 'anomala': return 'conf:' + abreviada(NEUTRO[d.Z]);
    case 'cation': case 'anion': return 'conf:' + abreviada(especie(d.Z, d.carga));
    case 'valencia': { const c = NEUTRO[d.Z], n = Math.max(...c.map(([s]) => +s[0])); return c.filter(([s]) => +s[0] === n).reduce((t, [, e]) => t + e, 0); }
    case 'contar': return NEUTRO[d.Z].filter(([s]) => L[s[1]] === d.l).reduce((t, [, e]) => t + e, 0);
    case 'desapareados': return solos(especie(d.Z, d.carga));
    case 'magnetico': {
      const buenas = d.especies.filter(([z, q]) => (solos(especie(z, q)) === 0) === (d.busca === 'dia'));
      assert.equal(buenas.length, 1, `${p.id}: una sola especie ${d.busca}`);
      return `esp:${buenas[0][0]}:${buenas[0][1]}`;
    }
    case 'cuanticos': return ultimo(especie(d.Z, d.carga));
  }
  throw new Error('tipo fuera de la unidad: ' + d.tipo);
}
probarGenerador(genEA, { semillas: 400, recalcular, igual: (a, b) => a === b });
// Fugas: en los números cuánticos y en «neutrones y electrones» cada error cambia un solo número, así que la correcta es
// la central por construcción (lo mismo pasa en el examen). Se miden los demás grupos.
test('la correcta no se adivina por ser la central ni por estar en un extremo (salvo cuánticos y partículas)', () => {
  const por = medirFugas(genEA, { grupo: p => p._datos.tipo + '/' + (p._datos.sub || '') }), malos = [];
  for (const [k, o] of Object.entries(por)) {
    if (/^(cuanticos|particulas)\//.test(k) || o.n < 15) continue;
    if (o.central / o.n > 0.4) malos.push(`${k}: central ${Math.round(100 * o.central / o.n)} %`);
    if (o.numericos >= 15 && o.extremo / o.numericos > 0.75) malos.push(`${k}: extremo ${Math.round(100 * o.extremo / o.numericos)} %`);
  }
  assert.deepEqual(malos, []);
});

test('la tabla escrita aparte coincide con el generador en cada átomo que usa', () => {
  for (const z of Object.keys(NEUTRO).map(Number)) assert.equal(gen.configuracion(z).abreviada, abreviada(NEUTRO[z]), `Z = ${z}`);
});

test('solo los tipos de las ideas 1, 4, 5 y 6, todos presentes, y el problema dice su unidad', () => {
  const POR_IDEA = { 1: ['particulas', 'atomo-ion'], 4: ['neutro', 'valencia', 'anomala', 'contar'], 5: ['cation', 'anion'], 6: ['desapareados', 'magnetico', 'cuanticos'] };
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) { const p = genEA.generar(s); vistos.add(p._datos.tipo); assert.equal(p.unidadCatalogo, EA); }
  assert.deepEqual([...vistos].sort(), Object.values(POR_IDEA).flat().sort());
  assert.deepEqual([...gen.tiposPorUnidad[EA]].sort(), [...vistos].sort());
});

test('números cuánticos: con Z ≤ 36, con Z mayor y en cationes, nunca del Cr, el Cu, el Mo, la Ag ni el Au; con la tarjeta del examen', () => {
  const subs = new Set();
  for (let s = 0; s < 3000; s++) {
    const p = genEA.generar(s), d = p._datos;
    if (d.tipo !== 'cuanticos') continue;
    subs.add(d.sub);
    assert.ok(![24, 29, 42, 47, 79].includes(d.Z), `semilla ${s}: el último electrón de Z = ${d.Z}`);
    if (d.sub === 'neutro36') assert.ok(d.Z <= 36 && d.carga === 0);
    if (d.sub === 'cation') assert.ok(d.carga > 0);
    assert.deepEqual(p.convenciones, ['ultimo-electron']);
    assert.ok(p.datos.some(l => /Convención: las cajas van de mₗ = −ℓ/.test(l)) && p.datos.some(l => /mₛ = \+½/.test(l)), `semilla ${s}: falta la convención`);
  }
  assert.deepEqual([...subs].sort(), ['cation', 'neutro36', 'neutro86']);
});

test('errores: códigos del informe, uno por alternativa, «Bien» al empezar y el valor de cada error a la vista', () => {
  const informe = fs.readFileSync(path.join(__dirname, '../../docs/investigacion/atomo-enlace-ideas-erroneas.md'), 'utf8');
  const ids = new Set();
  for (let s = 0; s < 600; s++) {
    const p = genEA.generar(s), malas = p.alternativas.filter(x => x.error);
    assert.equal(new Set(malas.map(a => a.error.id)).size, malas.length, `semilla ${s}: dos alternativas con el mismo código`);
    for (const a of malas) {
      ids.add(a.error.id);
      assert.ok(/^QM-/.test(a.error.id) && new RegExp(`(?<![\\w-])${a.error.id}(?![\\w-])`).test(informe), `${a.error.id} no está en el informe`);
      assert.equal(a.error.respaldo, 'hipotesis');
      assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
      if (typeof p.respuesta.valor === 'number') assert.match(a.error.explicacion, new RegExp(`Así salen? ${a.texto}\\.$`), `semilla ${s}`);
    }
  }
  for (const id of ['QM-ULTIMO', 'QM-ANOMALIA', 'QM-CARGA-E', 'QM-HUND', 'QM-PISO-ANTES', 'QM-ML-CERO', 'QM-MS-AL-REVES', 'QM-ULTIMO-4S', 'QM-PARA-DIA'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('datos: una línea por dato, cortas, con la herramienta de cada tipo y sin la respuesta, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const HERRAMIENTA = { particulas: 'A = Z + N', 'atomo-ion': 'carga = Z − e⁻', neutro: /^Orden de llenado: /, valencia: 'Último nivel (capa de valencia): el de mayor n',
    anomala: /: un electrón del (4s|s de afuera) pasa al (3d|d)$/, contar: 'ℓ: s es 0, p es 1, d es 2, f es 3', cation: 'carga = Z − e⁻', anion: 'carga = Z − e⁻',
    desapareados: /^Orbitales: 1 en un s, 3 en un p/, magnetico: /^Paramagnética: /, cuanticos: /^Convención: primero una ↑/ };
  for (let s = 0; s < 400; s++) {
    const p = genEA.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}: datos en lista`);
    for (const l of p.datos) assert.ok(typeof l === 'string' && l.trim() === l && palabras(l) <= 22 && !/\bnull\b|NaN|undefined|^Dato:|\d\.\d/.test(l), `semilla ${s}: «${l}»`);
    const h = HERRAMIENTA[d.tipo];
    assert.ok(p.datos.some(l => (typeof h === 'string' ? l === h : h.test(l))), `semilla ${s}: ${d.tipo} sin su herramienta`);
    const todo = p.datos.join('\n'), ok = p.alternativas.find(a => a.correcta).texto;
    if (typeof p.respuesta.valor === 'number') { if (p.respuesta.valor >= 11) assert.ok(!new RegExp(`(^|\\D)${ok}(\\D|$)`).test(todo), `semilla ${s}: el ${ok} está en los datos`); }
    else if (d.tipo !== 'magnetico') assert.ok(!todo.includes(ok), `semilla ${s}: los datos traen la respuesta`);
    // Las configuraciones de la respuesta no están en los datos (ni la del átomo neutro en los cationes): solo las reglas.
    assert.ok(!/\[\w+\] \d[spdf]/.test(todo), `semilla ${s}: una configuración en los datos`);
  }
});

test('notación y colores: el nitrógeno no sale como «N»; ninguna letra de alternativa ni ningún número cuántico con color', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 600; s++) {
    const p = genEA.generar(s);
    const t = plano([p.enunciado, p.pregunta, p.solucion, p.alternativas.map(a => a.texto)]);
    assert.ok(!/(^|[^⁰¹²³⁴⁵⁶⁷⁸⁹\p{L}])N[⁺⁻¹²³]|\b(el|del|un) N\b(?! =)/u.test(t), `semilla ${s}: «N» suelto`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) if (x && typeof x === 'object') {
      assert.ok(p.variables[x.v], `semilla ${s}: «${x.t}» sin variable`);
      assert.ok(!/^[A-E]\)?$|^\(\d; /.test(x.t), `semilla ${s}: «${x.t}» con color`);
    }
  }
});

// ---- casos.json, bloque «estructuraAtomica» (verificados aparte con la misma tabla, en Python) ----
for (const c of casos.estructuraAtomica) {
  test(`casos.json (Estructura atómica): semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = genEA.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}
test('casos.json (Estructura atómica): de 15 a 20 casos, con todos los tipos de la unidad', () => {
  assert.ok(casos.estructuraAtomica.length >= 15 && casos.estructuraAtomica.length <= 20);
  assert.deepEqual([...new Set(casos.estructuraAtomica.map(c => c.entrada.tipo))].sort(), [...gen.tiposPorUnidad[EA]].sort());
});

// ---- papel: de 5 a 10 problemas por idea, con sus datos al final ----
test('papel.json: cada problema dice su unidad (y en Estructura atómica, su idea); de 5 a 10 por idea, con datos', () => {
  const unidades = require('./plantilla.json').unidades, porIdea = {};
  for (const q of papel.problemas) {
    assert.ok(Array.isArray(q.unidades) && q.unidades.length === 1 && unidades.includes(q.unidades[0]), `${q.id}: unidades`);
    if (q.unidades[0] !== EA) continue;
    assert.ok(['configuracion-electronica', 'configuracion-iones', 'desapareados-isoelectronicos', 'nucleo-identidad'].includes(q.idea), `${q.id}: idea`);
    porIdea[q.idea] = (porIdea[q.idea] || 0) + 1;
    assert.match(q.enunciado, / Datos: [^]+$/, `${q.id}: sin datos al final`);
    assert.ok(!/vida media|periodo|grupo/i.test(q.enunciado), `${q.id}: fuera de la unidad`);
  }
  for (const idea of ['configuracion-electronica', 'configuracion-iones', 'desapareados-isoelectronicos'])
    assert.ok(porIdea[idea] >= 5 && porIdea[idea] <= 10, `${idea}: ${porIdea[idea]} problemas`);
});
