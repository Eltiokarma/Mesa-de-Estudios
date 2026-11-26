// Pruebas propias de «Potenciación y radicación» (además del validador común de contenido/teoria/teoria.test.js).
// Etapa 9 (26 nov): las seis ideas pasan por el contrato, con la propuesta docs/etapa9/propuesta-aritmetica.md como guion.
//   - seis ideas en el orden de la propuesta (cuatro conservan su id; `raiz-cubica` y `contar` son nuevas);
//   - un color fijo por magnitud (propuesta §7): cada ficha de color dice su magnitud (m) y lleva el color de def.colores;
//     nada en verde; letras de alternativa en negrita y sin color;
//   - cada misión se cumple con un solo caso de la grilla y no al abrir (fuerza bruta);
//   - Predice: una sola correcta, rehecha aquí por fuerza bruta, y cada distractor con el valor de su error;
//   - «Ahora tú» en 400 semillas por idea: cuatro opciones distintas, con datos; la correcta se rehace desde el texto de la
//     pregunta con cuentas aparte (raíces por fuerza bruta, factorizaciones, conteos uno por uno), sin el código de la
//     unidad, y es la única que cumple lo que se pide; no repite la predicción;
//   - toda igualdad entre números escrita es cierta (validador con calidad 2 simulada, 400 semillas);
//   - 15 ejemplos por idea que suben de nivel, con datos; los de nivel 3, con cinco alternativas y una sola que cuadra,
//     rehecha aquí; la letra correcta repartida (6 de cada una);
//   - notación: × y nunca «·».
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const E = require('../../../nucleo/ecuacion.js');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./potenciacion-y-radicacion.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const ID = ['perfectos', 'exclusion', 'raiz-entera', 'raiz-cubica', 'contar', 'aproximadas'];
const SEMILLAS = 400;
const idea = id => def.ideas.find(i => i.id === id);
const plano = x => E.texto(x === undefined || x === null ? '' : Array.isArray(x) ? x : [x]);
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
// Los números de un texto: «1 369» → 1369, «3,41» → 3.41 (los superíndices no son cifras).
const nums = t => [...String(t).replace(/(\d)[\s   ](?=\d{3}(?!\d))/g, '$1').matchAll(/\d+(?:,\d+)?/g)].map(m => Number(m[0].replace(',', '.')));
const SUPS = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
// «4³ × 3²» → 576: lee una factorización escrita con superíndices.
const leePot = t => String(t).split('×').reduce((a, p) => { const m = p.trim().match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/); const e = m[2] ? Number([...m[2]].map(c => SUPS[c]).join('')) : 1; return a * Number(m[1]) ** e; }, 1);

// ---------- Cuentas aparte (no usan la unidad) ----------
const raizN = (N, n) => { let k = 0; while ((k + 1) ** n <= N) k++; return k; };
const esPot = (N, n) => raizN(N, n) ** n === N;
const menorMult = (N, n) => { let m = 1; while (!esPot(N * m, n)) m++; return m; };
const menorDiv = (N, n) => { for (let d = 1; d <= N; d++) if (N % d === 0 && esPot(N / d, n)) return d; return null; };
const cuenta = (a, b, n) => { let c = 0; for (let k = 0; k ** n <= b; k++) if (k ** n >= a) c++; return c; };
const divsCuadrados = N => { let c = 0; for (let d = 1; d <= N; d++) if (N % d === 0 && esPot(d, 2)) c++; return c; };
const pasaCifra = N => { let z = 0, x = N; while (x && x % 10 === 0) { x /= 10; z++; } return z % 2 === 0 && [1, 4, 5, 6, 9].includes(x % 10) && (x % 10 !== 5 || x % 100 === 25); };
const correcta = c => c.opciones.find(o => o.correcta);

test('seis ideas en el orden de la propuesta; tabla de letras y colores', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ID);
  assert.deepEqual(def.colores, { numero: 'o', exponente: 'i', raiz: 'f', residuo: 'h' });
  for (const l of ['N', 'k', 'r', 'r_e', 'm', 'a', 'b', 'x']) assert.ok(def.letras[l], l);
});

test('colores: cada ficha dice su magnitud y lleva su color; nada en verde; letras de alternativa sin color', () => {
  const mirar = (x, donde) => {
    for (const f of fichas(x)) {
      assert.ok(f.m && def.colores[f.m], `${donde}: ficha sin magnitud ${JSON.stringify(f)}`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: ${f.m} con otro color`);
    }
  };
  const sinFunciones = o => JSON.parse(JSON.stringify(o));
  for (const I of def.ideas) {
    mirar(sinFunciones(I), I.id);
    for (let s = 0; s < 40; s++) { mirar(I.ahoraTu.generar(s), `${I.id} ahoraTu ${s}`); mirar(I.resuelve.generar(s), `${I.id} resuelve ${s}`); }
    assert.ok(!/c-d\b|'d'/.test(JSON.stringify(sinFunciones(I))), `${I.id}: verde`);
  }
  assert.ok(!JSON.stringify(def.ideas.map(i => i.ejemplos)).replace(/   ·   /g, '').includes('·'), 'nunca «·» en los ejemplos');
});

test('cada misión: no cumplida al abrir y una sola manera en la grilla', () => {
  for (const I of def.ideas) {
    const cs = I.juega.controles;
    const rango = c => (c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, i) => +(c.min + i * c.paso).toFixed(4)));
    const combos = cs.reduce((acc, c) => acc.flatMap(v => rango(c).map(x => Object.assign({}, v, { [c.id]: x }))), [{}]);
    const inicio = Object.fromEntries(cs.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.ok(!I.juega.mision.logrado(inicio), `${I.id}: cumplida al abrir`);
    const ok = combos.filter(v => I.juega.mision.logrado(v));
    // El cubo admite la cáscara pegada o aparte (cuenta el N); en los criterios, la misión es la cifra final (la decena
    // queda libre a propósito).
    const clave = v => (I.id === 'exclusion' ? String(v.u) : JSON.stringify(Object.assign({}, v, { sep: 0 })));
    const distintos = new Set(ok.map(clave));
    assert.equal(distintos.size, 1, `${I.id}: ${distintos.size} maneras`);
    for (const v of combos) { const l = plano(I.juega.lectura(v)); assert.ok(!/NaN|undefined/.test(l), `${I.id}: ${l}`); }
  }
  // Rehechas: 2⁴ × 3² es el único cuadrado de más de 50; con k = 6, sobran 5 → 41; 4³ + 10 = 74; de 50 a 121, 4 cuadrados.
  assert.ok(esPot(144, 2) && !esPot(72, 2) && !esPot(48, 2));
  assert.equal(raizN(41, 2), 6); assert.equal(41 - 36, 5);
  assert.equal(raizN(74, 3), 4); assert.equal(74 - 64, 10);
  assert.equal(cuenta(50, 121, 2), 4); assert.equal(cuenta(50, 120, 2), 3);
  assert.ok(9.61 <= 10 && 10 < 10.24);
});

test('Predice: la correcta, rehecha aquí, y el valor de cada distractor', () => {
  const op = id => Object.fromEntries(idea(id).predice.opciones.map(o => [o.id, o.texto]));
  // Idea 1: 600 = 2³ × 3 × 5²; el menor multiplicador es 6; 30 y 2 no dan cuadrado; 24 sí, pero es mayor.
  assert.equal(2 ** 3 * 3 * 25, 600); assert.equal(menorMult(600, 2), 6); assert.equal(op('perfectos').c, '6');
  assert.ok(!esPot(600 * 30, 2) && !esPot(600 * 2, 2) && esPot(600 * 24, 2) && Math.sqrt(14400) === 120);
  // Idea 2: 44² = 1 936 < 2 021 < 2 025 = 45²; 81, 25 y 36 son cuadrados terminados en 1, 5 y 6.
  assert.ok(44 ** 2 === 1936 && 45 ** 2 === 2025 && !esPot(2021, 2));
  // Idea 3: con k = 9, el mayor residuo es 18.
  let max = 0; for (let N = 81; N < 100; N++) max = Math.max(max, N - raizN(N, 2) ** 2); assert.equal(max, 18);
  assert.equal(op('raiz-entera').c, '18');
  // Idea 4: de 8³ a 9³ faltan 217; 3 × 64 = 192; 2 × 8 + 1 = 17.
  assert.equal(9 ** 3 - 8 ** 3, 217); assert.equal(op('raiz-cubica').c, '217');
  // Idea 5: cuadrados de tres cifras, 22 (bases 10 a 31); √899 ≈ 29,98.
  assert.equal(cuenta(100, 999, 2), 22); assert.equal(op('contar').c, '22'); assert.equal(raizN(899, 2), 29);
  // Idea 6: 1,41² ≤ 2 < 1,42² (en diezmilésimas).
  assert.ok(141 * 141 <= 20000 && 20000 < 142 * 142); assert.equal(op('aproximadas').c, 'Entre 1,41 y 1,42');
});

test('«Ahora tú» en 400 semillas: cuatro opciones, datos y una sola que cumple, rehecha aparte', () => {
  const preds = new Set(def.ideas.map(I => plano(I.predice.pregunta)));
  const rehacer = {
    perfectos(c) {
      const p = plano(c.pregunta), oc = correcta(c).texto;
      if (/cuadrado perfecto\?$/.test(p) && /Cuál/.test(p)) { const ok = c.opciones.filter(o => esPot(leePot(o.texto), 2)); assert.equal(ok.length, 1, p); assert.ok(ok[0].correcta); return; }
      const N = nums(p)[0];
      if (/multiplicar/.test(p)) { const n = /cubo/.test(p) ? 3 : 2; assert.equal(Number(oc.replace(/\s/g, '')), menorMult(N, n), p); return; }
      if (/dividir/.test(p)) { assert.equal(Number(oc.replace(/\s/g, '')), menorDiv(N, 3), p); return; }
      if (/divisores/.test(p)) { assert.equal(Number(oc), divsCuadrados(N), p); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
    exclusion(c) {
      const p = plano(c.pregunta), v = o => Number(o.texto.replace(/[\s  ]/g, ''));
      if (/no puede ser/.test(p)) { const no = c.opciones.filter(o => !esPot(v(o), 2)); assert.equal(no.length, 1, p); assert.ok(no[0].correcta && !pasaCifra(v(no[0]))); return; }
      if (/termina su cuadrado/.test(p)) { const d = nums(p)[0]; assert.equal(Number(correcta(c).texto), (d * d) % 10); return; }
      if (/☐/.test(p)) { const t = p.match(/(\d*☐\d*)/)[1]; const ok = c.opciones.filter(o => esPot(Number(t.replace('☐', o.texto)), 2)); assert.equal(ok.length, 1, p); assert.ok(ok[0].correcta); return; }
      if (/pasa el criterio/.test(p)) { const ok = c.opciones.filter(o => pasaCifra(v(o)) && !esPot(v(o), 2)); assert.equal(ok.length, 1, p); assert.ok(ok[0].correcta); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
    'raiz-entera'(c) {
      const p = plano(c.pregunta), oc = correcta(c).texto, ns = nums(p);
      if (/cuánto sobra/.test(p)) { const N = ns[0], k = raizN(N, 2); assert.equal(oc, `k = ${k}, r = ${N - k * k}`); return; }
      if (/le faltan/.test(p)) { const N = ns[0], k = raizN(N, 2); assert.equal(Number(oc.replace(/\s/g, '')), (k + 1) ** 2 - N); return; }
      if (/es \d+ y su residuo es/.test(p)) { const [k, r] = ns; assert.ok(r <= 2 * k); assert.equal(Number(oc.replace(/\s/g, '')), k * k + r); return; }
      if (/mayor número/.test(p)) { const k = ns[0]; let N = k * k; while (raizN(N + 1, 2) === k) N++; assert.equal(Number(oc.replace(/\s/g, '')), N); return; }
      if (/sobran .* y faltan/.test(p)) { const [r, re] = ns; let N = null; for (let x = 1; x < 5000 && N === null; x++) { const k = raizN(x, 2); if (x - k * k === r && (k + 1) ** 2 - x === re) N = x; } assert.equal(Number(oc.replace(/\s/g, '')), N); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
    'raiz-cubica'(c) {
      const p = plano(c.pregunta), oc = correcta(c).texto.replace(/\s/g, ''), ns = nums(p);
      if (/cuánto sobra/.test(p)) { const N = ns[0], k = raizN(N, 3); assert.equal(oc, `k=${k},r=${N - k ** 3}`); return; }
      if (/hay que agregar/.test(p)) { const k = ns[0]; assert.equal(Number(oc), (k + 1) ** 3 - k ** 3); return; }
      if (/es \d+ y su residuo es/.test(p)) { const [k, r] = ns; assert.ok(r <= 3 * k * k + 3 * k); assert.equal(Number(oc), k ** 3 + r); return; }
      if (/mayor número/.test(p)) { const k = ns[0]; assert.equal(Number(oc), (k + 1) ** 3 - 1); return; }
      if (/es un cubo perfecto/.test(p)) { const N = ns[0]; assert.ok(esPot(N, 3)); assert.equal(Number(oc), raizN(N, 3)); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
    contar(c) {
      const p = plano(c.pregunta), oc = Number(correcta(c).texto.replace(/[\s  ]/g, '')), ns = nums(p);
      if (/cuadrados perfectos hay de/.test(p)) { assert.equal(oc, cuenta(ns[0], ns[1], 2)); return; }
      if (/cubos perfectos hay de/.test(p)) { assert.equal(oc, cuenta(ns[0], ns[1], 3)); return; }
      if (/tienen \d+ cifras/.test(p)) { const c2 = ns[0], n = /cuadrados/.test(p) ? 2 : 3; assert.equal(oc, cuenta(10 ** (c2 - 1), 10 ** c2 - 1, n)); return; }
      if (/cuadrados perfectos o cubos/.test(p)) { const L = ns[1]; let t = 0; for (let x = 1; x <= L; x++) if (esPot(x, 2) || esPot(x, 3)) t++; assert.equal(oc, t); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
    aproximadas(c) {
      const p = plano(c.pregunta), oc = correcta(c).texto, ns = nums(p);
      const enc = (N, u) => { let t = 0; while ((t + 1) ** 2 <= N * u * u) t++; return t; };
      if (/décimas seguidas/.test(p)) { const N = ns[0], t = enc(N, 10); assert.deepEqual(nums(oc), [t / 10, (t + 1) / 10]); return; }
      if (/centésimas/.test(p)) { const N = ns[0], t = enc(N, 100); assert.deepEqual(nums(oc), [t / 100, (t + 1) / 100]); return; }
      if (/aproximación por/.test(p)) { const N = ns[0], t = enc(N, 10), ex = /exceso/.test(p); assert.equal(nums(oc)[0], (ex ? t + 1 : t) / 10); return; }
      if (/√\(/.test(p)) { assert.equal(Number(oc), Math.sqrt(ns[0] + ns[1])); assert.ok(Number.isInteger(Number(oc))); return; }
      throw new Error(`tipo no reconocido: ${p}`);
    },
  };
  for (const I of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const c = I.ahoraTu.generar(s), txt = JSON.stringify(c);
    assert.equal(c.opciones.length, 4, `${I.id} ${s}`);
    assert.equal(new Set(c.opciones.map(o => o.texto)).size, 4, `${I.id} ${s}: opciones repetidas`);
    assert.equal(c.opciones.filter(o => o.correcta).length, 1);
    assert.ok(c.datos && c.datos.length, `${I.id} ${s}: sin datos`);
    assert.ok(!/NaN|undefined|null|\[object/.test(txt), `${I.id} ${s}: ${txt.slice(0, 200)}`);
    assert.ok(!preds.has(plano(c.pregunta)), `${I.id} ${s}: repite la predicción`);
    for (const o of c.opciones.filter(o => !o.correcta)) assert.ok(o.siFuera && o.error, `${I.id} ${s}: distractor sin explicar`);
    rehacer[I.id](c);
  }
});

test('«Así se resuelve»: sin NaN y no repite la predicción', () => {
  for (const I of def.ideas) for (let s = 0; s < 100; s++) {
    const c = I.resuelve.generar(s), txt = JSON.stringify(c);
    assert.ok(!/NaN|undefined|\[object/.test(txt), `${I.id} ${s}`);
    assert.notEqual(plano(c.enunciado), plano(I.predice.pregunta));
  }
});

test('toda igualdad escrita es cierta y las reglas de calidad 2 pasan (400 semillas, marca simulada)', () => {
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: SEMILLAS });
  assert.deepEqual(p, []);
});

test('ejemplos: 15 por idea, 5 por nivel, con datos; nivel 3 con una sola alternativa que cuadra; letras repartidas', () => {
  // La respuesta de cada nivel 3, rehecha aquí (en el orden de la unidad).
  const N3 = {
    perfectos: [menorMult(540, 2), menorMult(1350, 3), divsCuadrados(3600), (() => { let m = 10; while (!esPot(75 * m, 2)) m++; return m; })(), (() => { let m = 1; while (!(esPot(72 * m, 2) && esPot(72 * m, 3))) m++; return m; })()],
    exclusion: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find(d => esPot(Number(`7${d}69`), 2)), [1225, 4096, 6400, 2890, 9801].find(n => !esPot(n, 2)), [1024, 2025, 3026, 4027, 5028].filter(pasaCifra).length, raizN(5776, 2), [1681, 2401, 2116, 3136, 2501].find(n => !esPot(n, 2))],
    'raiz-entera': [(() => { let N = 529; while (raizN(N + 1, 2) === 23) N++; return N; })(), 11 * 11 + 18, (() => { for (let k = 2; ; k++) if (4 * k - 4 === 36) return k * k; })(), 20 * 20 + 40, 45 ** 2 - 2000],
    'raiz-cubica': [11 ** 3 - 1, 7 ** 3 + 69, raizN(2744, 3), 7 ** 3 - 300, raizN(4913, 3)],
    contar: [cuenta(1000, 9999, 2), (() => { let t = 0; for (let x = 1; x <= 200; x++) if (esPot(x, 2) || esPot(x, 3)) t++; return t; })(), cuenta(49, 342, 3), cuenta(1000, 2000, 2), [...Array(32).keys()].filter(k => k * k >= 100 && k * k <= 999 && k % 2).length],
    aproximadas: [3.31, 7.0, Math.sqrt(169), 6.4, [...Array(20).keys()].filter(n => n * n > 50 && n * n < 300).length],
  };
  assert.ok(esPot(540 * 15, 2) && N3['raiz-entera'][2] === 100 && N3.contar[0] === 68);
  const letras = {};
  for (const I of def.ideas) {
    assert.equal(I.ejemplos.length, 15, I.id);
    for (const n of [1, 2, 3]) assert.equal(I.ejemplos.filter(e => e.nivel === n).length, 5);
    I.ejemplos.filter(e => e.nivel === 3).forEach((e, i) => {
      assert.equal(e.alternativas.length, 5, `${I.id}: ${e.titulo}`);
      const v = a => Number(String(a).replace(/[\s   m]/g, '').split('y')[0].replace(',', '.'));
      const ok = e.alternativas.map((a, j) => [j, v(a)]).filter(([, x]) => Math.abs(x - N3[I.id][i]) < 1e-9);
      assert.equal(ok.length, 1, `${I.id}: ${e.titulo} (${N3[I.id][i]})`);
      const L = 'ABCDE'[ok[0][0]];
      assert.ok(plano(e.respuesta).startsWith(L), `${I.id}: ${e.titulo}: la respuesta no dice ${L}`);
      letras[L] = (letras[L] || 0) + 1;
    });
    for (const e of I.ejemplos) assert.ok(e.datos && e.datos.length, `${I.id}: ${e.titulo} sin datos`);
  }
  assert.deepEqual(letras, { A: 6, B: 6, C: 6, D: 6, E: 6 });
});

// ---------- Auditoría de cierre (26 nov): cada prueba falla con la versión anterior ----------
const textoDe = x => JSON.stringify(x, (k, v) => (typeof v === 'function' ? undefined : v));
const cifras4 = t => /(^|[^\d,])\d{4,}(?![\d,₍])/.test(t);

test('auditoría: la tarjeta de «Lee» de la idea 6 no adelanta la Predice (ninguna cifra de √2 después de 1,4)', () => {
  const I = idea('aproximadas');
  const lee = textoDe(I.lee) + textoDe(I.juega.consigna) + textoDe(I.juega.mision);
  assert.ok(!/1,41/.test(lee), 'Lee o el juego muestran 1,41…, la respuesta de la Predice');
  // y la raíz que muestra la calculadora no sale en «Ahora tú» ni en «Así se resuelve»
  const cuenta = (lee.match(/√(\d+)/) || [])[1];
  if (cuenta) for (let s = 0; s < SEMILLAS; s++) {
    assert.ok(!new RegExp(`√${cuenta}(?!\\d)`).test(plano(I.ahoraTu.generar(s).pregunta)), `Ahora tú pregunta por √${cuenta} (semilla ${s})`);
  }
});

test('auditoría: lo que se descarta por los ceros tiene un solo cero o tres (idea 2, «Ahora tú» y «Así se resuelve»)', () => {
  const I = idea('exclusion');
  const ceros = n => { let z = 0; while (n && n % 10 === 0) { n /= 10; z++; } return z; };
  for (let s = 0; s < SEMILLAS; s++) {
    const r = I.resuelve.generar(s), ns = nums(plano(r.respuesta)).filter(n => n % 10 === 0);
    for (const n of ns) assert.ok(ceros(n) % 2 === 1, `Así se resuelve, semilla ${s}: ${n} tiene ${ceros(n)} ceros y se descarta por «tres ceros»`);
    if (s % 4 === 0) {
      const c = I.ahoraTu.generar(s), n = nums(correcta(c).texto)[0];
      if (n % 10 === 0) assert.ok(ceros(n) % 2 === 1, `Ahora tú, semilla ${s}: ${n} se descarta por algo que el criterio no dice`);
      assert.ok(!/\b3 ceros/.test(plano(c.solucion.texto)), `semilla ${s}: «3 ceros» en cifra`);
    }
  }
});

test('auditoría: las cifras de mil o más llevan su espacio (ideas 3 y 4, «Ahora tú» y «Así se resuelve»)', () => {
  for (const id of ['raiz-entera', 'raiz-cubica']) {
    const I = idea(id);
    for (let s = 0; s < SEMILLAS; s++) {
      const c = I.ahoraTu.generar(s), r = I.resuelve.generar(s);
      const t = [plano(c.pregunta), ...c.opciones.map(o => plano(o.texto) + ' ' + plano(o.siFuera)), plano(c.solucion.texto), plano(c.solucion.ecuacion)].join(' ');
      assert.ok(!cifras4(t), `${id} Ahora tú, semilla ${s}: ${t.match(/\d{4,}/)}`);
      const tr = r.pasos.map(p => plano(p.texto) + ' ' + plano(p.ecuacion)).join(' ') + plano(r.respuesta);
      assert.ok(!cifras4(tr), `${id} Así se resuelve, semilla ${s}: ${tr.match(/\d{4,}/)}`);
    }
  }
});

test('auditoría: «Ahora tú» sin distractores raros y con datos que bastan', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    // idea 1: multiplicar por 1 no es una respuesta que alguien dé
    const c1 = idea('perfectos').ahoraTu.generar(s);
    if (/multiplicar|dividir/.test(plano(c1.pregunta))) for (const o of c1.opciones) assert.notEqual(plano(o.texto), '1', `perfectos, semilla ${s}: opción 1`);
    // idea 4, arista: los cubos son de cuatro cifras menores que 20³; los datos no traen 30³
    const c4 = idea('raiz-cubica').ahoraTu.generar(s);
    if (/es un cubo perfecto/.test(plano(c4.pregunta))) {
      assert.ok(!c4.datos.some(d => /30³/.test(plano(d))), `raiz-cubica, semilla ${s}: 30³ en datos`);
      assert.ok(!/30³/.test(plano(c4.solucion.texto)), `raiz-cubica, semilla ${s}: «entre 10³ y 30³»`);
    }
    // idea 6: el distractor lejano dice qué pasa con su cuadrado; «N/2 pasa de N» solo con N ≥ 5
    const c6 = idea('aproximadas').ahoraTu.generar(s);
    for (const o of c6.opciones) assert.ok(!/no es ninguno de los dos bordes/.test(plano(o.siFuera)), `aproximadas, semilla ${s}`);
    const m = plano(c6.pregunta).match(/por (?:exceso|defecto) de √(\d+)/);
    if (m) assert.ok(Number(m[1]) >= 5, `aproximadas, semilla ${s}: N = ${m[1]}`);
  }
});

test('auditoría: la trampa E de «El mayor con raíz 23» sale de un error real', () => {
  const e = idea('raiz-entera').ejemplos.find(x => x.titulo === 'El mayor con raíz 23');
  assert.ok(!/no sale de ninguna cuenta/.test(textoDe(e.solucion)));
  assert.ok(!e.alternativas.includes('546'));
});

test('lector en frío, ronda 1 (26 nov): lo que trabó a los lectores', () => {
  const t = id => textoDe(idea(id));
  // idea 3: el «Vale si» dice que r + rₑ = 2k + 1 tampoco se usa con N cuadrado; la leyenda dice qué es rₑ
  assert.match(plano(idea('raiz-entera').regla.condicion), /r \+ rₑ = 2k \+ 1 solo se usan/);
  assert.ok(idea('raiz-entera').juega.leyenda.some(l => /residuo por exceso/.test(plano(l.t))));
  // idea 4: la cáscara en la leyenda; sin «r = 216» encimado en Mira y la regla
  assert.ok(idea('raiz-cubica').juega.leyenda.some(l => /cáscara/.test(plano(l.s))));
  assert.ok(!/r = 216/.test(textoDe(idea('raiz-cubica').mira) + textoDe(idea('raiz-cubica').regla.dibujo)));
  assert.ok(!/2k \+ 1 del cuadrado/.test(t('raiz-cubica')));
  // idea 5: los circulitos vacíos en la leyenda; el ejemplo de la recta sin un cuadrado pegado a un extremo
  assert.ok(idea('contar').juega.leyenda.some(l => plano(l.s) === '○'));
  const ej = idea('contar').ejemplos.find(e => e.titulo === 'Bandejas sin sobrantes');
  const [a, b] = nums(plano(ej.enunciado));
  for (let k = 1; k * k <= 200; k++) assert.ok(Math.abs(k * k - a) > 3 && Math.abs(k * k - b) > 3, `${k * k} pegado a ${a} o ${b}`);
  // idea 6: la recta dice qué mide; el «Vale si» presenta la raíz de una suma como caso de N; √3 arranca en 1,71
  assert.match(plano(idea('aproximadas').juega.consigna), /La recta mide N/);
  assert.match(plano(idea('aproximadas').regla.condicion), /Si N es una suma/);
  assert.match(textoDe(idea('aproximadas').ejemplos.find(e => e.titulo === '√3 por centésimas')), /desde 1,71/);
  // idea 1 y 2: el porqué que faltaba en dos ejemplos; la regla 2 no parte «se descarta»
  assert.match(t('perfectos'), /un cuadrado solo suma exponentes pares/);
  assert.match(t('exclusion'), /4 900 = 49 × 100/);
  assert.ok(idea('exclusion').regla.ecuacion.some(x => /⇒\u00a0se\u00a0descarta/.test(String(x))));
});
