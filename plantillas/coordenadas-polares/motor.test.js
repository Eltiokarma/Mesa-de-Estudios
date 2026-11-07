// Pruebas del motor de «El radar» (coordenadas polares). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - polares → cartesianas → polares vuelve al mismo punto, y la escritura principal tiene r ≥ 0 y θ en [0°; 360°⟩;
//    - (−r; θ) es el mismo punto que (r; θ + 180°), y todas las escrituras de equivalentes() son el mismo punto;
//    - cada punto muestreado de r = a cos θ, r = a sen θ y r = a cos(nθ) cumple su ecuación cartesiana o su radio;
//    - la rosa de n impar se cierra en 180° y la de n par en 360°, y el número de pétalos sale contando máximos de |r|;
//    - la forma polar de un complejo es el mismo par que aPolares del punto (x; y);
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (en todos los casos y en un barrido de parámetros);
//    - las predicciones de la escena: la respuesta sale del motor, las opciones son distintas y de la misma forma.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') { assert.ok(real && typeof real === 'object', `${que}: se esperaba un objeto`);
    if (!Object.keys(esperado).length) assert.equal(Object.keys(real).length, 0, `${que}: se esperaba un objeto vacío`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
// Las funciones que devuelven un número o un texto (radio, radianes, normal) se comparan como { valor }.
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  return r !== null && typeof r === 'object' ? r : { valor: r };
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.ok(espera && typeof espera === 'object' && !Array.isArray(espera), `${que}: 'espera' debe ser un objeto`);
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'coordenadas-polares');
  assert.ok(typeof datos.verificacion === 'string', 'falta verificacion');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 24, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera && typeof c.espera === 'object', JSON.stringify(c).slice(0, 80));
    for (const t of c.tambien || []) assert.ok(t.espera && typeof t.espera === 'object' && !Array.isArray(t.espera), `${c.nombre}: 'espera' de 'tambien' debe ser objeto`);
  }
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 300;
const NOTABLES = []; for (let g = 0; g < 360; g += 15) if (g % 30 === 0 || g % 45 === 0) NOTABLES.push(g);
const notableAzar = () => NOTABLES[ent(0, NOTABLES.length - 1)] + 360 * ent(-2, 2);
const noCero = (a, b) => { let v; do v = ent(a, b); while (!v); return v; };
const igualXY = (p, q, que, tol) => { cerca(p.x, q.x, `${que} (x)`, tol || 1e-9); cerca(p.y, q.y, `${que} (y)`, tol || 1e-9); };

test('ida y vuelta: polares → cartesianas → polares, y la escritura principal', () => {
  for (let k = 0; k < N; k++) {
    const r = noCero(-9, 9), theta = rnd() < .7 ? notableAzar() : ent(-720, 720), C = motor.aCartesianas({ r, theta });
    igualXY(C.num, motor.punto({ r, theta }), 'aCartesianas = punto');
    const P = motor.positivo({ r, theta });
    assert.ok(P.theta >= 0 && P.theta < 360, `θ principal fuera de rango: ${P.theta}`);
    igualXY(P.num, C.num, 'positivo es el mismo punto');
    const Q = motor.dePunto(C.num);
    cerca(Q.r, Math.abs(r), 'dePunto r'); cerca(Q.theta, P.theta, 'dePunto θ', 1e-7);
    if (C.exacto) {
      const A = motor.aPolares({ x: C.xTexto, y: C.yTexto });
      assert.equal(A.texto, P.texto, `aPolares(${C.texto}) debe dar ${P.texto}`);
    }
  }
});
test('r negativo, escrituras equivalentes y el polo', () => {
  for (let k = 0; k < N; k++) {
    const r = noCero(-9, 9), theta = ent(-720, 720);
    igualXY(motor.punto({ r: -r, theta }), motor.punto({ r, theta: theta + 180 }), '(−r; θ) = (r; θ + 180°)');
    for (const e of motor.equivalentes({ r, theta }).lista) {
      assert.ok(motor.mismoPunto({ p: { r, theta }, q: e }).valor, `${e.texto} debe ser el mismo punto`);
      assert.ok(e.theta >= -360 && e.theta < 360);
    }
    assert.equal(motor.equivalentes({ r, theta }).lista.length, 4, 'en [−360°; 360°⟩ hay 4 escrituras');
    if (r > 0) assert.ok(motor.mismoPunto({ p: { r, theta }, q: motor.conRNegativo({ r, theta }) }).valor, 'conRNegativo');
    const c = motor.cuadrante({ r, theta });
    if (c.cuadrante > 0) { const p = motor.punto({ r, theta }); assert.equal(c.cuadrante, p.x > 0 ? (p.y > 0 ? 1 : 4) : (p.y > 0 ? 2 : 3), 'cuadrante'); }
  }
  assert.ok(motor.mismoPunto({ p: { r: 0, theta: 17 }, q: { r: 0, theta: 290 } }).valor, 'el polo');
});
test('curvas: los puntos cumplen su ecuación; rosas cerradas y pétalos contados', () => {
  for (let k = 0; k < 60; k++) {
    const a = noCero(-8, 8);
    for (const f of ['cos', 'sen']) {
      const C = motor.circuloEje({ a, f });
      for (const p of motor.muestrear({ tipo: f, a, pasos: 90 })) {
        cerca(Math.hypot(p.x - C.centro.x, p.y - C.centro.y), C.radio, `r = ${a} ${f} θ en la circunferencia`, 1e-9);
        cerca(p.x * p.x + p.y * p.y, a * (f === 'cos' ? p.x : p.y), 'cartesiana', 1e-9);
      }
    }
    for (const p of motor.muestrear({ tipo: 'circulo', a, pasos: 36 })) cerca(Math.hypot(p.x, p.y), Math.abs(a), 'r = a');
    const n = ent(2, 9), tipo = rnd() < .5 ? 'rosaCos' : 'rosaSen', P = motor.petalos({ a, n, f: tipo === 'rosaCos' ? 'cos' : 'sen' });
    const pts = motor.muestrear({ tipo, a, n, pasos: 3600 });
    igualXY(pts[pts.length - 1], pts[0], `la rosa n = ${n} se cierra en ${P.vuelta}°`, 1e-9);
    // contar pétalos: las puntas (|r| = |a|) caen en θ = j·180°/n (cos) o (90° + j·180°)/n (sen); se cuentan los
    // puntos distintos en una vuelta completa
    const puntas = [];
    for (let j = 0; j < 2 * n; j++) {
      const t = tipo === 'rosaCos' ? j * 180 / n : (90 + j * 180) / n, rr = motor.radio({ tipo, a, n, theta: t });
      cerca(Math.abs(rr), Math.abs(a), 'punta del pétalo');
      const q = motor.punto({ r: rr, theta: t }); if (!puntas.some(u => Math.hypot(u.x - q.x, u.y - q.y) < 1e-6)) puntas.push(q);
    }
    assert.equal(puntas.length, P.petalos, `r = ${a} ${tipo} ${n}θ: ${puntas.length} puntas, el motor dice ${P.petalos}`);
  }
  const L = motor.muestrear({ tipo: 'recta', a: 4, k: 60, pasos: 8 });
  for (const p of L) cerca(p.y, Math.sqrt(3) * p.x, 'θ = 60° es y = √3x');
  assert.ok(L[0].x < 0 && L[L.length - 1].x > 0, 'la recta pasa a los dos lados del polo');
});
test('forma polar del complejo = el par polar del punto', () => {
  for (let k = 0; k < N; k++) {
    const re = ent(-9, 9), im = ent(-9, 9); if (!re && !im) continue;
    const F = motor.formaPolar({ re, im }), P = motor.aPolares({ x: re, y: im });
    assert.equal(F.par, P.texto); cerca(F.theta, P.theta, 'θ');
    assert.ok(F.principal > -180 && F.principal <= 180); cerca(((F.principal % 360) + 360) % 360, F.theta, 'principal ≡ θ', 1e-7);
  }
});

test('formaPolar: exponencial con radianes decimales, binómica sin partes 0; cuadrante.lugar en los ejes', () => {
  assert.equal(motor.formaPolar({ re: 1, im: 2 }).exponencial, '√5e^(i·1,11)');
  assert.equal(motor.formaPolar({ re: 0, im: 3 }).binomica, '3i');
  assert.equal(motor.formaPolar({ re: -2, im: 0 }).binomica, '−2');
  assert.equal(motor.formaPolar({ re: -1, im: '−√3' }).binomica, '−1 − √3 i');
  assert.equal(motor.formaPolar({ re: 2, im: -1 }).binomica, '2 − i');
  for (const [g, t] of [[0, 'sobre el eje polar'], [90, 'sobre el eje y, arriba'], [180, 'sobre el eje x, a la izquierda'], [270, 'sobre el eje y, abajo']])
    assert.equal(motor.cuadrante({ r: 2, theta: g }).lugar, t);
  assert.equal(motor.cuadrante({ r: 4, theta: 210 }).lugar, 'III cuadrante');
  assert.equal(motor.texto(3.5), '7/2'); assert.equal(motor.texto('−2√3'), '−2√3');
});

function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    if (e.num && r.num) assert.ok(Object.keys(r.num).some(c => Math.abs(e.num[c] - r.num[c]) > 1e-7), `${que}: el error ${k} vale lo mismo que la correcta`);
    assert.ok(/^(CP\d+|TR\d+|AL\d+)$/.test(e.id), `${que}: el error ${k} no tiene id`);
    assert.ok(e.regla, `${que}: el error ${k} no dice su regla`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) for (const t of [c].concat(c.tambien || [])) { const r = llamar(t.fn || c.fn, t.args); if (r && r.errores) sinChoques(r, c.nombre); }
  for (let k = 0; k < N; k++) {
    const r = noCero(-9, 9), theta = rnd() < .7 ? notableAzar() : ent(-720, 720);
    sinChoques(motor.cuadrante({ r, theta }), 'cuadrante'); sinChoques(motor.positivo({ r, theta }), 'positivo');
    sinChoques(motor.conRNegativo({ r: Math.abs(r), theta }), 'conRNegativo'); sinChoques(motor.aCartesianas({ r, theta }), 'aCartesianas');
    const x = ent(-9, 9), y = ent(-9, 9); if (x || y) sinChoques(motor.aPolares({ x, y }), 'aPolares');
    sinChoques(motor.rectaTheta({ k: notableAzar() }), 'rectaTheta');
    const a = noCero(-9, 9);
    for (const f of ['cos', 'sen']) { sinChoques(motor.circuloEje({ a, f }), 'circuloEje'); sinChoques(motor.cartesianaEje({ a, f }), 'cartesianaEje'); }
    sinChoques(motor.petalos({ a, n: ent(2, 9), f: 'cos' }), 'petalos');
  }
});

// Las predicciones de la escena (index.html): respuesta = motor, opciones distintas y con la misma forma.
const E = (r, ks) => [r.texto].concat(ks.map(k => { assert.ok(r.errores[k], `falta el error ${k}`); return r.errores[k].texto; }));
const ESCENA = {
  'paso1': () => E(motor.cuadrante({ r: 4, theta: 210 }), ['cociente', 'referencia', 'desdeVertical']),
  'paso2': () => E(motor.positivo({ r: -2, theta: 30 }), ['reflejaX', 'reflejaY', 'ignoraSigno']),
  'paso3': () => E(motor.conRNegativo({ r: 3, theta: 60 }), ['mismoAngulo', 'suma90', 'anguloOpuesto']),
  'paso4': () => E(motor.aCartesianas({ r: 4, theta: 150 }), ['cruza', 'sinSigno', 'sinR']),
  'paso5': () => E(motor.aPolares({ x: -2, y: -2 }), ['arctanDirecto', 'sinRaiz', 'sumaPartes']),
  'paso6': () => E(motor.rectaTheta({ k: 60 }), ['semirrecta', 'circunferencia', 'horizontal']),
  'paso7': () => E(motor.circuloEje({ a: 4, f: 'cos' }), ['centroPolo', 'centroEnA', 'ejeCruzado']),
  'eje': () => E(motor.aPolares({ x: 0, y: -3 }), ['arctanInvertido', 'referencia', 'sinRaiz']),
  'a-negativo': () => E(motor.circuloEje({ a: -6, f: 'sen' }), ['ignoraSignoA', 'centroPolo', 'ejeCruzado']),
  'cartesiana': () => E(motor.cartesianaEje({ a: 10, f: 'cos' }), ['sinX', 'cuadradoMal', 'centroEnA']),
  'rosa-impar': () => E(motor.petalos({ a: 2, n: 3, f: 'sen' }), ['siempre2n', 'largoMitad', 'cruzaAyN']),
  'rosa-par': () => E(motor.petalos({ a: 3, n: 2, f: 'cos' }), ['siempreN', 'largoMitad', 'cruzaAyN']),
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const forma = t => (/^\(.*; .*°\)$/.test(t) ? 'polar' : /^\(.*; .*\)$/.test(t) ? 'cart' : /cuadrante$/.test(t) ? 'cuadrante'
    : /^centro/.test(t) ? 'centro' : /^x² \+ y² =/.test(t) ? 'ecuacion' : /pétalos de largo/.test(t) ? 'rosa' : /^una /.test(t) ? 'frase' : 'otro');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
    assert.ok(!ops.map(forma).includes('otro'), `${id}: forma desconocida: ${ops.join(' · ')}`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 2 * Math.min(...largos) + 6, `${id}: largos muy distintos`);
    assert.ok(html.includes(`coordenadas-polares-${id}'`) || html.includes(`id:'${id}'`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.positivo({ r: 2 }), /\{ r, theta \}/);
  assert.throws(() => motor.positivo({ r: 2, theta: 'treinta' }), /grados/);
  assert.throws(() => motor.positivo({ r: 'dos', theta: 30 }), /fracción/);
  assert.throws(() => motor.conRNegativo({ r: -3, theta: 30 }), /positivo/);
  assert.throws(() => motor.equivalentes({ r: 0, theta: 30 }), /polo/);
  assert.throws(() => motor.aPolares({ x: 1 }), /\{ x, y \}/);
  assert.throws(() => motor.rectaTheta({ k: 20 }), /notable/);
  assert.throws(() => motor.circuloEje({ a: 0, f: 'cos' }), /distinto de 0/);
  assert.throws(() => motor.circuloEje({ a: 2, f: 'tan' }), /'cos' o 'sen'/);
  assert.throws(() => motor.petalos({ a: 2, n: 1 }), /entero mayor o igual que 2/);
  assert.throws(() => motor.petalos({ a: 2, n: 2.5 }), /entero/);
  assert.throws(() => motor.formaPolar({ re: 0, im: 0 }), /argumento/);
  assert.throws(() => motor.radio({ tipo: 'espiral', a: 1, theta: 0 }), /tipo/);
  assert.equal(motor.radianes(20), null);
  assert.equal(motor.radianes(-90), '−π/2');
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), p.id); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
