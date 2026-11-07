// Pruebas del motor de «La cuerda del jardinero». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - elipse: c² = a² − b², e < 1, sus puntos cumplen la ecuación y PF₁ + PF₂ = 2a;
//    - hipérbola: c² = a² + b², e > 1, |PF₁ − PF₂| = 2a y sus ramas se pegan a las asíntotas;
//    - parábola: PF = PD en todos sus puntos y el lado recto mide 4|p|;
//    - la ecuación general armada desde una cónica conocida se reconoce y se completa de vuelta;
//    - el cono: circunferencia, elipse, parábola e hipérbola según la inclinación, con e = sen φ / sen g;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (en todos los casos y en un barrido de parámetros);
//    - las predicciones de la escena: la respuesta sale del motor, las opciones son distintas y de la misma forma.
// 3. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: se esperaba un objeto`);
    if (Object.keys(esperado).length === 0) assert.deepEqual(Object.keys(real), [], `${que}: se esperaba vacío`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  if (espera.error) { assert.throws(() => llamar(fn, args), e => e.message.includes(espera.error), `${que}: se esperaba el error «${espera.error}»`); return; }
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'conicas');
  assert.equal(datos.verificacion, '', 'la verificación la llena otro subagente');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args), JSON.stringify(c).slice(0, 80));
    assert.ok(c.espera && typeof c.espera === 'object' && !Array.isArray(c.espera), `${c.nombre}: espera debe ser un objeto`);
    for (const t of c.tambien || []) assert.ok(t.espera && typeof t.espera === 'object' && !Array.isArray(t.espera), `${c.nombre}: espera de 'tambien'`);
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
const elegir = xs => xs[ent(0, xs.length - 1)];
const N = 250;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const CAJA = { x0: -40, x1: 40, y0: -40, y1: 40, n: 60 };

test('elipse: c² = a² − b², e < 1, la ecuación y la cuerda de largo 2a', () => {
  for (let k = 0; k < N; k++) {
    const b2 = ent(1, 60), a2 = b2 + ent(1, 60), h = ent(-6, 6), kk = ent(-6, 6), eje = elegir(['x', 'y']);
    const E = motor.elipse(eje === 'x' ? { h, k: kk, nx: a2, ny: b2 } : { h, k: kk, nx: b2, ny: a2 });
    assert.equal(E.eje, eje);
    cerca(E.c.valor ** 2, a2 - b2, 'c²'); cerca(E.a.valor ** 2, a2, 'a²'); cerca(E.b.valor ** 2, b2, 'b²');
    assert.ok(E.e.valor > 0 && E.e.valor < 1, 'e < 1'); cerca(E.e.valor, E.c.valor / E.a.valor, 'e = c/a');
    cerca(E.LR.valor, 2 * b2 / E.a.valor, 'LR = 2b²/a');
    for (const tr of motor.trazar(E, CAJA)) for (const P of tr) {
      const nx = eje === 'x' ? a2 : b2, ny = eje === 'x' ? b2 : a2;
      cerca((P.x - h) ** 2 / nx + (P.y - kk) ** 2 / ny, 1, 'el punto cumple la ecuación', 1e-9);
      cerca(motor.distancias(E, P).suma, 2 * E.a.valor, 'PF₁ + PF₂ = 2a', 1e-9);
    }
    const S = motor.sobre(E, { x: h + ent(-20, 20) + .3, y: kk + ent(-20, 20) + .7 });
    cerca(motor.distancias(E, S).suma, 2 * E.a.valor, 'el lápiz sigue en la elipse');
  }
});
test('hipérbola: c² = a² + b², e > 1, |PF₁ − PF₂| = 2a y las asíntotas', () => {
  for (let k = 0; k < N; k++) {
    const a2 = ent(1, 50), b2 = ent(1, 50), h = ent(-5, 5), kk = ent(-5, 5), eje = elegir(['x', 'y']);
    const H = motor.hiperbola({ h, k: kk, a2, b2, eje });
    cerca(H.c.valor ** 2, a2 + b2, 'c²'); assert.ok(H.e.valor > 1, 'e > 1');
    const m = eje === 'x' ? Math.sqrt(b2 / a2) : Math.sqrt(a2 / b2);
    cerca(H.pendiente.valor, m, 'pendiente de las asíntotas');
    const trs = motor.trazar(H, CAJA); assert.ok(trs.length >= 2, 'dos ramas');
    for (const tr of trs) for (const P of tr) {
      const u = eje === 'x' ? P.x - h : P.y - kk, v = eje === 'x' ? P.y - kk : P.x - h;
      cerca(u * u / a2 - v * v / b2, 1, 'el punto cumple la ecuación', 1e-7);
      cerca(motor.distancias(H, P).diferencia, 2 * H.a.valor, '|PF₁ − PF₂| = 2a', 1e-7);
    }
    const lejos = motor.puntoEn(H, 6, 1);   // muy lejos, la rama se pega a la asíntota
    cerca(Math.abs((lejos.y - kk) / (lejos.x - h)), m, 'la rama tiende a la asíntota', 1e-4);
  }
});
test('parábola: PF = PD en todos sus puntos y LR = 4|p|', () => {
  for (let k = 0; k < N; k++) {
    let p = ent(-12, 12); if (!p) p = 1;
    const eje = elegir(['x', 'y']), h = ent(-6, 6), kk = ent(-6, 6), P0 = motor.parabola({ eje, h, k: kk, cuatroP: p });
    cerca(P0.LR, Math.abs(p), 'LR = |4p|');
    for (const tr of motor.trazar(P0, CAJA)) for (const P of tr) { const d = motor.distancias(P0, P); cerca(d.PF, d.PD, 'PF = PD', 1e-9); }
    const S = motor.sobre(P0, { x: ent(-20, 20), y: ent(-20, 20) }), d = motor.distancias(P0, S);
    cerca(d.PF, d.PD, 'el punto arrastrado sigue en la parábola');
  }
});
test('la ecuación general se reconoce y se completa de vuelta', () => {
  for (let k = 0; k < N; k++) {
    const h = ent(-5, 5), kk = ent(-5, 5), s = elegir([1, -1, 2, -3]);
    const tipo = elegir(['elipse', 'hiperbola', 'circunferencia', 'parabola']);
    let A, C, Fc, D, E;
    if (tipo === 'parabola') {   // (x − h)² = q(y − k)
      let q = ent(-8, 8); if (!q) q = 2;
      A = s; C = 0; D = -2 * h * s; E = -q * s; Fc = (h * h + q * kk) * s;
      const G = motor.general({ A, C, D, E, F: Fc });
      assert.equal(G.tipo, 'parabola'); cerca(G.conica.h, h, 'h'); cerca(G.conica.k, kk, 'k'); cerca(G.conica.p, q / 4, 'p');
      continue;
    }
    const nx = ent(1, 9), ny = tipo === 'circunferencia' ? nx : ent(1, 9);
    if (tipo === 'elipse' && nx === ny) continue;
    const sy = tipo === 'hiperbola' ? -1 : 1;
    // nx·ny ( (x − h)²/nx ± (y − k)²/ny − 1 ) = 0, por s
    A = ny * s; C = sy * nx * s; D = -2 * h * A; E = -2 * kk * C; Fc = A * h * h + C * kk * kk - nx * ny * s;
    const G = motor.general({ A, C, D, E, F: Fc });
    assert.equal(G.tipo, tipo, `${tipo} desde ${G.ecuacionGeneral}`);
    assert.equal(G.porSignos, tipo, 'los signos de A y C ya lo dicen');
    cerca(G.conica.num.h, h, 'h'); cerca(G.conica.num.k, kk, 'k');
    if (tipo === 'hiperbola') { cerca(G.conica.a2.valor, G.conica.eje === 'x' ? nx : ny, 'a²'); }
    if (tipo === 'elipse') cerca(G.conica.a2.valor, Math.max(nx, ny), 'a²');
  }
});
test('circunferencia: la general y la ordinaria dicen lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const h = ent(-9, 9), kk = ent(-9, 9), r2 = ent(1, 80), C = motor.circunferencia({ h, k: kk, r2 });
    const G = motor.circunferenciaGeneral({ D: C.D, E: C.E, F: C.F });
    assert.equal(G.texto, C.texto); cerca(G.r * G.r, r2, 'r²');
    const t = rnd() * 6.28, P = motor.puntoEn(C, t); cerca(Math.hypot(P.x - h, P.y - kk), C.r, 'el punto a distancia r');
  }
});
test('el cono: la curva depende de la inclinación del plano, con e = sen φ / sen g', () => {
  for (let k = 0; k < N; k++) {
    const g = ent(20, 70), fi = ent(0, 85), Q = motor.cono({ inclinacion: fi, generatriz: g });
    const esperado = fi === 0 ? 'circunferencia' : fi === g ? 'parabola' : fi < g ? 'elipse' : 'hiperbola';
    assert.equal(Q.tipo, esperado, `φ = ${fi}°, g = ${g}°`);
    cerca(Q.e, Math.sin(fi * Math.PI / 180) / Math.sin(g * Math.PI / 180), 'e');
    const t = Math.tan(g * Math.PI / 180), m = Math.tan(fi * Math.PI / 180);
    for (const P of Q.cortes) { cerca(P.y, m * P.x - 1, 'el corte está en el plano'); cerca(Math.abs(P.y), t * Math.abs(P.x), 'y en una generatriz'); }
    assert.equal(Q.cortes.length, fi === g ? 1 : 2);
  }
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
const ID_OK = id => /^CO\d+$/.test(id) && motor.ERRORES[id];
function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  const vistos = new Set([r.texto]);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(ID_OK(e.id), `${que}: el error ${k} no tiene id del catálogo`);
    assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta (${r.texto})`);
    if (typeof e.valor === 'number' && typeof r.valor === 'number') assert.ok(!casi(e.valor, r.valor), `${que}: el error ${k} da lo mismo que la correcta`);
    vistos.add(e.texto);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
const PREGUNTAS = ['semiejeMenor', 'excentricidad', 'ladoRecto', 'focos', 'foco', 'lr', 'pendiente'];
function revisar(r, que) {
  if (!r || typeof r !== 'object') return;
  if (r.errores && 'texto' in r) sinChoques(r, que);
  for (const k of PREGUNTAS) if (r[k] && r[k].errores) sinChoques(r[k], `${que} · ${k}`);
  if (r.conica) revisar(r.conica, `${que} · cónica`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  const seguro = (fn, args) => { try { return llamar(fn, args); } catch (e) { return undefined; } };   // los casos de error
  for (const c of datos.casos) {
    revisar(seguro(c.fn, c.args), c.nombre);
    for (const t of c.tambien || []) revisar(seguro(t.fn || c.fn, t.args), c.nombre);
  }
  for (let k = 0; k < N; k++) {
    const a = ent(2, 15), c = ent(1, a - 1);
    revisar(motor.elipse({ a, c, h: ent(-5, 5), k: ent(-5, 5), eje: elegir(['x', 'y']) }), `elipse a = ${a}, c = ${c}`);
    const b2 = ent(1, 40); revisar(motor.elipse({ h: ent(-5, 5), k: ent(-5, 5), nx: b2 + ent(1, 40), ny: b2 }), 'elipse por denominadores');
    revisar(motor.hiperbola({ h: ent(-5, 5), k: ent(-5, 5), a2: ent(1, 40), b2: ent(1, 40), eje: elegir(['x', 'y']) }), 'hipérbola');
    let p = ent(-9, 9); if (!p) p = -1;
    revisar(motor.parabola({ eje: elegir(['x', 'y']), h: ent(-5, 5), k: ent(-5, 5), cuatroP: p }), 'parábola');
    revisar(motor.circunferenciaGeneral({ D: ent(-10, 10), E: ent(-10, 10), F: ent(-30, 5) }), 'circunferencia general');
    revisar(motor.general({ A: elegir([1, -1, 2, 4, -9]), C: elegir([1, -1, 3, -4, 9, 0]), D: ent(-9, 9), E: ent(-9, 9), F: ent(-20, 20) }), 'general');
    revisar(motor.plato({ ancho: 2 * ent(5, 80), hondo: ent(1, 40) }), 'plato');
    revisar(motor.cono({ inclinacion: ent(0, 85), generatriz: ent(20, 70) }), 'cono');
  }
  // lo que se arrastra en la escena: los clavos de la cuerda de 10 (c de 0 a 4,5 en pasos de 1/2)
  for (let c2 = 1; c2 <= 9; c2++) revisar(motor.elipse({ a: 5, c: `${c2}/2` }), `cuerda de 10, c = ${c2}/2`);
});

// Las predicciones de la escena (index.html): respuesta del motor, opciones distintas y con la misma forma.
const op = (r, ...ks) => [r.texto, ...ks.map(k => { assert.ok(r.errores[k], `falta el error ${k}`); return r.errores[k].texto; })];
const E54 = motor.elipse({ a: 5, c: 4 }), E4 = motor.elipse({ h: 2, k: -1, nx: 9, ny: 25 });
const P5 = motor.parabola({ eje: 'x', h: 2, k: 1, cuatroP: -8 }), H7 = motor.hiperbola({ a2: 9, b2: 16, eje: 'x' });
const ESCENA = {
  paso2: [() => op(E54.semiejeMenor, 'cHiperbola', 'resta', 'sinRaiz'), 'numero'],
  paso3: [() => op(E54.excentricidad, 'invertida', 'otroSemieje', 'dosC'), 'numero'],
  paso4: [() => op(E4.focos, 'signos', 'ejeCambiado', 'vertices'), 'par'],
  paso5: [() => op(P5.foco, 'signo', 'cuatroP', 'eje'), 'punto'],
  paso6: [() => op(P5.lr, 'conSigno', 'dosP', 'soloP'), 'numero'],
  paso7: [() => op(H7.focos, 'cElipse', 'aMayor', 'vertices'), 'puntoPm'],
  paso8: [() => op(motor.general({ A: -4, C: -9, D: 8, E: -36, F: -4 }), 'cambiaSigno', 'dosCuadrados', 'lineales'), 'nombre'],
  'clavos-juntos': [() => op(motor.jardinero({ a: 5, c: 0 }), 'segmento', 'punto', 'parabola'), 'nombre'],
  'circunferencia': [() => op(motor.circunferenciaGeneral({ D: -6, E: 8, F: -11 }), 'signos', 'radioCuadrado', 'sinSumar'), 'centroRadio'],
  'plato': [() => op(motor.plato({ ancho: 120, hondo: 20 }), 'cuatroP', 'dosP', 'hondo'), 'cm'],
  'asintotas': [() => op(motor.hiperbola({ h: -2, k: 1, a2: 4, b2: 9, eje: 'y' }).pendiente, 'invertida', 'sinRaiz', 'invertidaSinRaiz'), 'pm'],
  'cono': [() => op(motor.cono({ inclinacion: 60, generatriz: 60 }), 'cerrada', 'abierta', 'rectas'), 'nombre']
};
const NUM = '−?\\d*√?\\d+(?:/\\d+)?';
const FORMAS = {
  numero: t => new RegExp(`^${NUM}$`).test(t),
  punto: t => new RegExp(`^\\(${NUM}; ${NUM}\\)$`).test(t),
  par: t => new RegExp(`^\\(${NUM}; ${NUM}\\) y \\(${NUM}; ${NUM}\\)$`).test(t),
  puntoPm: t => new RegExp(`^\\((±${NUM}|0); (±${NUM}|0)\\)$`).test(t),
  nombre: t => /^(una|un|dos) [a-záéíóú]+$/.test(t),
  centroRadio: t => new RegExp(`^\\(${NUM}; ${NUM}\\) y r = ${NUM}$`).test(t),
  cm: t => /^\d+ cm$/.test(t),
  pm: t => new RegExp(`^±${NUM}$`).test(t)
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [id, [f, forma]] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    for (const t of ops) assert.ok(FORMAS[forma](t), `${id}: «${t}» no tiene la forma ${forma}`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos: ${ops.join(' · ')}`);
    assert.ok(html.includes(`'conicas-${id}'`) || html.includes(`id:'${id}'`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.elipse({ a: 3, c: 4 }), /0 < c < a/);
  assert.throws(() => motor.elipse({ a2: 4, b2: 9 }), /a² > b²/);
  assert.throws(() => motor.elipse({ nx: -4, ny: 9 }), /positivos/);
  assert.throws(() => motor.elipse({ nx: 2.5, ny: 9 }), /fracción/);
  assert.throws(() => motor.circunferencia({ r2: 0 }), /positivo/);
  assert.throws(() => motor.circunferenciaGeneral({ A: 0, D: 1 }), /A no puede/);
  assert.throws(() => motor.parabola({ eje: 'x' }), /falta p/);
  assert.throws(() => motor.jardinero({ a: 5, c: 6 }), /c ≤ a/);
  assert.throws(() => motor.plato({ ancho: 0, hondo: 3 }), /positivos/);
  assert.throws(() => motor.cono({ inclinacion: 30, generatriz: 5 }), /generatriz/);
  assert.throws(() => motor.puntoEn({ tipo: 'recta' }, 0), /desconocida/);
  assert.throws(() => motor.fraccion('dos'), /número/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), p.id); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
