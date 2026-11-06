// Pruebas del motor de «El traductor de enunciados». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija): leer y volver a escribir una expresión no cambia su valor;
//    el polinomio normalizado vale lo mismo que la expresión; cada solución de resolver() cumple la ecuación y no
//    hay otras en una malla; dividir entre x pierde justo el 0 (AL15); la misma operación en los dos platos
//    conserva las soluciones y en uno solo las cambia (AL16); «por cada» con grupos completos hace verdadera la
//    ecuación correcta y falsa la invertida (AL1); la diferencia de edades no cambia (RM3); los móviles están en
//    el mismo lugar en el instante del encuentro o del alcance (RM4); el sistema 2 × 2 se cumple y el error de
//    multiplicar un solo lado no cumple la segunda ecuación (AL18).
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
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
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
  assert.equal(datos.plantilla, 'traductor-enunciados');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
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
const conSigno = (k, t) => (k < 0 ? `− ${-k}${t}` : `+ ${k}${t}`);
const lin = (a, b, v) => `${a}${v} ${conSigno(b, '')}`;   // 'a·v + b' en texto
const igualListas = (a, b) => a.length === b.length && a.every((x, k) => Math.abs(x - b[k]) < 1e-9);

// Una expresión al azar en x e y, como la escribiría un alumno (con multiplicación sin signo y paréntesis)
function expresionAlAzar(prof) {
  const r = rnd();
  if (prof <= 0 || r < 0.25) return rnd() < 0.5 ? String(ent(1, 9)) : (rnd() < 0.5 ? 'x' : 'y');
  const a = expresionAlAzar(prof - 1), b = expresionAlAzar(prof - 1);
  if (r < 0.45) return `${a} + ${b}`;
  if (r < 0.6) return `${a} − (${b})`;
  if (r < 0.75) return `(${a})(${b})`;
  if (r < 0.85) return `${ent(2, 9)}(${a})`;
  if (r < 0.93) return `(${a})²`;
  return `−(${a})`;
}
test('leer y volver a escribir una expresión no cambia su valor; el polinomio normalizado vale lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const e = expresionAlAzar(3), val = { x: ent(-6, 6), y: ent(-6, 6) };
    const v = motor.evaluar(e, val).valor;
    const t = motor.texto(e);
    cerca(motor.evaluar(t, val).valor, v, `reescrita: ${e} → ${t}`);
    const p = motor.polinomio(e);
    cerca(motor.evaluar(p.texto, val).valor, v, `polinomio: ${e} → ${p.texto}`);
    // la sustitución escrita, leída otra vez, da lo mismo
    cerca(motor.evaluar(motor.evaluar(e, val).sustituida, {}).valor, v, `sustituida: ${e}`);
  }
});
test('ecuaciones lineales: la solución cumple la ecuación; identidades y contradicciones', () => {
  for (let k = 0; k < N; k++) {
    const a1 = ent(-9, 9), b1 = ent(-20, 20), a2 = ent(-9, 9), b2 = ent(-20, 20);
    const ec = `${lin(a1, b1, 'x')} = ${lin(a2, b2, 'x')}`, r = motor.resolver(ec);
    if (a1 === a2) { assert.equal(r.tipo, b1 === b2 ? 'identidad' : 'ninguna', ec); continue; }
    assert.equal(r.tipo, 'unica');
    cerca(r.soluciones[0], (b2 - b1) / (a1 - a2), ec);
    assert.ok(r.comprobaciones[0].verdadera, ec);
    // AL16: pasar sin cambiar el signo da (b1 + b2)/(a1 + a2), que en general no cumple la ecuación
    if (r.errores && r.errores.pasarSignoMal && r.errores.pasarSignoMal[0] !== undefined) {
      const m = r.errores.pasarSignoMal[0];
      cerca(m, (b1 + b2) / (a1 + a2), 'signo mal');
      if (Math.abs(m - r.soluciones[0]) > 1e-9) assert.equal(motor.comprobar(ec, { x: m }).verdadera, false, ec);
    }
  }
});
test('ecuaciones cuadráticas con raíces enteras: dos soluciones que cumplen y ninguna otra en la malla', () => {
  for (let k = 0; k < N; k++) {
    const p = ent(-9, 9), q = ent(-9, 9), a = ent(1, 3) * (rnd() < 0.5 ? -1 : 1), c = ent(-12, 12);
    // a(x − p)(x − q) + c = c, escrita con un lado distinto de cero
    const ec = `${a}(x ${conSigno(-p, '')})(x ${conSigno(-q, '')}) ${conSigno(c, '')} = ${c}`;
    const r = motor.resolver(ec), esp = p === q ? [p] : [Math.min(p, q), Math.max(p, q)];
    assert.ok(igualListas(r.soluciones, esp), `${ec}: ${r.soluciones} contra ${esp}`);
    for (const x of r.soluciones) assert.ok(motor.comprobar(ec, { x }).verdadera);
    for (let x = -12; x <= 12; x++) if (!esp.includes(x)) assert.equal(motor.comprobar(ec, { x }).verdadera, false, `${ec} con x = ${x}`);
    // AL15: si 0 es raíz y la otra no, dividir entre x deja solo la otra
    if ((p === 0) !== (q === 0)) cerca(r.errores.dividirEntreX, [p === 0 ? q : p], 'dividir entre x');
  }
});
test('el discriminante decide: Δ < 0 sin soluciones reales; Δ no cuadrado da dos soluciones irracionales que cumplen', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 4), b = ent(-9, 9), c = ent(-9, 9), D = b * b - 4 * a * c;
    const r = motor.resolver(`${a}x² ${conSigno(b, 'x')} ${conSigno(c, '')} = 0`);
    cerca(r.discriminante, D, 'Δ');
    if (D < 0) { assert.equal(r.tipo, 'sin-reales'); continue; }
    assert.equal(r.soluciones.length, D === 0 ? 1 : 2);
    for (const x of r.soluciones) assert.ok(Math.abs(a * x * x + b * x + c) < 1e-7, `raíz ${x}`);
  }
});
test('la balanza: la misma operación en los dos platos conserva las soluciones; en un plato solo, no (AL16)', () => {
  for (let k = 0; k < N; k++) {
    const r1 = ent(-8, 8), r2 = ent(-8, 8);
    if (r1 === r2) continue;
    const c = ent(1, 9) * (rnd() < 0.5 ? -1 : 1), e = ent(1, 9), m = ent(2, 5);
    const ec = `(x ${conSigno(-r1, '')})(x ${conSigno(-r2, '')}) ${conSigno(c, '')} = ${c}`;
    const ops = [{ op: 'sumar', expr: `${e}x` }, { op: 'restar', expr: String(e) }, { op: 'multiplicar', expr: String(m) }, { op: 'dividir', expr: String(m) }];
    for (const o of ops) {
      const b = motor.balanza(ec, [o]).final;
      assert.equal(b.conserva, true, `${ec}, ${o.op} ${o.expr}`);
      const malo = motor.balanza(ec, [Object.assign({ lado: 'izquierdo' }, o)]).final;
      assert.equal(malo.conserva, false, `${ec}, ${o.op} ${o.expr} solo a la izquierda`);
    }
    // multiplicar por x agrega el 0 si no estaba
    const px = motor.balanza(`(x ${conSigno(-r1, '')})(x ${conSigno(-r2, '')}) = 0`, [{ op: 'multiplicar', expr: 'x' }]).final;
    if (r1 !== 0 && r2 !== 0) cerca(px.ganadas, [0], 'multiplicar por x');
  }
});
test('dividir entre x pierde justo el 0 cuando 0 es solución (AL15)', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 5), r = ent(-9, 9);
    if (r === 0) continue;
    // a·x² = a·r·x
    const b = motor.balanza(`${a}x² = ${a * r}x`, [{ op: 'dividir', expr: 'x' }]).final;
    cerca(b.soluciones, [r], 'queda'); cerca(b.perdidas, [0], 'pierde'); cerca(b.ceroEn, [0], 'cero en');
    assert.ok(motor.pesos(`${a}x² = ${a * r}x`, { x: 0 }).equilibrio, 'con x = 0 los dos platos están vacíos');
    assert.equal(motor.pesos(b.texto, { x: 0 }).equilibrio, false, 'la balanza dividida ya no se equilibra en 0');
  }
});
test('«por cada» (AL1): con grupos completos la correcta es verdadera y la invertida falsa (salvo n = m)', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(1, 9), m = ent(1, 5), g = ent(1, 12), r = motor.porCada({ n, m, letraN: 'S', letraM: 'P', valorM: m * g });
    cerca(r.S, n * g, 'S'); assert.ok(r.comprobacion.verdadera, r.ecuacion);
    assert.equal(r.errores.invertida.comprobacion.verdadera, n === m, r.errores.invertida.ecuacion);
    // rompiendo el aula (un estudiante de más), la correcta deja de ser verdadera
    assert.equal(motor.comprobar(r.ecuacion, { S: n * g + 1, P: m * g }).verdadera, false);
    // la frase escrita da lo mismo
    const t = motor.traducir(`hay ${n} estudiantes por cada ${m} profesores`, { estudiantes: 'S', profesores: 'P' });
    assert.equal(t.ecuacion, r.ecuacion);
  }
});
test('frases con un número: la traducción, con x despejada, devuelve el número pensado', () => {
  const VECES = ['doble', 'triple', 'cuádruple', 'quíntuple'];
  for (let k = 0; k < N; k++) {
    const j = ent(0, 3), kk = j + 2, c = ent(1, 9), x = ent(-9, 12), menos = rnd() < 0.5, coma = rnd() < 0.5;
    const r = coma ? kk * (menos ? x - c : x + c) : kk * x + (menos ? -c : c);
    const fr = `el ${VECES[j]}${coma ? ',' : ''} de un número${coma ? '' : ','} ${menos ? 'disminuido' : 'aumentado'} en ${c} es ${r}`;
    const t = motor.traducir(fr);
    cerca(motor.resolver(t.ecuacion).soluciones, [x], fr);
    assert.equal(motor.comprobar(t.errores.agrupado, { x }).verdadera, false, `${fr}: el agrupado no debe dar el número`);
    // la máquina de la frase da lo mismo que la expresión
    cerca(motor.cadena(x, t.cadenas.expresion).resultado, r, `${fr}: cadena`);
    cerca(motor.cadena(x, t.cadenas.agrupado).resultado, motor.evaluar(t.errores.agrupado.split(' = ')[0], { x }).valor, `${fr}: cadena agrupada`);
    if (menos) cerca(motor.cadena(x, t.cadenas.alReves).resultado, motor.evaluar(t.errores.alReves.split(' = ')[0], { x }).valor, `${fr}: cadena al revés`);
  }
});
test('edades (RM3): la diferencia no cambia con el tiempo; la razón sí; los errores no cumplen la frase', () => {
  for (let k = 0; k < N; k++) {
    const kk = ent(2, 4), b0 = ent(2, 20), n = ent(1, 10), signo = rnd() < 0.5 ? -1 : 1;
    // edades en el momento de la frase: B = b0, A = k·b0; hoy: restando el tiempo
    const t = signo * n, B = b0 - t, A = kk * b0 - t;
    if (B <= 0 || A <= 0) continue;
    const r = motor.edades({ conocida: 'M', valor: A, incognita: 'B', tiempo: t, k: kk });
    cerca(r.B, B, 'B'); cerca(r.entonces.M, kk * r.entonces.B, 'k veces');
    const ln = motor.lineaEdades({ M: A, B }, [-n, 0, n, 2 * n]);
    ln.forEach(f => cerca(f.diferencia, A - B, 'diferencia'));
    assert.ok(Math.abs(ln[0].razon - ln[3].razon) > 1e-9, 'la razón cambia');
    for (const e of ['sinTiempo', 'soloConocida', 'soloIncognita']) if (Math.abs(r.errores[e] - B) > 1e-9)
      assert.ok(Math.abs((A + t) - kk * (r.errores[e] + t)) > 1e-9, `${e} no cumple`);
    const s = motor.sumaEdades({ suma: A + B, personas: 2, tiempo: n });
    cerca(s.valor, (A + n) + (B + n), 'suma');
  }
});
test('móviles (RM4): en el instante calculado los dos están en el mismo lugar; el error no lo cumple', () => {
  for (let k = 0; k < N; k++) {
    const d = ent(10, 500), v1 = ent(5, 120), v2 = ent(5, 120);
    const en = motor.moviles({ distancia: d, v1, v2, sentido: 'opuesto' });
    const p = motor.posiciones({ distancia: d, v1, v2, sentido: 'opuesto' }, en.tiempo);
    cerca(p.x1, p.x2, 'encuentro'); cerca(en.recorrido1 + en.recorrido2, d, 'entre los dos, toda la distancia');
    if (v1 !== v2) { const q = motor.posiciones({ distancia: d, v1, v2, sentido: 'opuesto' }, en.errores.restaRapideces); assert.ok(q.separacion > 1e-6); }
    const al = motor.moviles({ distancia: d, v1, v2, sentido: 'mismo' });
    assert.equal(al.alcanza, v1 > v2);
    if (al.alcanza) {
      const q = motor.posiciones({ distancia: d, v1, v2, sentido: 'mismo' }, al.tiempo); cerca(q.x1, q.x2, 'alcance');
      cerca(motor.posiciones({ distancia: d, v1, v2, sentido: 'mismo' }, al.errores.sumaRapideces).separacion > 1e-6, true, 'el error no alcanza');
      // como sistema: p = v1·t y p = d + v2·t (p es la posición)
      const s = motor.sistema(al.sistema[0], al.sistema[1], ['t', 'p']);
      cerca(s.valores.t, al.tiempo, 'sistema');
    }
  }
});
test('sistemas 2 × 2: la solución cumple las dos; el error de multiplicar un lado no cumple la segunda (AL18)', () => {
  for (let k = 0; k < N; k++) {
    const x = ent(-9, 9), y = ent(-9, 9), a1 = ent(-6, 6), b1 = ent(-6, 6), a2 = ent(-6, 6), b2 = ent(-6, 6);
    if (a1 * b2 - a2 * b1 === 0 || !a1 || !b1 || !a2 || !b2) continue;
    const e1 = `${a1}x ${conSigno(b1, 'y')} = ${a1 * x + b1 * y}`, e2 = `${a2}x ${conSigno(b2, 'y')} = ${a2 * x + b2 * y}`;
    const r = motor.sistema(e1, e2);
    assert.equal(r.tipo, 'unica'); cerca(r.valores.x, x, e1); cerca(r.valores.y, y, e2);
    assert.ok(r.comprobaciones.every(c => c.verdadera));
    if (r.errores) { const m = r.errores.multiplicaUnLado; if (Math.abs(m.x - x) > 1e-9 || Math.abs(m.y - y) > 1e-9) assert.ok(!(m.cumplePrimera && m.cumpleSegunda)); }
    // multiplicada por un número, la segunda da infinitas; con otro lado derecho, ninguna
    const kk = ent(2, 4);
    assert.equal(motor.sistema(e1, `${kk * a1}x ${conSigno(kk * b1, 'y')} = ${kk * (a1 * x + b1 * y)}`).tipo, 'infinitas');
    assert.equal(motor.sistema(e1, `${kk * a1}x ${conSigno(kk * b1, 'y')} = ${kk * (a1 * x + b1 * y) + 1}`).tipo, 'ninguna');
  }
});
test('comparar (AL5): 2n y n + 2 son iguales en n = 2; ninguna es siempre mayor', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(2, 9), c = ent(1, 20), r = motor.comparar(`${a}n`, `n + ${c}`);
    cerca(r.igualesEn, c / (a - 1), 'igualdad');
    const n0 = r.igualesEn;
    assert.ok(motor.evaluar(`${a}n`, { n: n0 + 1 }).valor > motor.evaluar(`n + ${c}`, { n: n0 + 1 }).valor);
    assert.ok(motor.evaluar(`${a}n`, { n: n0 - 1 }).valor < motor.evaluar(`n + ${c}`, { n: n0 - 1 }).valor);
  }
});
test('escritura bonita: menos tipográfico, exponentes y multiplicación sin signo', () => {
  assert.equal(motor.texto('2*(x-3)'), '2(x − 3)');
  assert.equal(motor.texto('x^2-5*x'), 'x² − 5x');
  assert.equal(motor.texto('6*S=P'), '6S = P');
  assert.equal(motor.texto('x+-3'), 'x − 3');
  assert.equal(motor.polinomio('(x − 3)(x − 5)').texto, 'x² − 8x + 15');
  assert.equal(motor.polinomio('2(x + 3) − 2x').texto, '6');
  assert.equal(motor.evaluar('x²', { x: -3 }).sustituida, '(−3)²');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.analizar(''), /falta la expresión/);
  assert.throws(() => motor.analizar('2 + '), /termina antes/);
  assert.throws(() => motor.analizar('(x + 1'), /paréntesis/);
  assert.throws(() => motor.analizar('x = 2 = 3'), /más de un signo/);
  assert.throws(() => motor.analizar('x $ 2'), /símbolo/);
  assert.throws(() => motor.analizar('2 3'), /signo entre dos números/);
  assert.throws(() => motor.analizar('x^y'), /exponente/);
  assert.throws(() => motor.evaluar('x + y', { x: 1 }), /falta el valor de y/);
  assert.throws(() => motor.evaluar('1/(x − 1)', { x: 1 }), /división entre cero/);
  assert.equal(motor.comprobar('1/x = 2', { x: 0 }).definida, false);
  assert.throws(() => motor.comprobar('2x + 1', { x: 1 }), /no es una ecuación/);
  assert.throws(() => motor.resolver('x³ = x + 1'), /grado 1 y 2/);
  cerca(motor.resolver('x³ = 4x').soluciones, [-2, 0, 2], 'x³ = 4x'); cerca(motor.resolver('x³ = 4x').errores.dividirYSoloPositiva, [2], 'AL15 del informe');
  assert.throws(() => motor.resolver('x + y = 2'), /varias letras/);
  assert.throws(() => motor.resolver('1/x = 2'), /no es un polinomio/);
  assert.throws(() => motor.balanza('x = 2', [{ op: 'dividir', expr: '0' }]), /dividir entre 0/);
  assert.throws(() => motor.balanza('x² + 1 = 2', [{ op: 'dividir', expr: 'x' }]), /no se divide exactamente/);
  assert.throws(() => motor.balanza('x = 2', [{ op: 'elevar', expr: '2' }]), /op debe ser/);
  assert.throws(() => motor.porCada({ n: 3, m: 2, valorM: 5 }), /múltiplo/);
  assert.throws(() => motor.porCada({ n: 3, letraN: 'S', letraM: 'S' }), /distintas/);
  assert.throws(() => motor.traducir('esto no es una frase de examen'), /no reconozco/);
  assert.throws(() => motor.sistema('x + y = 2', 'x² + y = 3'), /lineal/);
  assert.throws(() => motor.sistema('x + y = 2', 'x + z = 3'), /dos letras/);
  assert.throws(() => motor.edades({ conocida: 'M', valor: 5, incognita: 'B', tiempo: -10, k: 2 }), /negativa/);
  assert.throws(() => motor.moviles({ distancia: 100, v1: 50, v2: 40, sentido: 'diagonal' }), /sentido/);
  assert.throws(() => motor.mezcla({ cantidad: 10, precio1: 12, precio2: 17, precioMezcla: 20 }), /entre los dos precios/);
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
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
    // regla 4 en el papel: las letras de la escena (S, P, A, M, B, d, t) no se usan con otro significado
    const todo = p.enunciado + p.respuesta + p.pasos.join(' ');
    assert.ok(!/\b[SPMB]\b(?!\/)/.test(todo) && !/\dA\b|\bA\s*[=+−·]|[=+−·]\s*A\b/.test(todo), `${p.id}: usa una letra de la escena con otro significado`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
