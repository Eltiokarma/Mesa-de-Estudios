// Pruebas del motor de Líquidos y sólidos. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: la presión de vapor sube con T y la ebullición la invierte; el agua da lo mismo que el motor de
//    calorimetría (Antoine e ISA); los dos tramos del agua casi coinciden; las ebulliciones normales de Antoine coinciden
//    con la tabla; la caja de partículas llega a la misma densidad sin importar su alto ni su ancho (GQ18), y la presión
//    que marca es la de vapor; las curvas del diagrama se juntan en el punto triple y fase() cambia al cruzarlas; los
//    puentes de hidrógeno siguen la regla de EN15; los dibujos no se enciman; ningún error típico da la respuesta.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function igual(x, v, que, tol) {
  if (typeof v === 'number') {
    assert.equal(typeof x, 'number', que);
    const t = tol === undefined ? TOL * Math.max(1, Math.abs(v)) : tol;
    assert.ok(Math.abs(x - v) <= t, `${que}: el motor da ${x}, se esperaba ${v}`);
  } else if (Array.isArray(v)) {
    assert.ok(Array.isArray(x) && x.length === v.length, `${que}: largo`);
    v.forEach((e, i) => igual(x[i], e, `${que}[${i}]`, tol));
  } else if (v && typeof v === 'object') {
    for (const [k, w] of Object.entries(v)) igual(x[k], w, `${que}.${k}`, tol);
  } else assert.deepEqual(x, v, que);
}
function comprobar(fn, args, espera, que, tols) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    igual(x, v, `${que} · ${k}`, tols && tols[k]);
  }
}

// 1. casos.json
test('casos.json: al menos 20 casos con nombre y el campo de verificación', () => {
  assert.ok(datos.casos.length >= 20);
  assert.equal(typeof datos.verificacion, 'string');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera && Array.isArray(c.args), c.nombre);
});
for (const c of datos.casos) test(c.nombre, () => comprobar(c.fn, c.args, c.espera, c.nombre));

// 2. Propiedades
const LIQ = Object.keys(motor.LIQUIDOS);
test('presión de vapor: sube con la temperatura y la ebullición es su inversa', () => {
  for (const l of LIQ) {
    let ant = 0;
    for (let T = -10; T <= 130; T += 2.5) {
      const p = motor.presionVapor(l, T).mmHg;
      assert.ok(p > ant, `${l} a ${T} °C`); ant = p;
      if (l === 'agua' && T > 99.9 && T < 100.1) continue;
      assert.ok(Math.abs(motor.ebullicion(l, p).T - T) < 1e-9, `${l}: ebullición(${p})`);
    }
    let Tant = -Infinity;
    for (let P = 20; P <= 2000; P += 10) { const T = motor.ebullicion(l, P).T; assert.ok(T >= Tant, `${l}: monótona`); Tant = T; }
  }
});
test('agua: los dos tramos de Antoine difieren menos de 0,6 % a 100 °C y el salto no cambia la ebullición en más de 0,2 °C', () => {
  const [a, b] = motor.LIQUIDOS.agua.antoine;
  const p = (k, T) => Math.pow(10, k.A - k.B / (k.C + T));
  assert.ok(Math.abs(p(b, 100) / p(a, 100) - 1) < 0.006);
  for (const T of [100, 105, 110, 120, 130]) assert.ok(Math.abs(motor.presionVapor('agua', T).mmHg - p(b, T)) < 1e-9 * p(b, T) || T === 100);
  assert.ok(Math.abs(motor.ebullicion('agua', 762).T - 100) < 0.2);
});
test('las ebulliciones normales de Antoine coinciden con la tabla (menos de 0,3 °C)', () => {
  for (const l of LIQ) {
    const s = motor.SUSTANCIAS[motor.LIQUIDOS[l].sustancia];
    assert.ok(Math.abs(motor.ebullicion(l, 760).T - s.Teb) < 0.3, l);
  }
});
test('el agua da lo mismo que el motor de calorimetría: misma ISA y mismo Antoine', () => {
  const calor = require('../calorimetria/motor.js');
  for (const h of [0, 150, 2335, 3400, 3825, 3827, 4500, 5100]) {
    const a = motor.ebullicionAltitud('agua', h), b = calor.ebullicion(h);
    assert.ok(Math.abs(a.Pa - b.P) < 1e-6, `P a ${h} m`);
    assert.ok(Math.abs(a.T - b.T) < 1e-9, `T a ${h} m`);
    assert.ok(Math.abs(motor.presionAltitud(h) - calor.presionAltitud(h)) < 1e-6);
  }
});
test('hierve: cuando la presión de vapor pasa la de afuera; el líquido abierto no pasa de su punto de ebullición', () => {
  for (const l of LIQ) for (const P of [300, 472.86, 760, 1520]) {
    const Teb = motor.ebullicion(l, P).T;
    assert.equal(motor.hierve(l, Teb - 1, P).hierve, false);
    assert.equal(motor.hierve(l, Teb + 1, P).hierve, true);
    assert.ok(Math.abs(motor.hierve(l, Teb + 5, P).Tliquido - Teb) < 1e-12);
  }
});

// La caja: misma densidad de vapor con cualquier alto y ancho, y la presión que marca es la presión de vapor.
function promedio(o, t0, t1) {
  const c = motor.crearCaja(o); let s = 0, k = 0;
  while (c.t < t1) { motor.pasoCaja(c, 1 / 30); if (c.t > t0) { s += motor.lecturaCaja(c).densidad; k++; } }
  return { d: s / k, c, L: motor.lecturaCaja(c) };
}
test('caja (GQ18): la densidad de equilibrio no depende del alto ni del ancho; la presión es la de vapor', () => {
  for (const T of [25, 60]) {
    const deq = motor.lecturaCaja(motor.crearCaja({ T, escala: 300 })).densidadEq;
    for (const [W, H] of [[1, 0.5], [1, 1], [2, 0.5]]) {
      const r = promedio({ T, W, H, escala: T === 25 ? 300 : 60, semilla: 9 }, 15, 160);
      const eq = r.L.densidadEq;
      assert.ok(Math.abs(r.d / eq - 1) < 0.12, `T ${T}, W ${W}, H ${H}: ${r.d} contra ${eq}`);
      assert.ok(Math.abs(r.d * (T + 273.15) / r.c.escala / motor.presionVapor('agua', T).mmHg - 1) < 0.12);
    }
    assert.ok(deq > 0);
  }
});
test('caja: empieza sin vapor, la evaporación es pareja y la condensación sube hasta igualarla', () => {
  const c = motor.crearCaja({ T: 25, W: 1, H: 0.6, escala: 300, semilla: 4 });
  assert.equal(motor.lecturaCaja(c).vapor, 0);
  while (c.t < 2) motor.pasoCaja(c, 1 / 30);
  const a = motor.lecturaCaja(c);
  assert.ok(a.condensan < a.evaporan, 'al principio vuelven menos de las que salen');
  let ev = 0, cn = 0, k = 0;
  while (c.t < 120) { motor.pasoCaja(c, 1 / 30); if (c.t > 20) { const L = motor.lecturaCaja(c); ev += L.evaporan; cn += L.condensan; k++; } }
  assert.ok(Math.abs(cn / ev - 1) < 0.1, `en equilibrio, los dos flujos se igualan: ${cn / k} contra ${ev / k}`);
  assert.ok(Math.abs(ev / k / motor.ritmoEquilibrio(c) - 1) < 0.1, `el ritmo de evaporación es el de equilibrio: ${ev / k} contra ${motor.ritmoEquilibrio(c)}`);
  for (const p of c.vapor) assert.ok(p.x >= 0 && p.x <= c.W && p.y > 0 && p.y <= c.H);
});
test('caja: la misma semilla da la misma caja; llena empieza en equilibrio; cambiarT conserva las moléculas', () => {
  const a = motor.crearCaja({ T: 40, semilla: 2 }), b = motor.crearCaja({ T: 40, semilla: 2 });
  for (let i = 0; i < 200; i++) { motor.pasoCaja(a, 1 / 30); motor.pasoCaja(b, 1 / 30); }
  assert.deepEqual(a.vapor, b.vapor);
  const l = motor.crearCaja({ T: 25, escala: 300, llena: true, semilla: 3 }), L = motor.lecturaCaja(l);
  assert.equal(L.vapor, Math.round(L.densidadEq * l.W * l.H));
  const n = l.vapor.length; motor.cambiarT(l, 60); assert.equal(l.vapor.length, n);
  assert.ok(motor.lecturaCaja(l).densidadEq > L.densidadEq);
});
test('dibujos: la rejilla del líquido queda bajo la superficie; la burbuja y la condensación no enciman moléculas', () => {
  const r = motor.rejillaLiquido(1, 0.3, 0.08, 1.3, 2);
  assert.ok(r.length > 10);
  for (const p of r) assert.ok(p.y < 0 && p.x > 0 && p.x < 1.05);
  assert.ok(motor.vecinosRejilla(r, 0.1).length > r.length / 2);
  const b = motor.burbuja(1, 5, 3);
  assert.equal(b.length, 5);
  for (const p of b) assert.ok(Math.hypot(p.x, p.y) <= 0.8 + 1e-12);
  const c = motor.condensacion(18, 1, 0.8, 0.08, 4);
  assert.equal(c.gas.length, 18); assert.equal(c.liquido.length, 18);
  assert.equal(c.radio, 0.04, 'GQ16: el mismo radio en el gas y en el líquido');
  for (const p of c.liquido) assert.ok(p.y > 0.8 - 0.3 && p.y < 0.8);
});

// Diagramas de fases
test('diagramas: las curvas se juntan en el punto triple y pasan por los puntos de tabla', () => {
  for (const s of ['agua', 'co2']) {
    const t = motor.FASES[s].triple;
    const sub = motor.presionCurva(s, 'sublimacion', t.T), vap = motor.presionCurva(s, 'vaporizacion', t.T), fus = motor.presionCurva(s, 'fusion', t.T);
    assert.ok(Math.abs(sub / t.P - 1) < 1e-9, `${s}: sublimación`);
    assert.ok(Math.abs(fus / t.P - 1) < 1e-9, `${s}: fusión`);
    assert.ok(Math.abs(vap / t.P - 1) < 0.01, `${s}: vaporización a menos de 1 %`);
  }
  assert.ok(Math.abs(motor.presionCurva('co2', 'vaporizacion', motor.FASES.co2.critico.T) / motor.FASES.co2.critico.P - 1) < 1e-9);
  assert.ok(Math.abs(motor.temperaturaCurva('co2', 'sublimacion', 1) - -78.464) < 1e-9);
  assert.ok(Math.abs(motor.temperaturaCurva('agua', 'vaporizacion', 1) - 100) < 0.01);
  assert.ok(Math.abs(motor.temperaturaCurva('agua', 'fusion', 1)) < 0.01);
  // Hielo a −10 °C: el dato de tabla es 259,9 Pa.
  assert.ok(Math.abs(motor.presionCurva('agua', 'sublimacion', -10) * 101325 - 259.9) < 1);
  for (const [s, c, T] of [['agua', 'sublimacion', -30], ['co2', 'sublimacion', -90], ['co2', 'vaporizacion', 0], ['co2', 'fusion', -50]]) {
    assert.ok(Math.abs(motor.temperaturaCurva(s, c, motor.presionCurva(s, c, T)) - T) < 1e-9, `${s} ${c}`);
  }
});
test('fase(): cambia al cruzar cada curva', () => {
  const e = 1.02;
  for (const [s, T] of [['agua', -20], ['co2', -90]]) {
    const P = motor.presionCurva(s, 'sublimacion', T);
    assert.equal(motor.fase(s, P / e, T), 'gas'); assert.equal(motor.fase(s, P * e, T), 'sólido');
  }
  for (const [s, T] of [['agua', 50], ['agua', 250], ['co2', -20]]) {
    const P = motor.presionCurva(s, 'vaporizacion', T);
    assert.equal(motor.fase(s, P / e, T), 'gas'); assert.equal(motor.fase(s, P * e, T), 'líquido');
  }
  const Pf = motor.presionCurva('co2', 'fusion', -50);
  assert.equal(motor.fase('co2', Pf / e, -50), 'líquido'); assert.equal(motor.fase('co2', Pf * e, -50), 'sólido');
  const Pa = motor.presionCurva('agua', 'fusion', -2);
  assert.equal(motor.fase('agua', Pa / e, -2), 'sólido'); assert.equal(motor.fase('agua', Pa * e, -2), 'líquido', 'el hielo se funde con presión');
  assert.equal(motor.fase('co2', 80, 35), 'supercrítico'); assert.equal(motor.fase('co2', 60, 35), 'gas');
});
test('calentar a presión fija: bajo el punto triple sublima; sobre él, funde y hierve', () => {
  for (const s of ['agua', 'co2']) {
    const t = motor.FASES[s].triple;
    const bajo = motor.calentarAPresion(s, t.P / 2, t.T - 80, t.T + 80);
    assert.deepEqual(bajo.cambios.map(c => c.de + '>' + c.a), ['sólido>gas']);
    const sobre = motor.calentarAPresion(s, t.P * 3, t.T - 80, t.T + 80);
    assert.deepEqual(sobre.cambios.map(c => c.de + '>' + c.a), ['sólido>líquido', 'líquido>gas']);
    assert.ok(sobre.cambios[0].T < sobre.cambios[1].T);
  }
});

// Puentes de hidrógeno y sustancias
test('EN15: forma puentes si y solo si tiene un H unido a F, O o N y un F, O o N', () => {
  const S = motor.SUSTANCIAS;
  const esperado = { CH4: false, NH3: true, H2O: true, HF: true, H2S: false, H2Se: false, CH3F: false, CH3OCH3: false, CH3OH: true, CH3NH2: true, C2H5OH: true, acetona: false, butano: false, isobutano: false, pentano: false, neopentano: false };
  for (const k of Object.keys(S)) assert.equal(motor.puentesH(k).forma, esperado[k], k);
  for (const a of Object.keys(S)) for (const b of Object.keys(S)) {
    const p = motor.puenteHEntre(a, b);
    if (!p.hay) continue;
    const don = p.desde === 'a' ? S[a] : S[b], ace = p.desde === 'a' ? S[b] : S[a];
    assert.equal(don.atomos[p.h].el, 'H');
    assert.ok(['F', 'O', 'N'].includes(ace.atomos[p.aceptor].el));
  }
});
test('sustancias: enlaces dentro del dibujo, un átomo por posición y largos parecidos', () => {
  for (const [k, s] of Object.entries(motor.SUSTANCIAS)) {
    assert.ok(s.M > 0 && Number.isFinite(s.Teb), k);
    for (const [i, j] of s.enlaces) {
      const d = Math.hypot(s.atomos[i].x - s.atomos[j].x, s.atomos[i].y - s.atomos[j].y);
      assert.ok(d > 0.8 && d < 1.45, `${k}: enlace ${i}-${j} de ${d}`);
    }
    for (let i = 0; i < s.atomos.length; i++) for (let j = i + 1; j < s.atomos.length; j++) {
      assert.ok(Math.hypot(s.atomos[i].x - s.atomos[j].x, s.atomos[i].y - s.atomos[j].y) > 0.75, `${k}: átomos ${i} y ${j} encimados`);
    }
    // Cada H está unido a un solo átomo.
    s.atomos.forEach((a, i) => { if (a.el === 'H') assert.equal(s.enlaces.filter(e => e.includes(i)).length, 1, `${k}: H ${i}`); });
  }
});

// Las predicciones de la escena: ningún error típico da la respuesta correcta.
test('predicciones de la escena: cada error da algo distinto de la respuesta', () => {
  const f = motor.compararFrascos('agua', 25, [1, 2]);
  assert.ok(f.iguales);
  for (const k of Object.keys(f.errores)) assert.notDeepEqual(f.errores[k], f.P, k);
  const p = motor.ebullicionLugar(3827);
  assert.equal(p.comparada, 'menor');
  assert.ok(p.T > 85 && p.T < 90);
  for (const k of Object.keys(p.errores)) assert.notEqual(p.errores[k], 'menor', k);
  const r = motor.razonEbullicion('H2O', 'H2S');
  assert.equal(r.mayor, 'H2O'); assert.equal(r.razon, 'puentes-de-hidrogeno');
  assert.ok(motor.SUSTANCIAS.H2S.M > motor.SUSTANCIAS.H2O.M, 'el H₂S pesa más: «el agua pesa más» es falso');
  assert.equal(r.errores['por-masa'], 'H2S');
  const q = motor.quienesFormanPuentes(['NH3', 'CH3F', 'CH3OCH3']), ops = [q.forman, ...Object.values(q.errores)].map(x => x.join(','));
  assert.equal(new Set(ops).size, 4, 'puentes: cuatro opciones distintas');
  const b = motor.razonEbullicion('butano', 'isobutano');
  assert.equal(b.mayor, 'butano');
  for (const k of ['por-carbonos', 'ramificada-mas-unida']) assert.notEqual(b.errores[k], b.mayor, k);
  const g = motor.gasSobreAgua(760, 25), opsG = [g.Pgas, g.errores['no-resta'], g.errores['suma-el-vapor'], g.errores['reparte-a-medias']].map(x => x.toFixed(1));
  assert.equal(new Set(opsG).size, 4, 'gas sobre agua');
  const o = motor.ollaPresion(1520), opsO = [Math.round(o.T), o.errores['olla-sigue-en-100'], o.errores['doble-presion-doble-T']];
  assert.equal(new Set(opsO).size, 3); assert.notEqual(o.errores['presion-ayuda-a-escapar'], o.comparada);
  const co = motor.calentarAPresion('co2', 1, -100, 20);
  assert.notDeepEqual(co.cambios.map(c => ({ de: c.de, a: c.a })), co.errores['se-derrite-como-el-agua']);
  const h = motor.humedadRelativa(14.2, 25, 760);
  assert.ok(Math.abs(h.HR - h.errores['fraccion-del-aire']) > 10);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.presionVapor('mercurio', 25), /desconocido/);
  assert.throws(() => motor.presionVapor('agua', 'x'), /número/);
  assert.throws(() => motor.presionVapor('agua', -300), /absoluto/);
  assert.throws(() => motor.ebullicion('agua', 0), /positiva/);
  assert.throws(() => motor.presionAltitud(20000), /troposfera/);
  assert.throws(() => motor.sustancia('XY'), /desconocida/);
  assert.throws(() => motor.gasSobreAgua(10, 25), /no alcanza/);
  assert.throws(() => motor.vaporDesdeHR(120, 25), /0 a 100/);
  assert.throws(() => motor.equilibrioCerrado('agua', 25, 0), /positivo/);
  assert.throws(() => motor.compararFrascos('agua', 25, [1]), /dos volúmenes/);
  assert.throws(() => motor.fase('helio', 1, 0), /desconocido/);
  assert.throws(() => motor.fase('agua', 0, 0), /positiva/);
  assert.throws(() => motor.presionCurva('agua', 'otra', 0), /desconocida/);
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
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id, v.tol || {});
});
