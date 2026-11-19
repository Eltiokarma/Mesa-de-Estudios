// Pruebas propias de «Divisibilidad» (además del validador común de contenido/teoria/teoria.test.js). Etapa 5, fases 2 y
// 3 (19 nov): las seis ideas pasaron por el contrato, con la propuesta docs/etapa5/propuesta-aritmetica.md como guion.
// La unidad lleva calidad: 2 desde el 19 nov (lector en frío y auditor). Las pruebas de
// la idea 1 van primero; las de las ideas 2 a 6, al final, con cuentas aparte propias (BigInt, fuerza bruta).
//   - seis ideas en el orden de la propuesta, con los id publicados, y con calidad 2;
//   - la notación del examen: { mult } de nucleo/ecuacion.js dibuja el circulito y se lee «múltiplo de 7»;
//   - idea 1, un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7): cada ficha de color dice su magnitud
//     (m) y lleva el color de def.colores: el envase turquesa, lo que sobra naranja, lo que se busca violeta; nunca
//     verde ni carmín, tampoco en las figuras; las letras de alternativa, en negrita y sin color;
//   - la misión se cumple con un solo caso de la grilla, no está cumplida al abrir y su «bien» no dice la respuesta de
//     la predicción; la escala del dibujo no salta;
//   - Predice: la figura no marca ningún premio, los datos no traen fórmulas y ningún código de error se repite; nada de
//     lo que se lee antes (Lee, juego, glosario de la idea) trae su cuenta;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos, y su respuesta cuadra con una cuenta aparte
//     (fuerza bruta, sin el código de la unidad); «Así se resuelve» no hace la pregunta de «Ahora tú» y también cuadra;
//   - 15 ejemplos que suben de nivel, con datos; los de nivel 3, con cinco alternativas y la letra de la respuesta en
//     la alternativa que dice su valor; la respuesta lleva color;
//   - la idea estrena de 2 a 4 palabras, con su simple y tres ejemplos;
//   - notación: × y nunca «·» (salvo el separador de dos relaciones de una regla).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./divisibilidad.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const PZ = id => Kit.piezas[id];
const ID = ['filas-de-m', 'restos-suman', 'criterios', 'restos-potenciales', 'criterios-pesos', 'diofanticas'];
const I1 = def.ideas[0];
const SEMILLAS = 400;

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
const plano = x => E.texto(x === undefined || x === null ? '' : Array.isArray(x) ? x : [x]);
const textoSVG = s => s.replace(/<title>.*?<\/title>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const svgDe = (dib, pz) => PZ((dib && dib.pieza) || pz).dibujar(dib.datos, dib.estado || {});
const nums = t => (String(t).match(/\d+/g) || []).map(Number);

// ---------- Cuentas aparte (fuerza bruta: no usan la unidad) ----------
const cuantos = (d, a, b) => { let c = 0; for (let x = a; x <= b; x++) if (x % d === 0) c++; return c; };
const mayorHasta = (d, tope) => { for (let x = tope; x >= 1; x--) if (x % d === 0) return x; };
const menorDesde = (d, piso) => { for (let x = piso; ; x++) if (x % d === 0) return x; };

test('seis ideas en el orden de la propuesta, con sus id, con calidad 2 y con las piezas del puesto y de la rifa', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ID);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  assert.equal(def.septimaIdea, undefined);
  assert.equal(I1.pieza, 'arit-puesto');
  assert.ok(def.requiere.includes('/nucleo/kit/piezas/arit-boletos.js') && def.requiere.includes('/nucleo/kit/piezas/arit-puesto.js'));
  assert.deepEqual(def.colores, { envase: 'i', sobra: 'o', busca: 'f' });
  for (const l of ['N', 'd', 'k', 'q', 'r']) assert.ok(def.letras[l], `tabla de letras: ${l}`);
  // Las mesas siguen con sus ideas (los id no cambian).
  assert.deepEqual(def.laboratorioIdeas, { 'filas-grandes': ['filas-de-m'], 'juntar-sobrantes': ['restos-suman'], 'ciclos-largos': ['restos-potenciales'] });
});

test('{ mult }: el múltiplo con circulito se revisa, se dibuja y se lee «múltiplo de 7»', () => {
  const e = ['N = ', { mult: [{ v: 'c-i', t: '7' }] }, ' + 3'];
  E.revisar(e);
  assert.equal(E.texto(e), 'N = múltiplo de 7 + 3');
  assert.match(E.html(e), /class="ec-mult"[^>]*>.*border-radius:50%.*class="var c-i/);
  assert.deepEqual([...E.colores(e)], ['c-i']);
  // La idea 1 lo usa en Lee, en la regla y en un ejemplo.
  const con = x => (x === null || typeof x !== 'object' ? 0 : Array.isArray(x) ? x.reduce((a, y) => a + con(y), 0) : (x.mult ? 1 : 0) + Object.values(x).reduce((a, y) => a + con(y), 0));
  assert.ok(con(I1.lee) >= 1 && con(I1.regla) >= 1 && con(I1.ejemplos) >= 1);
});

test('idea 1 · colores: cada ficha dice su magnitud y lleva su color; sin verde ni carmín; letras de alternativa sin color', () => {
  const todo = [I1.lee, I1.juega.leyenda, I1.predice, I1.mira, I1.regla, I1.ejemplos];
  for (let s = 0; s < 40; s++) { todo.push(I1.ahoraTu.generar(s)); if (s < 12) todo.push(I1.resuelve.generar(s)); }
  for (const v of [{ n: 30, m: 4 }, { n: 28, m: 7 }, { n: 40, m: 9 }]) todo.push(I1.juega.lectura(v));
  const fs = fichas(todo);
  assert.ok(fs.length > 150, `fichas: ${fs.length}`);
  for (const f of fs) {
    assert.ok(f.m && def.colores[f.m], `ficha sin magnitud: ${JSON.stringify(f)}`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, JSON.stringify(f));
  }
  // Las tres magnitudes aparecen.
  assert.deepEqual([...new Set(fs.map(f => f.m))].sort(), ['busca', 'envase', 'sobra']);
  // Controles con color: solo el de la bolsita (turquesa).
  assert.deepEqual(I1.juega.controles.map(c => c.color), [undefined, 'c-i']);
  // Las figuras: ni carmín ni verde.
  const svgs = [];
  for (const t of I1.lee.tarjetas) if (t.dibujo) svgs.push(svgDe({ pieza: t.pieza, datos: t.dibujo.datos }, I1.pieza));
  for (const v of [{ n: 30, m: 4 }, { n: 28, m: 7 }, { n: 13, m: 9 }]) svgs.push(svgDe(I1.juega.dibujo(v), I1.juega.pieza));
  svgs.push(svgDe(I1.predice.dibujo, I1.predice.pieza), svgDe(I1.predice.revelar, I1.predice.pieza));
  I1.mira.pasos.forEach(p => svgs.push(PZ(I1.mira.pieza).dibujar(I1.mira.datos, p.estado)));
  I1.ejemplos.forEach(e => { if (e.figura) svgs.push(svgDe(e.figura, I1.pieza)); });
  for (const s of svgs) assert.ok(!/var\(--c-[hd]\)/.test(s), 'una figura usa carmín o verde');
  // Las letras de alternativa: en negrita, una sola letra A–E, sin ficha de color adentro.
  const ns = negritas(I1.ejemplos);
  assert.ok(ns.length >= 5 * 5, `letras: ${ns.length}`);
  for (const n of ns) { assert.match(plano(n.negrita), /^[A-E]$/); assert.equal(fichas(n).length, 0); }
});

test('idea 1 · misión: una sola manera en la grilla, no cumplida al abrir; la escala no salta; la lectura dice la relación', () => {
  const j = I1.juega, [cn, cm] = j.controles;
  assert.deepEqual([cn.id, cm.id], ['n', 'm'], 'los controles publicados no cambian de id');
  const cumplen = [];
  for (let n = cn.min; n <= cn.max; n++) for (let m = cm.min; m <= cm.max; m++) if (j.mision.logrado({ n, m }) === true) cumplen.push(`${n},${m}`);
  assert.deepEqual(cumplen, ['28,7']);
  assert.equal(j.mision.logrado({ n: cn.inicio, m: cm.inicio }), false);
  // Aparte: de 5 a 9, solo el 7 divide a 28.
  assert.deepEqual([5, 6, 7, 8, 9].filter(d => 28 % d === 0), [7]);
  assert.ok(!/\b8 premios|6 × 8\b/.test(j.mision.bien + j.mision.texto + j.consigna), 'no adelanta la predicción');
  // La escala es una sola en toda la grilla, y con ella todo cabe.
  const escalas = {};
  for (let n = cn.min; n <= cn.max; n++) for (let m = cm.min; m <= cm.max; m++) {
    const d = j.dibujo({ n, m }).datos;
    (escalas[m] = escalas[m] || new Set()).add(d.escala);
    assert.ok(PZ('arit-puesto').geometria(d).sCabe >= d.escala - 1e-9, `no cabe ${n} en bolsitas de ${m}`);
    // La lectura: N = d × q + r con sus números, y dice «es múltiplo» justo cuando no sobra nada.
    const t = plano(j.lectura({ n, m })), q = Math.floor(n / m), r = n % m;
    assert.ok(t.startsWith(r ? `${n} = ${m} × ${q} + ${r}:` : `${n} = ${m} × ${q}:`), t);
    assert.equal(/no es múltiplo/.test(t), r !== 0, t);
    // El dibujo: tantas bolsitas llenas y tantos sueltos.
    assert.equal(d.bolsitas, q); assert.equal(d.sueltos, r); assert.equal(d.n, m);
  }
  // Una escala por tamaño de bolsita: no salta al cambiar los caramelos.
  for (const m of Object.keys(escalas)) { assert.equal(escalas[m].size, 1, `la escala salta con bolsitas de ${m}`); assert.ok([...escalas[m]][0] >= 0.8, `escala muy chica: ${[...escalas[m]][0]}`); }
});

test('idea 1 · Predice: cuenta aparte, figura sin premios marcados, datos sin fórmula, códigos sin repetir, nada antes la adelanta', () => {
  const p = I1.predice;
  const ops = Object.fromEntries(p.opciones.map(o => [o.id, plano(o.texto)]));
  // Cuentas aparte de la correcta y de cada trampa.
  assert.equal(+ops.c, cuantos(6, 1, 50));
  assert.equal(+ops.arriba, Math.ceil(50 / 6));
  assert.equal(+ops.propio, cuantos(6, 7, 50));
  let terminan = 0; for (let x = 1; x <= 50; x++) if (x % 10 === 6) terminan++;
  assert.equal(+ops.termina, terminan);
  assert.equal(new Set(Object.values(ops)).size, 4);
  const cods = p.opciones.filter(o => !o.correcta).map(o => o.error);
  assert.equal(new Set(cods).size, cods.length, 'un código repetido');
  assert.ok(cods.every(c => /^AT-/.test(c)));
  // La figura de la pregunta no marca ningún premio ni escribe la respuesta; la que revela marca los ocho.
  const g0 = PZ(p.pieza).geometria(p.dibujo.datos), g1 = PZ(p.pieza).geometria(p.revelar.datos);
  assert.equal(g0.celdas.filter(c => c.premio || c.sombra || c.sobra).length, 0);
  assert.ok(!/\b8 premios\b/.test(textoSVG(svgDe(p.dibujo, p.pieza))));
  assert.deepEqual(g1.celdas.filter(c => c.premio).map(c => c.num), [6, 12, 18, 24, 30, 36, 42, 48]);
  assert.deepEqual(g1.celdas.filter(c => c.sobra).map(c => c.num), [49, 50]);
  // Datos: valores, no la fórmula del conteo.
  for (const d of p.datos) assert.ok(!/cociente|=|÷/.test(plano(d)), plano(d));
  // Antes de Predice (Lee, juego, glosario de la idea) no está su cuenta ni un conteo de múltiplos.
  const antes = [plano(I1.lee.tarjetas.map(t => [t.texto, t.ecuacion || ''])), I1.juega.consigna, I1.juega.mision.texto, I1.juega.mision.bien,
    ...Glosario.porIdea(def)[0].map(g => [g.def, g.simple, ...(g.ejemplos || [])].join(' '))].join(' ');
  assert.ok(!/50 = 6|6 × 8|hay 8|8 premios|cociente entero/.test(antes), 'algo antes de Predice trae su cuenta');
  // «Mira» termina en la cuenta, y sus pasos van de la plancha sin marcar a los grupos.
  assert.equal(I1.mira.pasos.length, 6);
  const marcados = I1.mira.pasos.map(x => PZ(I1.mira.pieza).geometria(I1.mira.datos, x.estado).celdas.filter(c => c.premio).length);
  assert.deepEqual(marcados, [0, 1, 8, 8, 8, 8]);
  assert.equal(new Set(I1.mira.pasos.map(x => PZ(I1.mira.pieza).geometria(I1.mira.datos, x.estado).H)).size, 1, 'el alto de «Mira» salta');
});

// La respuesta de un caso de «Ahora tú», por fuerza bruta desde el texto de la pregunta y de las opciones.
function aparte(c) {
  const t = plano(c.pregunta), ops = c.opciones.map(o => plano(o.texto));
  let m;
  if ((m = t.match(/bolsitas de (\d+) caramelos\. ¿Cuál de estos pedidos/))) {
    const buenos = ops.filter(o => nums(o)[0] % +m[1] === 0);
    assert.equal(buenos.length, 1, `${t}: ${ops.join(' | ')}`);
    return buenos[0];
  }
  if ((m = t.match(/mayor múltiplo de (\d+) que tiene dos cifras/))) return String(mayorHasta(+m[1], 99));
  if ((m = t.match(/menor múltiplo de (\d+) que tiene tres cifras/))) return String(menorDesde(+m[1], 100));
  if ((m = t.match(/boletos del 1 al (\d+)\..*múltiplo de (\d+)\. ¿Cuántos premios/))) return String(cuantos(+m[2], 1, +m[1]));
  if ((m = t.match(/¿Cuántos múltiplos de (\d+) tienen tres cifras/))) return String(cuantos(+m[1], 100, 999));
  if ((m = t.match(/(\d+) de cada (\d+) boletos.*más de (\d+) y menos de (\d+) boletos/))) {
    const [p, d, L, U] = m.slice(1).map(Number), totales = [];
    for (let x = L + 1; x < U; x++) if (x % d === 0) totales.push(x);
    assert.equal(totales.length, 1, `${t}: el total no es único`);
    return String(totales[0] / d * p);
  }
  throw new Error(`tipo de «Ahora tú» sin cuenta aparte: ${t}`);
}

test(`idea 1 · «Ahora tú»: cuatro opciones, datos, códigos, y la respuesta cuadra con una cuenta aparte (${SEMILLAS} semillas)`, () => {
  const tipos = new Set(), vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = I1.ahoraTu.generar(s), t = plano(c.pregunta);
    vistos.add(t + ' ' + c.opciones.map(o => plano(o.texto)).sort().join('|')); tipos.add(s % 5);
    assert.equal(c.opciones.length, 4, t);
    assert.equal(new Set(c.opciones.map(o => plano(o.texto))).size, 4, t);
    const buena = c.opciones.filter(o => o.correcta);
    assert.equal(buena.length, 1);
    assert.equal(plano(buena[0].texto), aparte(c), t);
    assert.ok(Array.isArray(c.datos) && c.datos.length >= 1 && c.datos.length <= 6, `sin datos: ${t}`);
    for (const d of c.datos) assert.ok(plano(d).split(/\s+/).length <= 22, plano(d));
    // Los datos no traen la respuesta escrita (salvo los extremos 10, 99, 100 y 999 de «los números de k cifras», que
    // pueden coincidir con ella por casualidad).
    const resp = nums(plano(buena[0].texto))[0], esta = x => new RegExp(`(^|\\D)${resp}(\\D|$)`).test(x);
    assert.ok(!c.datos.some(d => !/cifras van del/.test(plano(d)) && esta(plano(d)) && !esta(t)), `los datos dan la respuesta: ${t}`);
    for (const o of c.opciones) if (!o.correcta) { assert.match(o.error, /^AT-/); assert.ok(o.siFuera && o.siFuera.split(/\s+/).length <= 20, `${t}: ${o.siFuera}`); assert.ok(!/NaN|undefined/.test(o.siFuera)); }
    assert.ok(c.solucion && c.solucion.texto && c.solucion.texto.split(/\s+/).length <= 20, c.solucion && c.solucion.texto);
    assert.ok(!/sobran 1\b|\b1 sueltos|\b1 bolsitas|\b1 boletos|\b1 premios/.test(t + c.opciones.map(o => o.siFuera || '').join(' ') + c.solucion.texto), `concordancia: ${t}`);
  }
  assert.equal(tipos.size, 5);
  assert.ok(vistos.size > 200, `casos distintos: ${vistos.size}`);
});

test('idea 1 · «Así se resuelve»: los premios de un tramo cuadran con una cuenta aparte, y no es la pregunta de «Ahora tú»', () => {
  const deAhora = new Set(); for (let s = 0; s < SEMILLAS; s++) deAhora.add(plano(I1.ahoraTu.generar(s).pregunta));
  const vistos = new Set();
  for (let s = 0; s < 60; s++) {
    const c = I1.resuelve.generar(s), t = plano(c.enunciado), m = t.match(/boletos del (\d+) al (\d+)\..*múltiplos de (\d+)\./);
    assert.ok(m, t);
    const [a, b, d] = m.slice(1).map(Number), cuenta = cuantos(d, a, b);
    assert.match(plano(c.respuesta), new RegExp(`^Hay ${cuenta} premios?$`), t);
    assert.ok(a > 1 && a % d !== 0 && b % d !== 0 && cuenta >= 2, t);
    assert.ok(!deAhora.has(t));
    assert.ok(Array.isArray(c.datos) && c.datos.length);
    assert.equal(c.pasos[0].tipo, 'pide');
    // El último paso comprueba por otro camino: (último − primero) ÷ d + 1.
    const fin = plano(c.pasos[c.pasos.length - 1].ecuacion), n = nums(fin);
    assert.equal((n[0] - n[1]) / n[2] + 1, cuenta, fin);
    assert.equal(n[0], mayorHasta(d, b)); assert.equal(n[1], menorDesde(d, a));
    vistos.add(t);
  }
  assert.ok(vistos.size >= 50);
});

test('idea 1 · ejemplos: 15 que suben de nivel, con datos y respuesta con color; nivel 3 con cinco alternativas y su letra', () => {
  const EJ = I1.ejemplos;
  assert.equal(EJ.length, 15);
  assert.deepEqual(EJ.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  const letras = [];
  for (const e of EJ) {
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, e.titulo);
    assert.ok(fichas(e.respuesta).length >= 1, `respuesta sin color: ${e.titulo}`);
    assert.ok(e.solucion.length >= (e.nivel === 1 ? 1 : 2), `${e.titulo}: el nivel ${e.nivel} pide más de un paso`);
    if (e.nivel < 3) { assert.equal(e.alternativas, undefined); continue; }
    assert.equal(e.alternativas.length, 5, e.titulo);
    assert.equal(new Set(e.alternativas.map(plano)).size, 5);
    const L = plano(negritas(e.respuesta)[0].negrita), valor = plano(fichas(e.respuesta)[0].t);
    assert.equal(plano(e.alternativas['ABCDE'.indexOf(L)]), valor, `${e.titulo}: la letra ${L} no dice ${valor}`);
    letras.push(L);
    // El resuelto nombra las otras cuatro alternativas.
    const nombradas = new Set(negritas(e.solucion).map(n => plano(n.negrita)));
    for (const x of 'ABCDE') if (x !== L) assert.ok(nombradas.has(x), `${e.titulo}: no explica la ${x}`);
  }
  assert.equal(new Set(letras).size, 5, `las letras correctas se reparten: ${letras.join('')}`);
  // La figura da el planteamiento: no marca premios ni empaca (el montón va sin bolsitas).
  for (const e of EJ) if (e.figura) {
    if (e.figura.pieza === 'arit-boletos') assert.equal(PZ('arit-boletos').geometria(e.figura.datos).celdas.filter(c => c.premio).length, 0, e.titulo);
    else assert.ok(!e.figura.datos.bolsitas, e.titulo);
  }
  // Ningún ejemplo usa la plancha de la predicción (del 1 al 50, de 6 en 6) ni el caso de la misión (28 y 7).
  for (const e of EJ) { const t = plano(e.enunciado); assert.ok(!(/\b50\b/.test(t) && /\b6\b/.test(t)) && !(/\b28\b/.test(t) && /\b7\b/.test(t)), e.titulo); }
});

test('idea 1 · cuentas de los ejemplos, aparte', () => {
  const r = Object.fromEntries(I1.ejemplos.map(e => [e.titulo, plano(e.respuesta)]));
  assert.equal(35 % 7, 0); assert.match(r['Un pedido sin sueltos'], /Sobran 0/);
  assert.match(r['Un pedido con sueltos'], new RegExp(`sobran ${45 % 6}$`));
  assert.equal(r['Los primeros múltiplos'], [1, 2, 3, 4, 5].map(k => 12 * k).join(', ').replace(/, (\d+)$/, ' y $1'));
  assert.equal(48, 6 * 8); assert.equal(0 % 7, 0); assert.equal(7 % 1, 0);
  assert.match(r['Premios de una rifa'], new RegExp(`^${cuantos(8, 1, 75)} premios`));
  assert.match(r['El mayor de dos cifras'], new RegExp(`^${mayorHasta(8, 99)},`));
  assert.match(r['El menor de tres cifras'], new RegExp(`^${menorDesde(7, 100)},`));
  assert.deepEqual([6, 7, 8, 9].filter(d => 63 % d === 0), [7, 9]); assert.match(r['¿De cuántos es la bolsita?'], /^De 7 o de 9 /);
  assert.deepEqual([63 % 6, 63 % 8], [3, 7]);
  assert.match(r['Múltiplos en un tramo'], new RegExp(`^${cuantos(6, 20, 70)} múltiplos`));
  assert.match(r['Múltiplos de dos cifras'], new RegExp(`^B: ${cuantos(7, 10, 99)} múltiplos`));
  const t56 = []; for (let x = 51; x < 60; x++) if (x % 8 === 0) t56.push(x);
  assert.deepEqual(t56, [56]); assert.match(r['Tres de cada ocho'], new RegExp(`^D: ${56 / 8 * (8 - 3)} personas`));
  const m13 = mayorHasta(13, 999); assert.equal(m13, 988);
  assert.match(r['El mayor de tres cifras'], new RegExp(`suman ${String(m13).split('').reduce((a, c) => a + +c, 0)}$`));
  const bols = []; for (let b = 11; b < 91; b++) if (91 % b === 0 && 91 / b > 1) bols.push(b);
  assert.deepEqual(bols, [13]); assert.match(r['Un reparto exacto'], /^E: 13 bolsitas/);
  assert.deepEqual([91 % 2, 91 % 3, 91 % 5, 91 % 9, 91 % 11, 91 % 17], [1, 1, 1, 1, 3, 6]);
  assert.match(r['Los que no son múltiplos'], new RegExp(`^C: ${150 - cuantos(4, 1, 150)} números`));
  // Las trampas del nivel 3 que dicen cómo salen.
  assert.deepEqual([(98 - 14) / 7, cuantos(7, 1, 99), Math.ceil(99 / 7), 99 - 10 + 1], [12, 14, 15, 90]);
  assert.deepEqual([56 / 8 * 3, 64 / 8 * 5], [21, 40]);
  assert.deepEqual([9 + 9 + 9, 13 * 75, 9 + 7 + 5, 13 * 77, 999 % 13], [27, 975, 21, 1001, 11]);
  assert.deepEqual([150 - 38, 150 - 36, 150 - 4], [112, 114, 146]);
});

test('idea 1 · glosario: estrena de 2 a 4 palabras con su simple y tres ejemplos; no vuelve a definir las de antes', () => {
  const es = Glosario.porIdea(def)[0];
  assert.deepEqual(es.map(e => e.termino).sort(), ['divisible', 'número impar', 'número par']);
  for (const e of es) { assert.ok(e.simple && e.simple.split(/\s+/).length <= 14, e.termino); assert.ok(Array.isArray(e.ejemplos) && e.ejemplos.length >= 3, e.termino); }
  // «múltiplo», «divisor» y «división exacta» son de Las cuatro operaciones.
  const propios = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const t of ['múltiplo', 'divisor', 'división exacta', 'resto', 'cociente']) assert.ok(!propios.has(Glosario.clave(t)), `${t} se define en otra unidad`);
  assert.deepEqual(Glosario.revisar(def), []);
});

test('idea 1 · notación: × y nunca «·» para multiplicar; cada momento dentro de sus topes de palabras', () => {
  const textos = [I1.titulo, I1.pregunta, I1.aprendizaje, I1.actividad, plano(I1.lee.tarjetas.map(t => t.texto)), I1.juega.consigna, I1.juega.mision.texto, I1.juega.mision.bien,
    plano(I1.predice.pregunta), ...I1.predice.opciones.map(o => o.siFuera || ''), ...I1.mira.pasos.map(p => p.texto + ' ' + plano(p.ecuacion || '')), I1.regla.texto, I1.regla.condicion,
    ...I1.ejemplos.map(e => [plano(e.enunciado), ...e.solucion.map(x => plano(x.texto) + ' ' + plano(x.ecuacion || '')), plano(e.respuesta), ...e.datos.map(plano)].join(' '))];
  for (const t of textos) assert.ok(!/\d\s*·\s*\d|[a-zA-Z]\s·\s[a-zA-Z0-9]/.test(t), `«·» como producto: ${t}`);
  assert.ok(I1.titulo.split(/\s+/).length <= 6 && I1.aprendizaje.split(/\s+/).length <= 25 && I1.regla.texto.split(/\s+/).length <= 30);
  assert.match(I1.pregunta, /\?$/);
});

// ======================= Ideas 2 a 6 (fase 3, 19 nov) =======================
// Lo mismo que la idea 1, con cuentas aparte propias de cada idea: restos con BigInt, criterios contra el número entero,
// pagos por fuerza bruta. Nada de esto usa el código de la unidad.
const RESTO = (N, d) => Number(((BigInt(N) % BigInt(d)) + BigInt(d)) % BigInt(d));
const POT = (b, e, d) => { let x = 1n; const B = BigInt(b), D = BigInt(d); for (let i = 0; i < e; i++) x = (x * B) % D; return Number(x); };
const PAGOS = (p, q, c, ambas = false) => { const o = []; for (let y = 0; q * y <= c; y++) if ((c - q * y) % p === 0) o.push([(c - q * y) / p, y]); return ambas ? o.filter(([x, y]) => x && y) : o; };
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const entero = t => Number(String(t).replace(/\s/g, ''));
const cifraQue = (patron, cumple) => { const s = []; for (let a = 0; a <= 9; a++) { const n = patron.replace(/a/g, a); if (n[0] !== '0' && cumple(Number(n))) s.push(a); } return s; };

// La respuesta de «Ahora tú» de las ideas 2 a 6, leyendo solo la pregunta.
function aparteN(idea, t) {
  let m;
  switch (idea) {
    case 'restos-suman':
      if ((m = t.match(/deja (\d+) sueltos? al empacarlo en bolsitas de (\d+)\. Doña Juana junta (\d+) pedidos/))) return String(RESTO(+m[1] * +m[3], +m[2]));
      if ((m = t.match(/deja (\d+) sueltos? en bolsitas de (\d+)\. Doña Juana despacha de ahí otro que deja (\d+)\./))) return String(RESTO(+m[1] - +m[3], +m[2]));
      if ((m = t.match(/le faltan? (\d+) caramelos? para llenar justo bolsitas de (\d+)\./))) return String(RESTO(-m[1], +m[2]));
      if ((m = t.match(/deja resto (\d+) al dividirlo entre (\d+)\. ¿Qué resto deja (\d+) × N \+ (\d+) entre/))) return String(RESTO(+m[3] * +m[1] + +m[4], +m[2]));
      if ((m = t.match(/N es múltiplo de (\d+) \+ (\d+)\. ¿Qué resto deja N × N/))) return String(RESTO(+m[2] * +m[2], +m[1]));
      break;
    case 'criterios':
      if ((m = t.match(/reempaca ([\d ]+) caramelos en bolsitas de (\d+)\./))) return String(RESTO(entero(m[1]), +m[2]));
      if ((m = t.match(/¿Qué resto deja ([\d ]+) al dividirlo entre (\d+)\?/))) return String(RESTO(entero(m[1]), +m[2]));
      if ((m = t.match(/¿Qué cifra a hace que ([\da]+)̅? sea múltiplo de (\d+)\?/)) || (m = t.match(/¿Qué cifra a hace que ((?:[\da]̅)+) sea múltiplo de (\d+)\?/))) {
        const s = cifraQue(m[1].replace(/̅/g, ''), n => n % +m[2] === 0); assert.equal(s.length, 1, t); return String(s[0]);
      }
      if ((m = t.match(/suman todas las cifras a que hacen de ((?:[\da]̅?)+) un múltiplo de (\d+)\?/))) return String(cifraQue(m[1].replace(/̅/g, ''), n => n % +m[2] === 0).reduce((x, y) => x + y, 0));
      if ((m = t.match(/El número ((?:[\dab]̅?)+) es múltiplo de (\d+) y de (\d+), y b no es 0/))) {
        const p = m[1].replace(/̅/g, ''), s = new Set();
        for (let b = 1; b <= 9; b++) for (const a of cifraQue(p.replace(/b/g, b), n => n % +m[2] === 0 && n % +m[3] === 0)) s.add(a);
        assert.equal(s.size, 1, t); return String([...s][0]);
      }
      break;
    case 'restos-potenciales':
      if ((m = t.match(/¿Qué resto deja (\d+) elevado a (\d+) \+ (\d+) al dividirlo entre (\d+)\?/))) return String(RESTO(POT(+m[1], +m[2], +m[4]) + +m[3], +m[4]));
      if ((m = t.match(/¿Qué resto deja (\d+) elevado a (\d+) al dividirlo entre (\d+)\?/))) return String(POT(+m[1], +m[2], +m[3]));
      if ((m = t.match(/¿En qué cifra termina (\d+) elevado a (\d+)\?/))) return String(POT(+m[1], +m[2], 10));
      if ((m = t.match(/Hoy es (\S+)\. ¿Qué día de la semana será dentro de (\d+) elevado a (\d+) días\?/))) return DIAS[(DIAS.indexOf(m[1]) + POT(+m[2], +m[3], 7)) % 7];
      if ((m = t.match(/N es múltiplo de (\d+) \+ (\d+)\. ¿Qué resto deja N elevado a (\d+) al dividirlo/))) return String(POT(+m[2], +m[3], +m[1]));
      break;
    case 'criterios-pesos':
      if ((m = t.match(/¿Qué resto deja ([\d ]+) al dividirlo entre (\d+)\?/))) return String(RESTO(entero(m[1]), +m[2]));
      if ((m = t.match(/borró una cifra del boleto ((?:[\d☐]̅?)+), que es múltiplo de (\d+)\./))) {
        const s = cifraQue(m[1].replace(/̅/g, '').replace('☐', 'a'), n => n % +m[2] === 0); assert.equal(s.length, 1, t); return String(s[0]);
      }
      if ((m = t.match(/El número ((?:[\da]̅?)+) es múltiplo de (\d+)\. ¿Cuánto vale la cifra a\?/))) {
        const s = cifraQue(m[1].replace(/̅/g, ''), n => n % +m[2] === 0); assert.equal(s.length, 1, t); return String(s[0]);
      }
      break;
    case 'diofanticas':
      if ((m = t.match(/de cuántas maneras se pueden pagar S\/ (\d+) justos con (?:monedas|billetes) de S\/ (\d+) y de S\/ (\d+)\?/i))) return String(PAGOS(+m[2], +m[3], +m[1]).length);
      if ((m = t.match(/paga S\/ (\d+) justos con monedas de S\/ 2 y de S\/ 5\. ¿Cuál es la menor cantidad/))) return String(Math.min(...PAGOS(2, 5, +m[1]).map(([x, y]) => x + y)));
      if ((m = t.match(/gasta justo S\/ (\d+) en bolsas de S\/ (\d+) y cajas de S\/ (\d+), y lleva al menos una de cada una\. Si compra la mayor cantidad posible de cajas/))) {
        const ps = PAGOS(+m[2], +m[3], +m[1], true); return String(ps[ps.length - 1][0]);
      }
      break;
  }
  throw new Error(`pregunta sin cuenta aparte: ${t}`);
}

const IDEAS_2_6 = def.ideas.slice(1);
test('ideas 2 a 6 · colores: cada ficha dice su magnitud y lleva su color; sin verde ni carmín; letras de alternativa sin color', () => {
  for (const I of IDEAS_2_6) {
    const todo = [I.lee, I.juega.leyenda, I.predice, I.mira, I.regla, I.ejemplos];
    for (let s = 0; s < 40; s++) { todo.push(I.ahoraTu.generar(s)); if (s < 12) todo.push(I.resuelve.generar(s)); }
    const fs = fichas(todo);
    assert.ok(fs.length > 100, `${I.id}: fichas ${fs.length}`);
    for (const f of fs) { assert.ok(f.m && def.colores[f.m], `${I.id}: ficha sin magnitud ${JSON.stringify(f)}`); assert.equal(f.v, `c-${def.colores[f.m]}`, `${I.id}: ${JSON.stringify(f)}`); }
    // Los controles: solo el de la bolsita lleva color (turquesa), si lo hay.
    for (const c of I.juega.controles) assert.ok(c.color === undefined || c.color === 'c-i', `${I.id}: control ${c.id} en ${c.color}`);
    const svgs = [];
    for (const t of I.lee.tarjetas) if (t.dibujo) svgs.push(svgDe({ pieza: t.pieza || I.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, I.pieza));
    svgs.push(svgDe(I.predice.dibujo, I.predice.pieza || I.pieza), svgDe(I.predice.revelar, I.predice.pieza || I.pieza));
    I.mira.pasos.forEach(p => svgs.push(PZ(I.mira.pieza).dibujar(I.mira.datos, p.estado)));
    I.ejemplos.forEach(e => { if (e.figura) svgs.push(svgDe(e.figura, I.pieza)); });
    for (const s of svgs) { assert.ok(!/var\(--c-[hd]\)/.test(s), `${I.id}: una figura usa carmín o verde`); assert.ok(!/NaN|undefined/.test(s), `${I.id}: figura con NaN`); }
    for (const n of negritas(I.ejemplos)) { assert.match(plano(n.negrita), /^[A-E]$/); assert.equal(fichas(n).length, 0); }
  }
});

test('ideas 2 a 6 · misión: una sola manera en la grilla, no cumplida al abrir, y cuadra con una cuenta aparte', () => {
  const valores = c => (c.opciones ? c.opciones.map(o => (o && typeof o === 'object' ? o.valor : o)) : rango(c.min, c.max, c.paso || 1));
  const rango = (a, b, p) => { const o = []; for (let x = a; x <= b + 1e-9; x += p) o.push(x); return o; };
  // Lo que pide cada misión, contado aparte.
  const ESPERA = {
    'restos-suman': () => { const o = []; for (let b = 11; b < 20; b++) if ((25 + b) % 7 === 0) o.push({ a: 25, b }); return o; },
    criterios: () => { const o = []; for (let b = 0; b <= 9; b++) if (RESTO(200 + 10 * b + 5, 9) === 0) o.push({ c: 2, b, s: 5 }); return o; },
    'restos-potenciales': () => { const o = []; for (let e = 2; e <= 6; e++) if (POT(2, e, 7) === POT(2, 1, 7)) o.push({ e, k: 7 }); return o.slice(0, 1); },
    'criterios-pesos': () => cifraQue('4a73', n => n % 11 === 0).map(x => ({ x })),
    diofanticas: () => { const ps = PAGOS(2, 5, 23).filter(([x, y]) => x <= 12 && y <= 5), m = Math.min(...ps.map(([x, y]) => x + y)); return ps.filter(([x, y]) => x + y === m).map(([a, b]) => ({ a, b })); },
  };
  for (const I of IDEAS_2_6) {
    const j = I.juega, cs = j.controles, cumplen = [];
    const recorrer = (i, v) => { if (i === cs.length) { if (j.mision.logrado(v)) cumplen.push({ ...v }); return; } for (const x of valores(cs[i])) recorrer(i + 1, { ...v, [cs[i].id]: x }); };
    recorrer(0, {});
    assert.equal(cumplen.length, 1, `${I.id}: la misión se cumple de ${cumplen.length} maneras`);
    assert.deepEqual(ESPERA[I.id](), cumplen, `${I.id}: la cuenta aparte no da el caso de la misión`);
    const inicio = Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : valores(c)[0]]));
    assert.ok(!j.mision.logrado(inicio), `${I.id}: la misión está cumplida al abrir`);
    // La lectura y el dibujo responden en toda la grilla, sin NaN.
    for (const v of [inicio, cumplen[0]]) { assert.ok(!/NaN|undefined/.test(plano(j.lectura(v))), `${I.id}: ${plano(j.lectura(v))}`); assert.ok(!/NaN|undefined/.test(svgDe(j.dibujo(v), j.pieza || I.pieza))); }
  }
});

test('ideas 2 a 6 · Predice: la respuesta cuadra con una cuenta aparte; códigos sin repetir; datos sin la respuesta', () => {
  const C = {
    'restos-suman': String(RESTO(5 * 4, 7)),
    criterios: String(RESTO(237, 4)),
    'restos-potenciales': String(POT(2, 50, 7)),
    'criterios-pesos': String(RESTO(415, 7)),
    diofanticas: String(PAGOS(2, 5, 40).length),
  };
  // Lo que da cada error, también aparte.
  const ERR = {
    'restos-suman': { 'AT-RESTO-MAYOR': 5 * 4, 'AT-RESTO-SUMA': RESTO(5 + 4, 7) },
    criterios: { 'AT-CRITERIO-SUMA': RESTO(2 + 3 + 7, 4), 'AT-CRITERIO-ULTIMA': RESTO(7, 4), 'AT-CRITERIO-MEZCLA': RESTO(3 + 7, 4) },
    'restos-potenciales': { 'AT-CICLO-LUGAR': 50 % 3, 'AT-CICLO-FIN': POT(2, 3, 7) },
    'criterios-pesos': { 'AT-CRITERIO-SUMA-7': RESTO(4 + 1 + 5, 7), 'AT-CRITERIO-ALTERNA': RESTO(5 - 1 + 4, 7), 'AT-PESO-SIN-REDUCIR': 5 * 1 + 1 * 3 + 4 * 2 },
    diofanticas: { 'AT-DIOF-TODAS': Math.floor(40 / 5) + 1, 'AT-DIOF-CERO': PAGOS(2, 5, 40, true).length, 'AT-DIOF-DIVIDE': 40 / 5 },
  };
  for (const I of IDEAS_2_6) {
    const p = I.predice, buena = p.opciones.filter(o => o.correcta);
    assert.equal(buena.length, 1);
    assert.equal(plano(buena[0].texto), C[I.id], I.id);
    const cods = p.opciones.filter(o => !o.correcta).map(o => o.error);
    assert.equal(new Set(cods).size, cods.length, `${I.id}: códigos repetidos`);
    for (const [cod, val] of Object.entries(ERR[I.id])) assert.equal(plano(p.opciones.find(o => o.error === cod).texto), String(val), `${I.id}: ${cod}`);
    for (const o of p.opciones) if (!o.correcta) assert.ok(o.siFuera && o.siFuera.split(/\s+/).length <= 25, `${I.id}: ${o.siFuera}`);
    for (const d of p.datos) assert.ok(!new RegExp(`(^|[^\\d])${C[I.id]} (sueltos|maneras)`).test(plano(d)), `${I.id}: los datos dan la respuesta`);
    assert.ok(!/NaN|undefined/.test(svgDe(p.dibujo, p.pieza || I.pieza) + svgDe(p.revelar, p.pieza || I.pieza)));
  }
});

test(`ideas 2 a 6 · «Ahora tú»: cuatro opciones, datos, códigos y la respuesta cuadra con una cuenta aparte (${SEMILLAS} semillas)`, () => {
  for (const I of IDEAS_2_6) {
    const vistos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const c = I.ahoraTu.generar(s), t = plano(c.pregunta);
      vistos.add(t);
      assert.equal(c.opciones.length, 4, t);
      assert.equal(new Set(c.opciones.map(o => plano(o.texto))).size, 4, t);
      const buena = c.opciones.filter(o => o.correcta);
      assert.equal(buena.length, 1, t);
      // La cuenta imposible (billetes) se comprueba aparte: la correcta no se arma, las otras sí.
      if (/no se puede pagar justo/.test(t)) {
        const [p, q] = t.match(/billetes de S\/ (\d+) y de S\/ (\d+)/).slice(1).map(Number);
        for (const o of c.opciones) assert.equal(PAGOS(p, q, nums(plano(o.texto))[0]).length === 0, !!o.correcta, `${t}: ${plano(o.texto)}`);
      } else assert.equal(plano(buena[0].texto), aparteN(I.id, t), `${I.id} semilla ${s}: ${t}`);
      assert.ok(Array.isArray(c.datos) && c.datos.length >= 1 && c.datos.length <= 6, `sin datos: ${t}`);
      for (const d of c.datos) assert.ok(plano(d).split(/\s+/).length <= 22, plano(d));
      for (const o of c.opciones) if (!o.correcta) { assert.match(o.error, /^AT-/); assert.ok(o.siFuera && o.siFuera.split(/\s+/).length <= 20, `${t}: ${o.siFuera}`); assert.ok(!/NaN|undefined/.test(o.siFuera)); }
      assert.ok(c.solucion && c.solucion.texto && c.solucion.texto.split(/\s+/).length <= 20, `${I.id} semilla ${s}: ${c.solucion && c.solucion.texto}`);
      assert.ok(!/NaN|undefined|\b1 sueltos|\b1 bolsitas|\b1 monedas|\b1 cajas|sobran 1\b|faltan 1\b/.test(t + c.opciones.map(o => o.siFuera || '').join(' ') + c.solucion.texto), `concordancia: ${t}`);
    }
    assert.ok(vistos.size > 100, `${I.id}: casos distintos ${vistos.size}`);
  }
});

test('ideas 2 a 6 · «Así se resuelve»: cuadra con una cuenta aparte y no es ninguna pregunta de «Ahora tú»', () => {
  for (const I of IDEAS_2_6) {
    const deAhora = new Set(); for (let s = 0; s < SEMILLAS; s++) deAhora.add(plano(I.ahoraTu.generar(s).pregunta));
    for (let s = 0; s < 40; s++) {
      const c = I.resuelve.generar(s), t = plano(c.enunciado), r = plano(c.respuesta);
      assert.ok(!deAhora.has(t), `${I.id}: «${t}» también sale en «Ahora tú»`);
      assert.ok(Array.isArray(c.datos) && c.datos.length && c.pasos[0].tipo === 'pide', t);
      let m;
      if ((m = t.match(/dejan (\d+), (\d+) y (\d+) sueltos? al empacarlos en bolsitas de (\d+)\./))) assert.equal(nums(r)[0], RESTO(+m[1] + +m[2] + +m[3], +m[4]), t);
      else if ((m = t.match(/fue de ([\d ]+) caramelos\. Si doña Juana los reempaca en bolsitas de (\d+)/))) assert.equal(nums(r)[0], RESTO(entero(m[1]), +m[2]), t);
      else if ((m = t.match(/¿Qué resto deja (\d+) elevado a (\d+) al dividirlo entre (\d+)\?/))) assert.equal(nums(r)[0], POT(+m[1], +m[2], +m[3]), t);
      else if ((m = t.match(/¿Qué resto deja ([\d ]+) al dividirlo entre (\d+)\?/))) assert.equal(nums(r)[0], RESTO(entero(m[1]), +m[2]), t);
      else if ((m = t.match(/bolsas de S\/ (\d+) y cajas de S\/ (\d+)\. Un cliente gasta justo S\/ (\d+)\./))) assert.equal(nums(r)[0], PAGOS(+m[1], +m[2], +m[3]).length, t);
      else assert.fail(`«Así se resuelve» sin cuenta aparte: ${t}`);
    }
  }
});

test('ideas 2 a 6 · ejemplos: 15 que suben de nivel, con datos y respuesta con color; nivel 3 con cinco alternativas, su letra y las trampas nombradas', () => {
  const letras = [];
  for (const I of IDEAS_2_6) {
    const EJ = I.ejemplos;
    assert.equal(EJ.length, 15, I.id);
    assert.deepEqual(EJ.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3], I.id);
    assert.equal(new Set(EJ.map(e => e.titulo)).size, 15, `${I.id}: títulos repetidos`);
    for (const e of EJ) {
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${I.id}: ${e.titulo}`);
      assert.ok(fichas(e.respuesta).length >= 1, `${I.id}: respuesta sin color: ${e.titulo}`);
      assert.ok(e.solucion.length >= (e.nivel === 1 ? 1 : 2), `${I.id}: ${e.titulo}: el nivel ${e.nivel} pide más de un paso`);
      if (e.nivel < 3) { assert.equal(e.alternativas, undefined); continue; }
      assert.equal(e.alternativas.length, 5, e.titulo);
      assert.equal(new Set(e.alternativas.map(plano)).size, 5);
      const L = plano(negritas(e.respuesta)[0].negrita), valor = plano(fichas(e.respuesta)[0].t);
      assert.ok(plano(e.alternativas['ABCDE'.indexOf(L)]).includes(valor), `${I.id}: ${e.titulo}: la letra ${L} no dice ${valor}`);
      letras.push(L);
      const nombradas = new Set(negritas(e.solucion).map(n => plano(n.negrita)));
      for (const x of 'ABCDE') if (x !== L) assert.ok(nombradas.has(x), `${I.id}: ${e.titulo}: no explica la ${x}`);
    }
    // Las letras correctas de cada idea, todas distintas.
    assert.equal(new Set(letras.slice(-5)).size, 5, `${I.id}: letras ${letras.slice(-5).join('')}`);
  }
});

// Las 75 respuestas, calculadas aparte (fuerza bruta y BigInt). Las trampas que el resuelto describe, también.
test('ideas 2 a 6 · cuentas de los ejemplos, aparte', () => {
  const R = I => Object.fromEntries(I.ejemplos.map(e => [e.titulo, plano(e.respuesta)]));
  const ALT = (I, tit) => I.ejemplos.find(e => e.titulo === tit).alternativas.map(plano);
  const [I2, I3, I4, I5, I6] = IDEAS_2_6;
  const n = s => nums(s)[0];
  let r = R(I2);
  assert.equal(n(r['El resto de una suma']), RESTO(3 + 2, 7)); assert.equal(n(r['Los sueltos llenan otra']), RESTO(5 + 4, 7));
  assert.equal(n(r['Múltiplo más múltiplo']), RESTO(21 + 35, 7)); assert.deepEqual(nums(r['Con el circulito']).slice(-1), [RESTO(47, 6)]);
  assert.equal(n(r['Sobra y falta']), 8 - 5); assert.equal(n(r['El resto de un producto']), RESTO(4 * 3, 5));
  assert.equal(n(r['Tres pedidos']), RESTO(6 + 5 + 4, 9)); assert.equal(n(r['El resto de una resta']), RESTO(30 - 12, 7));
  assert.deepEqual([30 % 7, 12 % 7], [2, 5]);
  for (let k = 1; k < 50; k++) assert.equal((6 * k) % 3, 0);
  assert.equal(n(r['Le faltan 2']), RESTO(-2, 9)); assert.equal(25 % 9, 7);
  assert.equal(n(r['El resto de una expresión']), RESTO(3 * 4 + 5, 7)); assert.deepEqual(ALT(I2, 'El resto de una expresión').map(Number), [3 * 4 + 5, 5, RESTO(17, 7), 4, RESTO(3 * (4 + 5), 7)]);
  assert.equal(n(r['El resto de un cuadrado']), RESTO(25, 9)); assert.deepEqual(ALT(I2, 'El resto de un cuadrado').map(Number), [25, RESTO(10, 9), 5, 7, Math.floor(25 / 9)]);
  assert.equal(n(r['Le faltaba uno']), RESTO(3 * 7, 8)); assert.deepEqual(ALT(I2, 'Le faltaba uno').map(Number), [5, RESTO(3 * 1, 8), 21, 7, 1]);
  assert.equal(n(r['A uno sobra, a otro falta']), RESTO(9 + (11 - 4), 11)); assert.deepEqual(ALT(I2, 'A uno sobra, a otro falta').map(Number), [9 + 4, RESTO(13, 11), 4, 11 - 5, 5]);
  assert.deepEqual([24, 4, 8, 9, 5].filter(d => [12, 24, 36, 48, 60].every(N => N % d === 0)), [4]);
  r = R(I3);
  assert.equal(n(r['La suma de las cifras']), RESTO(2143, 9)); assert.equal(RESTO(471, 3), 0); assert.equal(n(r['La última cifra']), RESTO(3487, 5));
  assert.equal(n(r['Las dos últimas cifras']), RESTO(5318, 4)); assert.equal(n(r['Par o impar']), RESTO(7359, 2)); assert.equal(n(r['Reducir dos veces']), RESTO(98765, 9));
  assert.equal(n(r['Entre 25']), RESTO(4683, 25)); assert.equal(n(r['Entre 8']), RESTO(13124, 8));
  assert.deepEqual(cifraQue('5a7', x => x % 9 === 0), [n(r['La cifra que falta'])]); assert.equal(RESTO(4314, 6), 0);
  const ocultas = new Set(); for (let b = 1; b <= 9; b++) for (const a of cifraQue(`4a3${b}`, x => x % 45 === 0)) ocultas.add(a);
  assert.deepEqual([...ocultas], [n(r['Dos cifras ocultas'])]); assert.deepEqual(cifraQue('4a30', x => x % 9 === 0), [2]);
  assert.equal(n(r['Lo menos que se agrega']), (4 - RESTO(7438, 4)) % 4); assert.equal(n(r['Las tres últimas cifras']), RESTO(251348, 8));
  assert.deepEqual(ALT(I3, 'Las tres últimas cifras').map(Number), [RESTO(48, 8), 4, RESTO(2 + 5 + 1 + 3 + 4 + 8, 8), RESTO(251, 8), 48]);
  assert.equal(n(r['Todas las cifras que sirven']), cifraQue('73a6', x => x % 4 === 0).reduce((a, b) => a + b, 0));
  const perm = ['258', '285', '528', '582', '825', '852'].filter(x => +x % 4 === 0); assert.equal(n(r['Con tres cifras dadas']), perm.length);
  r = R(I4);
  assert.deepEqual(nums(r['Los primeros restos']), [1, 2, 3].map(e => POT(3, e, 5))); assert.equal(n(r['El resto que sigue']), POT(2, 5, 7)); assert.equal(POT(2, 4, 7), 2);
  assert.equal(n(r['La última cifra']), POT(3, 4, 10)); assert.equal(n(r['Un día del ciclo']), POT(2, 9, 7)); assert.equal(n(r['Un exponente grande']), POT(2, 35, 7));
  assert.equal(n(r['Hallar el ciclo']), POT(3, 20, 5)); assert.equal(n(r['La última cifra de una potencia']), POT(7, 23, 10));
  assert.match(r['El día de la semana'], new RegExp(DIAS[(0 + POT(2, 20, 7)) % 7])); assert.deepEqual(nums(r['Las potencias de 10 entre 7']), [1, 2, 3].map(e => POT(10, e, 7)));
  assert.equal(n(r['Una potencia enorme']), POT(2, 100, 7)); assert.equal(n(r['Una cifra final lejana']), POT(3, 47, 10));
  assert.equal(n(r['Una potencia más tres']), RESTO(POT(2, 41, 7) + 3, 7)); assert.equal(n(r['Solo se sabe el resto']), POT(11, 40, 9));
  assert.match(r['Dentro de muchos días'], new RegExp(DIAS[(1 + POT(3, 100, 7)) % 7]));
  r = R(I5);
  assert.equal(RESTO(2574, 11), 0); assert.equal(n(r['Un resto entre 11']), RESTO(936, 11)); assert.equal(n(r['Cuando sale negativo']), RESTO(191, 11));
  assert.equal(n(r['Los pesos del 7']), RESTO(46, 7)); assert.equal(RESTO(100, 7), 2); assert.equal(n(r['Entre 7 con tres cifras']), RESTO(523, 7));
  assert.deepEqual(cifraQue('3a52', x => x % 11 === 0), [n(r['La cifra del boleto'])]); assert.equal(n(r['Entre 13']), RESTO(345, 13)); assert.equal(RESTO(6125, 7), 0);
  for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) assert.equal(RESTO(1001 * a + 110 * b, 11), 0);
  assert.deepEqual(cifraQue('2a5', x => x % 7 === 0), [n(r['Una cifra con el 7'])]); assert.deepEqual(cifraQue('5a2a', x => x % 11 === 0), [n(r['La misma cifra dos veces'])]);
  assert.deepEqual(cifraQue('3a1', x => x % 13 === 0), [n(r['Con el 13'])]); assert.deepEqual(cifraQue('1a75', x => x % 11 === 0), [n(r['Dos cifras, dos criterios'])]);
  assert.deepEqual(cifraQue('1a70', x => x % 11 === 0), [8]);
  const siempre = [7, 11, 13, 9, 101].filter(d => { for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) if ((1010 * a + 101 * b) % d) return false; return true; });
  assert.deepEqual(siempre, [n(r['Un divisor que nunca falla'])]);
  r = R(I6);
  assert.equal(n(r['Lo que suman las monedas']), 2 * 6 + 5 * 3); assert.equal(n(r['Completar con las de S/ 2']), (19 - 15) / 2);
  assert.equal(RESTO(18 - 5, 2), 1); assert.deepEqual(PAGOS(2, 5, 11), [[3, 1]]); assert.equal(PAGOS(10, 20, 35).length, 0);
  assert.equal(n(r['Todas las maneras']), PAGOS(2, 5, 20).length); assert.equal(n(r['La de menos monedas']), Math.min(...PAGOS(2, 5, 31).map(([x, y]) => x + y)));
  assert.equal(n(r['Bolsas y cajas']), PAGOS(3, 7, 34, true).length); assert.deepEqual(PAGOS(2, 5, 33), [[14, 1], [9, 3], [4, 5]]);
  assert.deepEqual(PAGOS(3, 7, 40, true).map(p => p[1]), nums(r['Con los restos']));
  assert.equal(n(r['Con las dos clases']), PAGOS(3, 5, 60, true).length); assert.deepEqual(PAGOS(4, 9, 47, true), [[n(r['Una sola compra posible']), 3]]);
  assert.deepEqual(ALT(I6, 'Un pago imposible').map(x => nums(x)[0]).filter(c => PAGOS(20, 50, c).length === 0), [30]);
  assert.equal(n(r['Lo menos posible']), Math.min(...PAGOS(2, 5, 43).map(([x, y]) => x + y)));
  assert.equal(n(r['Los boletos de la rifa']), PAGOS(3, 5, 49).filter(([x, y]) => y > x).map(([x, y]) => x + y)[0]);
  assert.deepEqual(PAGOS(3, 5, 49).filter(([x, y]) => y > x).length, 1);
});

test('ideas 2 a 6 · glosario: cada una estrena de 2 a 4 palabras con su simple y tres ejemplos', () => {
  const por = Glosario.porIdea(def);
  for (let i = 1; i < 6; i++) {
    const es = por[i];
    assert.ok(es.length >= 2 && es.length <= 4, `${def.ideas[i].id}: estrena ${es.length}`);
    for (const e of es) { assert.ok(e.simple && e.simple.split(/\s+/).length <= 14, e.termino); assert.ok(Array.isArray(e.ejemplos) && e.ejemplos.length >= 3, e.termino); }
  }
  // «máximo común divisor» se mudó a MCD y MCM.
  assert.ok(!def.glosario.some(g => /máximo común divisor/.test(g.termino)));
});

test('ideas 2 a 6 y laboratorio · notación: × y nunca «·» para multiplicar; las letras de la unidad', () => {
  const textos = [];
  for (const I of IDEAS_2_6) {
    textos.push(I.titulo, I.pregunta, I.aprendizaje, I.actividad, plano(I.lee.tarjetas.map(t => [t.texto, ' ', t.ecuacion || ''])), I.juega.consigna, I.juega.mision.texto, I.juega.mision.bien,
      plano(I.predice.pregunta), ...I.predice.opciones.map(o => o.siFuera || ''), ...I.mira.pasos.map(p => p.texto + ' ' + plano(p.ecuacion || '')), I.regla.texto, I.regla.condicion,
      ...I.ejemplos.map(e => [plano(e.enunciado), ...e.solucion.map(x => plano(x.texto) + ' ' + plano(x.ecuacion || '')), plano(e.respuesta), ...e.datos.map(plano)].join(' ')));
    assert.ok(I.titulo.split(/\s+/).length <= 6 && I.aprendizaje.split(/\s+/).length <= 25 && I.regla.texto.split(/\s+/).length <= 30, I.id);
    assert.match(I.pregunta, /\?$/);
  }
  for (const L of def.laboratorio) textos.push(L.consigna, ...L.invitaciones.flatMap(x => [x.texto, x.bien]));
  for (const t of textos) assert.ok(!/\d\s*·\s*\d|[a-zA-Z]\s·\s[a-zA-Z0-9]/.test(t), `«·» como producto: ${t}`);
  // Ni «m» ni «mcd» en los textos: el divisor es d y el MCD es de otra unidad.
  for (const t of textos) assert.ok(!/\bm = |\bmcd\b|≡ r/.test(t), `letra vieja: ${t}`);
});

// ---------- Auditoría y lectores en frío (19 nov): cada corrección con su prueba (falla con la versión anterior) ----------
const I = Object.fromEntries(def.ideas.map(x => [x.id, x]));
const mcdA = (x, y) => (y ? mcdA(y, x % y) : x);
// Igualdades numéricas de un texto («−14 + 11 = 8» era falsa): se evalúan las sumas y restas de enteros.
const sumas = t => [...t.replace(/−/g, '-').matchAll(/(-?\d+(?: [+-] \d+)+) = (-?\d+)(?![\d×])/g)]
  .map(m => [m[0], m[1].split(' ').reduce((a, x, i, xs) => (i === 0 ? +x : xs[i - 1] === '+' ? a + +x : xs[i - 1] === '-' ? a - +x : a), 0), +m[2]]);

test('auditoría · «Ahora tú» del 11: la cuenta del resuelto es cierta también con totales menores que −11', () => {
  let negativos = 0;
  for (let s = 0; s < 1000; s += 5) {
    const c = I['criterios-pesos'].ahoraTu.generar(s), t = plano(c.solucion.texto);
    if (/−1[2-9]/.test(t)) negativos++;
    for (const [txt, izq, der] of sumas(t)) assert.equal(izq, der, `${plano(c.pregunta)}: «${txt}» es falsa`);
    for (const o of c.opciones) assert.ok(!/11 − 1[2-9]/.test(o.siFuera || ''), `${plano(c.pregunta)}: ${o.siFuera}`);
  }
  assert.ok(negativos > 0, 'el caso de un total menor que −11 sigue saliendo');
});

test('auditoría · restos potenciales de «Ahora tú»: ciclos de 3 a 6 que empiezan en la primera potencia (decisión 15)', () => {
  for (let s = 0; s < 1000; s++) {
    if (s % 5 < 3) continue;
    const c = I['restos-potenciales'].ahoraTu.generar(s), t = plano(c.pregunta);
    const m = t.match(/(?:N es múltiplo de (\d+) \+ (\d+)|deja (\d+) elevado a \d+ \+ \d+)\D.*entre (\d+)/);
    assert.ok(m, t);
    const b = Number(m[2] || m[3]), d = Number(m[4]);
    const xs = []; let x = b % d; while (!xs.includes(x)) { xs.push(x); x = (x * b) % d; }
    assert.equal(xs.indexOf(x), 0, `${t}: el ciclo no empieza en la primera potencia`);
    assert.ok(xs.length >= 3 && xs.length <= 6, `${t}: ciclo de ${xs.length}`);
  }
});

test('auditoría · «p de cada d» con p y d sin factor común: un solo total posible aunque se reduzca la razón', () => {
  for (let s = 4; s < 2000; s += 5) {
    const t = plano(I['filas-de-m'].ahoraTu.generar(s).pregunta), [p, d, L, U] = t.match(/(\d+) de cada (\d+).*más de (\d+) y menos de (\d+)/).slice(1).map(Number);
    assert.equal(mcdA(p, d), 1, t);
    let n = 0; for (let T = L + 1; T < U; T++) if (T % (d / mcdA(p, d)) === 0) n++;
    assert.equal(n, 1, t);
  }
});

test('auditoría · el glosario de la idea 3 no dice el criterio del 4, que guarda su predicción', () => {
  const g = Glosario.porIdea ? Glosario.porIdea(def) : null;
  const terminos = def.glosario.filter(x => ['criterio de divisibilidad', 'suma de cifras'].includes(x.termino));
  for (const x of terminos) assert.ok(![x.def, x.simple, ...x.ejemplos].some(e => /[Ee]ntre 4\b|dos últimas/.test(e)), x.termino);
  assert.ok(g === null || g !== undefined);
});

test('lector B · el circulito se dice en palabras en los Datos de todo ejercicio que lo usa', () => {
  const usa = x => (Array.isArray(x) ? x.some(usa) : !!(x && typeof x === 'object' && (x.mult || Object.values(x).some(usa))));
  const dice = c => c.datos.some(l => /con un circulito\): un múltiplo de/.test(plano(l)));
  for (const idea of def.ideas) {
    for (const e of idea.ejemplos) if (usa([e.enunciado, e.datos, e.solucion])) assert.ok(dice(e), `${idea.id}: «${e.titulo}»`);
    for (let s = 0; s < 60; s++) {
      const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s);
      if (usa([a.pregunta, a.datos, a.solucion])) assert.ok(dice(a), `${idea.id} «Ahora tú» ${s}`);
      if (usa([r.enunciado, r.datos, r.pasos])) assert.ok(dice(r), `${idea.id} «Así se resuelve» ${s}`);
    }
  }
  // Y en palabras en Lee de la idea del 11 (donde aparece 11̊ por primera vez en la tarjeta 1).
  assert.match(plano(I['criterios-pesos'].lee.tarjetas[0].texto), /circulito es «un múltiplo de 11»/);
});

test('lectores · letras y notación presentadas antes de usarse', () => {
  // rₑ (no k) para lo que falta; la regla de la idea 1 presenta q y r; la de la idea 2, la resta y rₑ en palabras.
  for (const idea of def.ideas) for (const e of idea.ejemplos) for (const l of e.datos) assert.ok(!/le faltan k\b|− k$/.test(plano(l)), `${e.titulo}: ${plano(l)}`);
  assert.ok(I['filas-de-m'].regla.ecuacion.some(x => x && x.llave && plano(x.llave) === 'q'));
  assert.match(plano(I['filas-de-m'].regla.texto), /cociente de N ÷ d/);
  assert.match(plano(I['restos-suman'].regla.ecuacion), /\) − \(/);
  assert.match(plano(I['restos-suman'].regla.ecuacion.find(x => x && x.nota && /falta/.test(x.nota)).nota), /rₑ/);
  // La raya de a̅b̅c̅ se dice en Lee de la idea 3.
  assert.match(plano(I.criterios.lee.tarjetas[1].texto), /la raya dice que son cifras/);
});

test('lectores · el juego del 11 no da la cifra al abrir; Luma no adelanta en Mira ni en Predice', () => {
  const j = I['criterios-pesos'].juega, t = plano(j.lectura({ x: 0 }));
  assert.ok(!/faltan|sobra/.test(t), t);
  assert.ok(!/cuentan las dos últimas/.test(I.criterios.mira.voz));
  assert.ok(!/No hace falta calcular/.test(I['restos-potenciales'].predice.voz));
});

test('lector B · «dos clases de monedas»; «al menos una de cada una» va con enteros positivos en los Datos', () => {
  assert.match(I.diofanticas.titulo, /clases/);
  assert.ok(I.diofanticas.titulo.split(/\s+/).length <= 6);
  const casos = I.diofanticas.ejemplos.map(e => [e.enunciado, e.datos]);
  for (let s = 3; s < 400; s += 4) { const c = I.diofanticas.ahoraTu.generar(s); casos.push([c.pregunta, c.datos]); }
  for (const [en, da] of casos) if (/al menos una de cada|enteros positivos/.test(plano(en))) assert.ok(da.some(l => /enteros positivos/.test(plano(l))), plano(en));
});

test('lector B · el ejemplo del largo del ciclo no trae los restos en el enunciado', () => {
  const e = I['restos-potenciales'].ejemplos.find(x => x.titulo === 'El largo del ciclo');
  assert.ok(!/2, 4, 1/.test(plano(e.enunciado)), plano(e.enunciado));
});
