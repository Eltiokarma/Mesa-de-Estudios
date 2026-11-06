// Pruebas del motor de «La circunferencia que se desenrolla». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con ángulos y lados al azar (semilla fija): las razones no dependen del tamaño (TR7, TR8);
//    sen² + cos² = 1; el motor coincide con Math.sin y Math.cos; signos por cuadrante; coterminales, negativos
//    y las dos formas de reducir dan el mismo valor; los exactos de los notables coinciden con su decimal en los
//    cuatro cuadrantes; sen(a + b) por la fórmula; periodo, máximos y ceros de A·sen(Bx + C) + D; cada solución
//    de una ecuación la cumple, no falta ninguna y la general las genera todas.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const PI = Math.PI, GR = PI / 180;

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === '=' ? r : k.split('.').reduce((o, p) => (o == null ? undefined : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'circunferencia-trig');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const al = (a, b) => a + (b - a) * rnd();
const ent = (a, b) => Math.floor(al(a, b + 1));
const N = 400;

test('TR7 y TR8: con los lados por k, el seno, el coseno y la tangente no cambian; los lados sí', () => {
  for (let j = 0; j < N; j++) {
    const op = al(0.5, 20), ady = al(0.5, 20), k = al(0.1, 10), e = motor.escalar({ opuesto: op, adyacente: ady }, k);
    cerca(e.despues.sen, e.antes.sen, 'sen'); cerca(e.despues.cos, e.antes.cos, 'cos'); cerca(e.despues.tan, e.antes.tan, 'tan');
    cerca(e.despues.angulo, e.antes.angulo, 'ángulo'); cerca(e.despues.hipotenusa, e.antes.hipotenusa * k, 'hipotenusa por k');
    const r = e.antes;
    cerca(r.sen ** 2 + r.cos ** 2, 1, 'sen² + cos²'); cerca(r.tan, r.sen / r.cos, 'tan = sen/cos');
    cerca(r.sen * r.csc, 1, 'recíprocas'); cerca(r.cos * r.sec, 1, 'recíprocas'); cerca(r.tan * r.cot, 1, 'recíprocas');
    cerca(r.sen, Math.sin(r.angulo * GR), 'sen del ángulo'); cerca(r.sen, motor.razones({ opuesto: op, hipotenusa: r.hipotenusa }).sen, 'con otros dos lados');
    cerca(Math.cos(r.complemento * GR), r.sen, 'complementarios: sen θ = cos(90° − θ)');
  }
});
test('notables: exactos racionalizados que coinciden con sus lados; 30°, 45° y 60° exactos de verdad', () => {
  for (const a of motor.NOTABLES) {
    const n = motor.notable(a), L = n.lados;
    cerca(L.opuesto.valor ** 2 + L.adyacente.valor ** 2, L.hipotenusa.valor ** 2, `Pitágoras ${a}°`);
    cerca(n.sen, L.opuesto.valor / L.hipotenusa.valor, `sen ${a}°`); cerca(n.tan, L.opuesto.valor / L.adyacente.valor, `tan ${a}°`);
    for (const fn of motor.FNS) { const e = n.exactos[fn]; cerca(e.valor, e.n * Math.sqrt(e.r) / e.d, `${fn} ${a}°`); assert.ok(!/\/√/.test(e.texto), 'sin raíz abajo'); }
    if (!n.aproximado) cerca(n.sen, Math.sin(a * GR), `sen ${a}° exacto`);
    else assert.ok(Math.abs(n.anguloReal - a) < 0.5, `${a}° es aproximado pero cercano`);
    cerca(motor.notable(90 - a).sen, n.cos, `complementario de ${a}°`);
  }
});
test('circunferencia: el punto es (cos θ, sen θ), está a distancia 1 y los signos van por cuadrante', () => {
  for (let j = 0; j < N; j++) {
    const g = al(-1080, 1080), p = motor.punto(g);
    cerca(p.x, Math.cos(g * GR), 'cos'); cerca(p.y, Math.sin(g * GR), 'sen'); cerca(p.identidad, 1, 'radio 1');
    cerca(motor.punto(g * GR, 'rad').y, p.y, 'en radianes');
    const c = p.cuadrante, sx = Math.sign(p.x), sy = Math.sign(p.y);
    assert.equal(c, sx > 0 && sy > 0 ? 1 : sx < 0 && sy > 0 ? 2 : sx < 0 && sy < 0 ? 3 : 4, `cuadrante de ${g}`);
    assert.equal(p.signos.sen, sy); assert.equal(p.signos.cos, sx); assert.equal(p.signos.tan, sx * sy);
    cerca(p.lineas.tangente.hasta.y, p.y / p.x, 'la recta OP corta x = 1 en tan θ', 1e-7);
    cerca(p.lineas.seno.hasta.y - p.lineas.seno.desde.y, p.sen, 'línea seno con signo'); cerca(p.lineas.coseno.hasta.x, p.cos, 'línea coseno con signo');
    // coterminales y negativos
    const k = ent(-3, 3); cerca(motor.valor('sen', g + 360 * k), motor.valor('sen', g), 'coterminal'); cerca(motor.valor('cos', -g), p.cos, 'cos(−x) = cos x');
    cerca(motor.valor('sen', -g), -p.sen, 'sen(−x) = −sen x');
    const ct = motor.coterminal(g); cerca(ct.reducido + 360 * ct.vueltas, g, 'g = 360k + reducido', 1e-7); assert.ok(ct.reducido >= 0 && ct.reducido < 360);
  }
  for (const [g, s, c] of [[0, 0, 1], [90, 1, 0], [180, 0, -1], [270, -1, 0], [360, 0, 1], [-90, -1, 0], [450, 1, 0]]) {
    assert.equal(motor.valor('sen', g), s, `sen ${g}`); assert.equal(motor.valor('cos', g), c, `cos ${g}`); assert.equal(motor.cuadrante(g), null);
  }
  assert.equal(motor.punto(90).tan, null); assert.equal(motor.punto(-270).tan, null); assert.equal(motor.valor('cot', 0), null);
});
test('reducción: las dos formas (180°/360° y 90°/270° con co-razón) y el exacto dan el mismo valor que Math', () => {
  const val = (fn, a) => ({ sen: Math.sin, cos: Math.cos, tan: Math.tan }[fn](a * GR));
  for (let j = 0; j < N; j++) {
    const fn = ['sen', 'cos', 'tan'][ent(0, 2)], g = ent(-720, 720);
    if (motor.cuadrante(g) === null) continue;
    const r = motor.reducir(fn, g);
    cerca(r.valor, val(fn, g), `${fn} ${g}`, 1e-8);
    if (r.forma180) cerca(r.forma180.signo * val(r.forma180.fn, r.forma180.angulo), r.valor, `forma 180 de ${fn} ${g}`, 1e-8);
    const co = { sen: 'cos', cos: 'sen', tan: 'cot' }[fn], f = r.forma90.fn;
    assert.equal(f, co);
    const v90 = f === 'cot' ? 1 / Math.tan(r.forma90.angulo * GR) : val(f, r.forma90.angulo);
    cerca(r.forma90.signo * v90, r.valor, `forma 90 de ${fn} ${g}`, 1e-8);
    if (r.errores.sinSigno !== undefined) cerca(r.errores.sinSigno, Math.abs(r.valor), 'sin signo');
    else assert.ok(r.valor > 0, 'sin signo solo se quita si coincide con la respuesta');
    for (const [k, v] of Object.entries(r.errores)) assert.ok(Math.abs(v - r.valor) > 1e-9, `${fn} ${g}: el error ${k} no puede ser la respuesta`);
    assert.ok(r.referencia > 0 && r.referencia < 90);
  }
  for (const a of [0, 30, 45, 60, 90, 37, 53, 16, 74]) for (const q of [0, 90, 180, 270]) for (const s of [1, -1]) {
    const g = q + s * a, gg = g + 360 * ent(-2, 2);
    for (const fn of ['sen', 'cos', 'tan']) {
      const e = motor.exacto(fn, gg), v = motor.valor(fn, gg);
      assert.ok(e, `exacto ${fn} ${gg}`);
      if (v === null) assert.equal(e.definido, false); else cerca(e.valor, v, `exacto ${fn} ${gg}`, [37, 53, 16, 74].includes(a) ? 0.02 : 1e-9);
    }
  }
  assert.equal(motor.exacto('sen', 20), null, '20° no es notable');
});
test('identidades: sen(a + b) por la fórmula; sen² + cos² = 1; la linealidad casi nunca vale', () => {
  for (let j = 0; j < N; j++) {
    const a = al(-360, 360), b = al(-360, 360), s = motor.suma(a, b), c = motor.suma(a, b, 'cos');
    cerca(s.formula, Math.sin((a + b) * GR), 'sen(a + b)', 1e-8); cerca(s.deLaSuma, s.formula, 'fórmula', 1e-8);
    cerca(c.formula, Math.cos((a + b) * GR), 'cos(a + b)', 1e-8);
    cerca(motor.doble(a).formula, Math.sin(2 * a * GR), 'sen 2a', 1e-8);
    cerca(motor.pitagorica(a).suma, 1, 'pitagórica');
  }
  assert.equal(motor.suma(0, 30).iguales, true, 'con 0° sí coincide');
  assert.equal(motor.suma(30, 60).iguales, false);
});
test('y = A·sen(Bx + C) + D: se repite cada periodo, queda en su rango; máximos, mínimos y ceros son lo que dicen', () => {
  for (let j = 0; j < 200; j++) {
    const fn = ['sen', 'cos'][ent(0, 1)], A = (rnd() < .5 ? -1 : 1) * al(0.3, 4), B = (rnd() < .3 ? -1 : 1) * al(0.3, 4), C = al(-3, 3), D = al(-2, 2);
    const f = motor.senoidal({ fn, A, B, C, D });
    cerca(f.periodo, 2 * PI / Math.abs(B), 'periodo'); cerca(f.amplitud, Math.abs(A), 'amplitud');
    for (let q = 0; q < 10; q++) {
      const x = al(-10, 10), y = motor.evaluar(f, x);
      cerca(motor.evaluar(f, x + f.periodo), y, 'periódica', 1e-7);
      cerca(y, A * (fn === 'sen' ? Math.sin : Math.cos)(B * x + C) + D, 'valor', 1e-8);
      assert.ok(y <= f.maximo + 1e-9 && y >= f.minimo - 1e-9, 'en el rango');
    }
    const ex = motor.extremos(f, 0, 4 * PI);
    for (const x of ex.maximos) cerca(motor.evaluar(f, x), f.maximo, 'máximo', 1e-8);
    for (const x of ex.minimos) cerca(motor.evaluar(f, x), f.minimo, 'mínimo', 1e-8);
    // en [0, 4π] hay tantos máximos como periodos caben (± 1)
    assert.ok(Math.abs(ex.maximos.length - 4 * PI / f.periodo) <= 1, 'cantidad de máximos');
    const z = motor.ceros(f, 0, 4 * PI);
    for (const x of z) cerca(motor.evaluar(f, x), 0, 'cero', 1e-7);
    // no falta ningún cero: entre dos ceros consecutivos (y en los bordes) la función no cambia de signo
    const bordes = [0, ...z, 4 * PI];
    for (let q = 1; q < bordes.length; q++) {
      const a = bordes[q - 1], b = bordes[q]; if (b - a < 1e-6) continue;
      const s0 = Math.sign(motor.evaluar(f, a + (b - a) * 0.01)), s1 = Math.sign(motor.evaluar(f, b - (b - a) * 0.01)), sm = Math.sign(motor.evaluar(f, (a + b) / 2));
      assert.ok(s0 === sm && sm === s1 || Math.abs(D) === Math.abs(A), 'no falta ningún cero');
    }
  }
  const t = motor.senoidal({ fn: 'tan', B: 2 });
  cerca(motor.asintotas(t, 0, PI), [PI / 4, 3 * PI / 4], 'asíntotas de tan 2x');
  assert.ok(motor.muestrear(t, 0, PI, 400).some(p => p.y === null), 'la tangente se corta');
  cerca(motor.senoidal({ fn: 'sen', B: 2, unidad: 'sex' }).periodo, 180, 'en grados');
});
test('ecuaciones: cada solución cumple, no falta ninguna (malla fina) y la general las genera', () => {
  for (let j = 0; j < 300; j++) {
    const fn = ['sen', 'cos', 'tan'][ent(0, 2)], k = fn === 'tan' ? al(-5, 5) : al(-1.2, 1.2);
    const e = motor.ecuacion({ fn, k });
    for (const x of e.soluciones) { cerca(motor.valor(fn, x), k, `${fn} ${x} = ${k}`, 1e-8); assert.ok(x >= 0 && x < 360); }
    // malla: cada cruce de fn x − k se encuentra cerca de una solución
    let cuenta = 0;
    for (let q = 0; q < 3600; q++) {
      const a = q / 10, b = (q + 1) / 10, va = motor.valor(fn, a) - k, vb = motor.valor(fn, b) - k;
      if (fn === 'tan' && (Math.abs(a - 90) < 0.11 || Math.abs(a - 270) < 0.11)) continue;
      if (va === 0 || va * vb < 0) cuenta++;
    }
    if (Math.abs(Math.abs(k) - 1) > 1e-3 || fn === 'tan') assert.equal(e.cantidad, cuenta, `${fn} x = ${k}: ${e.soluciones}`);
    if (e.general) {
      const p = e.principal, gen = [];
      for (let n = -2; n <= 3; n++) {
        if (fn === 'sen') gen.push(180 * n + (n % 2 ? -1 : 1) * p);
        else if (fn === 'cos') gen.push(360 * n + p, 360 * n - p);
        else gen.push(180 * n + p);
      }
      const dentro = [...new Set(gen.map(x => Math.round(x * 1e6) / 1e6))].filter(x => x >= -1e-9 && x < 360 - 1e-9).sort((a, b) => a - b);
      cerca(dentro, e.soluciones, 'general', 1e-6);
    } else assert.equal(e.cantidad, 0);
  }
  cerca(motor.ecuacion({ fn: 'sen', k: 0.5, desde: 0, hasta: 720 }).soluciones, [30, 150, 390, 510], 'dos vueltas');
  cerca(motor.ecuacion({ fn: 'sen', k: 0.5, desde: -180, hasta: 180 }).soluciones, [30, 150], 'intervalo con negativos');
  cerca(motor.ecuacion({ fn: 'cos', k: 0.5, desde: -180, hasta: 180 }).soluciones, [-60, 60], 'cos con negativos');
  cerca(motor.ecuacion({ fn: 'sen', k: 0.5, unidad: 'rad' }).soluciones, [PI / 6, 5 * PI / 6], 'en radianes');
});

test('ningún error típico da lo mismo que la respuesta correcta (no sirve de distractor)', () => {
  assert.equal(motor.reducir('cos', -60).errores.negativoSinSigno, undefined, 'cos(−60°) = cos 60°: no es un error');
  assert.equal(motor.reducir('sen', 150).errores.sinSigno, undefined);
  assert.equal(motor.senoidal({ A:3, B:2 }).errores.amplitudConSigno, undefined);
  assert.equal(motor.ecuacion({ fn:'sen', k:1 }).errores.soloPrincipal, undefined);
  assert.equal(motor.suma(0, 30).errores.lineal, undefined);
  for (let j = 0; j < N; j++) {
    const op = al(0.5, 9), ady = al(0.5, 9), r = motor.razones({ opuesto:op, adyacente:ady });
    for (const [k, v] of Object.entries(r.errores)) assert.ok(Math.abs(v - (k === 'tanInvertida' ? r.tan : r.sen)) > 1e-9, k);
    const f = motor.senoidal({ A:al(-3, 3) || 1, B:ent(1, 4), C:ent(-2, 2), D:ent(-1, 1) });
    for (const [k, v] of Object.entries(f.errores)) assert.ok(Math.abs(v - (k.startsWith('periodo') ? f.periodo : k.startsWith('amplitud') ? f.amplitud : f.desfase)) > 1e-9, k);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.razones({ opuesto: 3 }), /dos lados/);
  assert.throws(() => motor.razones({ opuesto: 3, adyacente: 4, hipotenusa: 5 }), /dos lados/);
  assert.throws(() => motor.razones({ opuesto: 5, hipotenusa: 4 }), /mayor que cada cateto/);
  assert.throws(() => motor.razones({ opuesto: -3, adyacente: 4 }), /mayor que cero/);
  assert.throws(() => motor.escalar({ opuesto: 3, adyacente: 4 }, 0), /mayor que cero/);
  assert.throws(() => motor.notable(20), /notable/);
  assert.throws(() => motor.resolverRectangulo({ angulo: 90, lado: 3, cual: 'opuesto' }), /agudo/);
  assert.throws(() => motor.resolverRectangulo({ angulo: 30, lado: 3, cual: 'otro' }), /cual/);
  assert.throws(() => motor.valor('seno', 30), /función desconocida/);
  assert.throws(() => motor.punto('30'), /número/);
  assert.throws(() => motor.punto(30, 'grados'), /unidad/);
  assert.throws(() => motor.senoidal({ A: 0 }), /A no puede/);
  assert.throws(() => motor.senoidal({ B: 0 }), /B no puede/);
  assert.throws(() => motor.senoidal({ fn: 'sec' }), /fn/);
  assert.throws(() => motor.extremos({ fn: 'tan' }, 0, 1), /máximos/);
  assert.throws(() => motor.ecuacion({ fn: 'sen' }), /número/);
  assert.throws(() => motor.ecuacion({ fn: 'sen', k: 0, desde: 10, hasta: 10 }), /vacío/);
  assert.throws(() => motor.ecuacionFactorizada([{ fn: 'sen', k: 0 }]), /dos factores/);
  assert.throws(() => motor.suma(30, 60, 'tan'), /fn/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
