// Pruebas del motor de «Del pozo al cielo». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: toda combustión queda balanceada y conserva la masa; el reparto del O₂ pasa de hollín a CO y a CO₂
//    en los umbrales, y nunca crea ni pierde átomos; el frasco cerrado pesa lo mismo antes y después; el CO₂ por litro
//    pesa más que la gasolina; la torre ordena por punto de ebullición y no crea sustancias; la lluvia baja de 5,6 solo
//    con SO₂ o NOₓ; el cielo separa el ultravioleta (ozono) de la temperatura (CO₂); el oxígeno del lago llega a su
//    mínimo después de las algas; el ozono del smog es de día y necesita sol y tráfico; el hierro oxidado pesa más;
//    el reacomodo de las partículas usa los mismos átomos; ningún error típico da la respuesta de una predicción.
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
const HC = Object.keys(motor.HIDROCARBUROS);
test('combustión: las tres ecuaciones de cada hidrocarburo quedan balanceadas, con enteros mínimos y la misma masa', () => {
  for (const h of [...HC, { C: 2, H: 6 }, { C: 6, H: 6 }, { C: 3, H: 6 }]) for (const t of ['completa', 'incompleta', 'hollin']) {
    const r = motor.combustion(h, t);
    assert.ok(r.balanceada, `${JSON.stringify(h)} ${t}`);
    assert.ok(Math.abs(r.masas[0] - r.masas[1]) < 1e-9);
    const k = Object.values(r.coef).filter(v => v);
    assert.ok(k.every(Number.isInteger));
    const g = k.reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
    assert.equal(g, 1, 'enteros mínimos');
  }
});
test('reparto del O₂: conserva átomos y masa, y pasa de hollín a CO y a CO₂ en los umbrales', () => {
  for (const h of ['metano', 'propano', 'octano']) {
    const H = motor.HIDROCARBUROS[h];
    for (let r = 0.2; r <= 16; r += 0.05) {
      const x = motor.repartoO2(h, 2, 2 * r);
      assert.ok(Math.abs(x.masas[0] - x.masas[1]) < 1e-9, `${h} ${r}: masa`);
      const C = 2 * H.C, Cdes = x.comb * H.C + x.CO + x.CO2 + x.C;
      const O = 4 * r, Odes = x.O2 * 2 + x.CO + 2 * x.CO2 + x.H2O;
      assert.ok(Math.abs(C - Cdes) < 1e-9 && Math.abs(O - Odes) < 1e-9, `${h} ${r}: átomos`);
      for (const k of ['H2O', 'CO', 'CO2', 'C', 'O2', 'comb']) assert.ok(x[k] >= 0, k);
      const u = x.umbrales;
      if (r < u.hollin - 1e-9) assert.ok(x.comb > 0 && x.CO === 0, 'sin O para el agua, sobra combustible');
      if (r > u.hollin + 1e-9 && r < u.todoCO - 1e-9) assert.ok(x.C > 0 && x.CO > 0 && x.CO2 === 0);
      if (r > u.todoCO + 1e-9 && r < u.todoCO2 - 1e-9) assert.ok(x.C === 0 && x.CO > 0 && x.CO2 > 0);
      if (r > u.todoCO2 + 1e-9) assert.ok(x.CO === 0 && x.O2 > 0 && x.CO2 === 2 * H.C);
    }
  }
});
test('frasco cerrado (QA9): la balanza marca lo mismo con cualquier cantidad de O₂; abierto, baja lo que pesaba el combustible', () => {
  for (const mO2 of [1, 3, 6.4, 8, 20]) {
    const b = motor.balanzaCombustion('metano', 1.6, mO2, 250, true);
    assert.equal(b.comparada, 'igual');
    for (const k of Object.keys(b.errores)) assert.notEqual(b.errores[k], b.antes, k);
  }
  const a = motor.balanzaCombustion('octano', 5, 0, 300, false);
  assert.ok(Math.abs(a.antes - a.despues - 5) < 1e-9);
  assert.ok(a.gases > 5, 'salen más gramos de gases que de combustible: se sumó el oxígeno del aire');
});
test('CO₂: cada hidrocarburo da más masa de CO₂ que la que se quemó, y la masa de los productos es combustible + O₂', () => {
  for (const h of HC) {
    const c = motor.co2DeCombustible(100, h);
    assert.ok(c.CO2 > 100, h);
    assert.ok(Math.abs(100 + c.O2 - c.CO2 - c.H2O) < 1e-9, h);
  }
  const l = motor.co2PorLitro(1, 0.7);
  const ops = [l.CO2, ...Object.values(l.errores)].map(v => Math.round(v / 10));
  assert.equal(new Set(ops).size, 4, 'cuatro opciones distintas');
});
test('torre: el destino sigue el orden de los puntos de ebullición, ninguna sustancia se crea y cada bandeja es más fría que lo que guarda', () => {
  const b = motor.BANDEJAS;
  for (const d of [-60, -30, 0, 30, 40]) {
    const bb = b.map(x => ({ T: x.T + d, nombre: x.nombre }));
    const t = motor.torre(bb);
    const lugar = v => (v === 'fondo' ? -1 : v === 'gases' ? 99 : v);
    const ss = [...motor.SUST_TORRE].sort((p, q) => motor.HIDROCARBUROS[p].Teb - motor.HIDROCARBUROS[q].Teb);
    for (let i = 1; i < ss.length; i++) assert.ok(lugar(t.destino[ss[i]]) <= lugar(t.destino[ss[i - 1]]), `${ss[i]} sale más abajo o igual`);
    assert.equal(Object.keys(t.destino).length, motor.SUST_TORRE.length);
    t.bandejas.forEach((x, i) => {
      for (const s of x.sustancias) {
        assert.ok(x.T < motor.HIDROCARBUROS[s].Teb);
        if (i > 0) assert.ok(bb[i - 1].T >= motor.HIDROCARBUROS[s].Teb, `${s} no se condensó antes`);
      }
    });
  }
  for (let n = 1; n <= 40; n++) assert.equal(typeof motor.fraccionPorCarbonos(n), 'string');
  for (const s of ['pentano', 'octano', 'dodecano', 'hexadecano']) assert.equal(motor.fraccionPorCarbonos(motor.HIDROCARBUROS[s].C), motor.torre().fraccion[s], s);
});
test('lluvia: pH 5,6 sin contaminantes; baja con SO₂ o NOₓ; el SO₂ acidifica el doble que el mismo NO₂', () => {
  assert.ok(Math.abs(motor.lluvia({}).pH - motor.LLUVIA_NORMAL) < 1e-12);
  let ant = 5.6;
  for (const c of [1e-7, 1e-6, 1e-5, 1e-4, 1e-3]) {
    const s = motor.lluvia({ SO2: c }).pH, n = motor.lluvia({ NO2: c }).pH, d = motor.lluvia({ NO2: 2 * c }).pH;
    assert.ok(s < ant && s < n && Math.abs(s - d) < 1e-12); ant = s;
  }
  for (let p = 2; p <= 6; p += 0.5) assert.ok(Math.abs(motor.compararPH(p, p + 1).veces - 10) < 1e-9);
});
test('cielo: el ozono solo cambia el ultravioleta y el CO₂ solo cambia la temperatura', () => {
  for (const DU of [100, 150, 220, 300, 400]) for (const co2 of [280, 420, 560, 800]) {
    const a = motor.cielo({ ozono: DU, co2 }), b = motor.cielo({ ozono: DU * 0.7, co2 }), c = motor.cielo({ ozono: DU, co2: co2 * 1.3 });
    assert.ok(b.uv > a.uv && b.T === a.T);
    assert.ok(c.T > a.T && c.uv === a.uv);
  }
  const p = motor.cambioCielo({ ozono: 300, co2: 420 }, { ozono: 150, co2: 420 });
  for (const [k, e] of Object.entries(p.errores)) assert.ok(e.uv !== p.uv || e.T !== p.T, k);
});
test('eutrofización: sin nutrientes el oxígeno casi no cambia; con nutrientes, el mínimo de O₂ llega después del máximo de algas', () => {
  const sin = motor.eutrofizacion(0);
  assert.ok(sin.minO2 > 7.5 && sin.pecesFinal === 1);
  const con = motor.eutrofizacion(1);
  assert.ok(con.diaMinO2 > con.diaMaxAlgas + 3, `${con.diaMinO2} contra ${con.diaMaxAlgas}`);
  assert.ok(con.minO2 < 2 && con.pecesFinal < 0.5);
  for (const d of con.serie) assert.ok(d.O2 >= 0 && d.O2 <= 8 && d.algas >= 0);
  // Mientras las algas crecen, el oxígeno no baja de 7,5 mg/L: el daño viene al final.
  for (const d of con.serie.filter(x => x.dia <= con.diaMaxAlgas)) assert.ok(d.O2 > 7.5);
});
test('smog: el ozono es de día, después de la hora punta, y sin sol o sin tráfico no se forma', () => {
  const s = motor.smog(1);
  assert.ok(s.horaPico >= 11 && s.horaPico <= 15, `pico a las ${s.horaPico}`);
  assert.notEqual(s.errores['sale-del-escape'], s.horaPico);
  assert.ok(s.horas[3].O3 < s.picoO3 / 5, 'de madrugada casi no hay');
  assert.equal(motor.smog(1, 0).picoO3, 0);
  assert.equal(motor.smog(0).picoO3, 0);
  assert.ok(motor.smog(2).picoO3 > s.picoO3);
});
test('corrosión: el hierro oxidado pesa más, en proporción 160/112; solo se oxida con agua y oxígeno a la vez', () => {
  for (const m of [1, 10, 56, 112, 500]) for (const f of [0.1, 0.5, 1]) {
    const o = motor.oxidarHierro(m, f);
    assert.ok(o.masaFinal > m);
    assert.ok(Math.abs(o.masaFinal - m - 48 / 112 * m * f) < 1e-9);
  }
  assert.equal(motor.corrosion({ agua: true, oxigeno: true }).seOxida, true);
  assert.equal(motor.corrosion({ agua: true }).seOxida, false);
  assert.equal(motor.corrosion({ oxigeno: true, sal: true }).seOxida, false);
  assert.equal(motor.corrosion({ agua: true, oxigeno: true, sal: true }).rapidez, 'rápida');
});
test('metalurgia: el metal real nunca pasa del teórico ni de la masa de mineral; los errores dan otro número', () => {
  for (const k of Object.keys(motor.MENAS)) for (const ley of [0.2, 0.5, 0.9]) for (const r of [0.6, 0.9]) {
    const x = motor.metalurgia(k, 1000, ley, r);
    assert.ok(x.real <= x.teorico && x.teorico < x.puro, k);
    for (const e of Object.keys(x.errores)) assert.ok(Math.abs(x.errores[e] - x.real) > 1, `${k} ${e}`);
  }
});
test('partículas: la caja no encima moléculas y el reacomodo usa los mismos átomos', () => {
  const lista = [['CH4', 3], ['O2', 6]];
  const c = motor.caja(lista, 20, 12, 5);
  assert.equal(c.length, 9);
  for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++)
    assert.ok(Math.hypot(c[i].x - c[j].x, c[i].y - c[j].y) > motor.extension(c[i].s) + motor.extension(c[j].s) - 0.05, `${i}-${j}`);
  for (const p of c) assert.ok(p.x > 0 && p.x < 20 && p.y > 0 && p.y < 12);
  const r = motor.reacomodo(lista, [['CO2', 3], ['H2O', 6]], 20, 12, 5);
  assert.deepEqual(r.cuenta, { C: 3, H: 12, O: 12 });
  assert.equal(r.atomos.length, 27);
  assert.throws(() => motor.reacomodo(lista, [['CO2', 3], ['H2O', 5]], 20, 12, 5), /no cuadran/);
  // La lupa de la lluvia: SO₂ → SO₃ → H₂SO₄, con los mismos átomos.
  const l1 = motor.reacomodo([['SO2', 2], ['O2', 1], ['H2O', 2]], [['SO3', 2], ['H2O', 2]], 11, 7, 4);
  const l2 = motor.reacomodo([['SO3', 2], ['H2O', 2]], [['H2SO4', 2]], 11, 7, 4);
  assert.deepEqual(l1.cuenta, { S: 2, O: 8, H: 4 }); assert.deepEqual(l2.cuenta, { S: 2, O: 8, H: 4 });
  assert.equal(motor.masaMolar({ H: 2, S: 1, O: 4 }), motor.MOLECULAS.H2SO4.reduce((t, a) => t + motor.MASAS[a.el], 0));
  // Ningún par de átomos de una molécula se encima.
  for (const [s, A] of Object.entries(motor.MOLECULAS)) for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++)
    assert.ok(Math.hypot(A[i].x - A[j].x, A[i].y - A[j].y) >= motor.RADIO[A[i].el] + motor.RADIO[A[j].el] - 0.08, `${s}: átomos ${i} y ${j}`);
  const q = motor.reacomodo([['CH4', 2], ['O2', 3]], [['CO', 2], ['H2O', 4]], 20, 12, 5);
  assert.equal(q.atomos.length, 16);
  // Cada molécula de la lista tiene enlaces que unen todos sus átomos.
  for (const s of Object.keys(motor.MOLECULAS)) {
    const n = motor.MOLECULAS[s].length, e = motor.enlaces(s), vistos = new Set([0]);
    let cambio = true; while (cambio) { cambio = false; for (const [a, b] of e) if (vistos.has(a) !== vistos.has(b)) { vistos.add(a); vistos.add(b); cambio = true; } }
    assert.equal(vistos.size, n, s);
  }
});
test('predicciones de la escena: cada error da algo distinto de la respuesta', () => {
  const p = motor.repartoO2('metano', 2, 3), pr = p.productos.join(',');
  const prods = o => ['CO2', 'CO', 'C', 'H2O', 'O2', 'comb'].filter(k => (o[k] || 0) > 0).join(',');
  for (const [k, e] of Object.entries(p.errores)) assert.notEqual(prods(e), pr, k);
  const t = motor.torre();
  assert.equal(t.destino.tetracosano, 0, 'el C₂₄ va a la bandeja de 350 °C');
  const ops = [t.destino.hexadecano, t.errores['por-densidad'].hexadecano, t.errores['el-calor-sube'].hexadecano, t.errores['invierte-la-regla'].hexadecano];
  assert.equal(new Set(ops).size, 4, 'torre: cuatro opciones distintas');
  const o = motor.oxidarHierro(112), opsO = [o.Fe2O3, ...Object.values(o.errores)];
  assert.equal(new Set(opsO).size, 4);
  const m = motor.mezclaOctanaje([{ vol: 60, oct: 84 }, { vol: 40, oct: 97 }]), opsM = [m.octanaje, ...Object.values(m.errores)].map(v => v.toFixed(1));
  assert.equal(new Set(opsM).size, 4);
  const l = motor.lluvia({ SO2: 2.5e-5 });
  assert.ok(l.pH < 4.5 && l.acida);
  for (const v of Object.values(l.errores)) assert.ok(Math.abs(v - l.pH) > 0.2);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.combustion('kerosene'), /desconocido/);
  assert.throws(() => motor.combustion({ C: 1.5, H: 4 }), /enteros/);
  assert.throws(() => motor.combustion('metano', 'rara'), /tipo/);
  assert.throws(() => motor.repartoO2('metano', 0, 1), /positivo/);
  assert.throws(() => motor.repartoO2('metano', 1, -1), /negativo/);
  assert.throws(() => motor.co2PorLitro('x'), /número/);
  assert.throws(() => motor.octanaje(1.2), /0 a 1/);
  assert.throws(() => motor.mezclaOctanaje([{ vol: 1, oct: 90 }]), /dos partes/);
  assert.throws(() => motor.paraLlegar(84, 97, 99), /entre/);
  assert.throws(() => motor.ppm(1, 0), /positivo/);
  assert.throws(() => motor.pH(0), /positivo/);
  assert.throws(() => motor.lluvia({ SO2: -1 }), /negativas/);
  assert.throws(() => motor.torre([{ T: 30 }, { T: 150 }]), /más caliente/);
  assert.throws(() => motor.torre([{ T: 410 }, { T: 150 }]), /horno/);
  assert.throws(() => motor.metalurgia('pirita', 1, 0.5), /desconocida/);
  assert.throws(() => motor.metalurgia('blenda', 1, 1.5), /0 a 1/);
  assert.throws(() => motor.masaMolar({ Xx: 1 }), /desconocido/);
  assert.throws(() => motor.caja([['CO2', 50]], 4, 4, 1), /no caben/);
  assert.throws(() => motor.caja([['Hg', 1]], 4, 4, 1), /desconocida/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
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
