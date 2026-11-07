// Pruebas del motor de Rendimiento y pureza. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: las ecuaciones están balanceadas; masa a masa es de ida y vuelta; el real nunca pasa del teórico ni el
//    puro de la muestra; pureza y rendimiento se multiplican y conmutan; el problema inverso deshace el directo; la masa
//    se conserva en el recipiente cerrado y en la combustión incompleta; los equivalentes coinciden con los moles de la
//    ecuación; la animación empieza y termina donde dice el motor; ningún error típico da la respuesta de la escena.
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
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const [i, t] of (c.tambien || []).entries()) comprobar(c.fn, t.args, t.espera, `${c.nombre} (también ${i + 1})`);
});

// 2. Propiedades
const IDS = Object.keys(motor.REACCIONES);
const cerca = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
test('las ecuaciones del catálogo están balanceadas y sus sustancias tienen masa molar', () => {
  for (const id of IDS) {
    assert.ok(motor.balance(id).balanceada, id);
    const r = motor.REACCIONES[id];
    for (const [, f] of [...r.reactivos, ...r.productos]) assert.ok(motor.masaMolar(f) > 0, `${id}: ${f}`);
    assert.ok(r.reactivos.some(x => x[1] === r.reactivo) && r.productos.some(x => x[1] === r.producto), id);
  }
});
test('masa a masa es de ida y vuelta, y la masa total de la ecuación se conserva', () => {
  for (const id of IDS) {
    const r = motor.REACCIONES[id];
    const ida = motor.masaAMasa(id, 37, r.reactivo, r.producto);
    assert.ok(cerca(motor.masaAMasa(id, ida, r.producto, r.reactivo), 37), id);
    const izq = r.reactivos.reduce((s, [c, f]) => s + c * motor.masaMolar(f), 0), der = r.productos.reduce((s, [c, f]) => s + c * motor.masaMolar(f), 0);
    assert.ok(cerca(izq, der), `${id}: ${izq} contra ${der}`);
  }
});
test('producir: real ≤ teórico, puro ≤ muestra; pureza y rendimiento se multiplican y conmutan', () => {
  for (const id of IDS) for (const m of [10, 87.5, 300]) for (const p of [40, 75, 100]) for (const e of [30, 90, 100]) {
    const r = motor.producir({ reaccion: id, muestra: m, pureza: p, rendimiento: e });
    assert.ok(r.pura <= m + 1e-12 && r.real <= r.teorico + 1e-12, id);
    assert.ok(cerca(r.pura + r.impureza, m) && cerca(r.real + r.noFormado, r.teorico), id);
    const max = motor.producir({ reaccion: id, muestra: m }).real;
    assert.ok(cerca(r.real, max * p / 100 * e / 100), `${id}: multiplicar`);
    const cambiado = motor.producir({ reaccion: id, muestra: m, pureza: e, rendimiento: p }).real;
    assert.ok(cerca(r.real, cambiado), `${id}: conmutan`);
  }
});
test('el problema inverso deshace el directo', () => {
  for (const id of IDS) for (const p of [50, 80]) for (const e of [60, 90]) {
    const d = motor.producir({ reaccion: id, muestra: 123, pureza: p, rendimiento: e });
    const inv = motor.muestraNecesaria({ reaccion: id, real: d.real, pureza: p, rendimiento: e });
    assert.ok(cerca(inv.muestra, 123) && cerca(inv.pura, d.pura) && cerca(inv.teorico, d.teorico), id);
  }
});
test('rendimiento porcentual: deshace producir', () => {
  for (const id of IDS) {
    const d = motor.producir({ reaccion: id, muestra: 50, pureza: 80, rendimiento: 64 });
    assert.ok(cerca(motor.rendimientoPorcentual({ reaccion: id, masa: 50, pureza: 80, real: d.real }).porcentaje, 64), id);
  }
});
test('cadena: el total es el producto y nunca pasa del menor', () => {
  for (const l of [[90, 80], [50, 50, 50], [99, 10, 70, 100]]) {
    const c = motor.rendimientoCadena(l);
    assert.ok(cerca(c.total, l.reduce((s, x) => s * x / 100, 100)));
    assert.ok(c.total <= Math.min(...l) + 1e-12);
  }
});
test('pureza contra rendimiento: gana el que está más lejos de 100, con cualquier masa', () => {
  for (const m of [10, 200, 5000]) for (const [p, e, mejor] of [[80, 90, 'pureza'], [95, 60, 'rendimiento'], [70, 70, 'igual']])
    assert.equal(motor.compararMejoras({ reaccion: 'hierro', muestra: m, pureza: p, rendimiento: e }).mejor, mejor, `${m} g, ${p} y ${e}`);
});
test('la masa se conserva: recipiente cerrado y combustión incompleta', () => {
  for (const id of ['caliza', 'clorato']) for (const e of [10, 50, 75, 100]) {
    const b = motor.balanceMasa({ reaccion: id, masa: 80, rendimiento: e });
    assert.ok(cerca(b.total, 80), `${id} ${e}`);
    if (e < 100) for (const k of ['se-pierde', 'falta-igual-sobra']) assert.ok(!cerca(b.errores[k].total, 80), `${id}: ${k} no conserva`);
  }
  for (const f of [0, 0.3, 0.75, 1]) { const c = motor.combustionIncompleta(18, f); assert.ok(cerca(c.total, c.reactivos), `C ${f}`); }
});
test('equivalentes: la ley de equivalentes coincide con los moles de la ecuación balanceada', () => {
  // ácido HₐX + base B(OH)ᵦ: β mol de ácido por cada a mol de base... en moles: n_base = n_ácido · θa/θb.
  for (const a of ['HCl', 'HNO3', 'H2SO4', 'H3PO4']) for (const b of ['NaOH', 'KOH', 'Ca(OH)2', 'Al(OH)3']) {
    const ea = motor.masaEquivalente(a), eb = motor.masaEquivalente(b), n = motor.neutralizar(a, 50, b);
    assert.ok(cerca(n.molesBase, n.molesAcido * ea.theta / eb.theta), `${a} con ${b}`);
  }
});
test('animación: empieza con todo junto y termina en lo que da el motor', () => {
  const e = { impureza: 40, pura: 160, teorico: 112, real: 100.8 };
  let ant = -1;
  for (let f = 0; f <= 1.0001; f += 0.05) { const r = motor.reparto(e, f); assert.ok(r.formado >= ant - 1e-12); ant = r.formado; }
  const a = motor.reparto(e, 0), z = motor.reparto(e, 1);
  assert.equal(a.separa, 0); assert.equal(a.formado, 0); assert.equal(z.formado, 100.8); assert.equal(z.puroQueda, 0);
});

// Las predicciones de la escena: ningún error típico da la respuesta y las cuatro opciones son distintas.
const distintas = (xs, d = 1) => new Set(xs.map(x => x.toFixed(d))).size === xs.length;
test('predicciones de la escena: cada opción es distinta y ningún error da la respuesta', () => {
  const fe = motor.producir({ reaccion: 'hierro', muestra: 200, pureza: 80, rendimiento: 90 }), E = fe.errores;
  assert.ok(distintas([fe.real, E['muestra-pura'], E['olvida-rendimiento'], E['suma-porcentajes']]));
  for (const k of Object.keys(E)) assert.ok(!cerca(E[k], fe.real), `hierro: ${k}`);
  const rp = motor.rendimientoPorcentual({ reaccion: 'caliza', masa: 50, real: 21 });
  assert.ok(distintas([rp.porcentaje, rp.errores['sobre-reactivo'], rp.errores['lo-que-falta'], rp.errores['otro-producto']], 0));
  const b = motor.balanceMasa({ reaccion: 'caliza', masa: 50, rendimiento: 75 });
  assert.ok(distintas([b.total, b.errores['se-pierde'].total, b.errores['falta-igual-sobra'].total]));
  assert.notEqual(b.errores['sale-como-gas'].formados.CO2, b.formados.CO2);
  const inv = motor.muestraNecesaria({ reaccion: 'caliza', real: 42, pureza: 80, rendimiento: 75 });
  assert.ok(distintas([inv.muestra, inv.errores['olvida-pureza'], inv.errores['multiplica-pureza'], inv.errores['multiplica-rendimiento']]));
  const c = motor.rendimientoCadena([90, 80]);
  assert.ok(distintas([c.total, c.errores['suma-porcentajes'], c.errores['promedio'], c.errores['el-menor']], 0));
  const m = motor.compararMejoras({ reaccion: 'hierro', muestra: 200, pureza: 80, rendimiento: 90 });
  assert.equal(m.mejor, 'pureza'); for (const v of Object.values(m.errores)) assert.notEqual(v, m.mejor);
  const g = motor.producir({ reaccion: 'caliza', muestra: 80, pureza: 75, producto: 'CO2' });
  assert.ok(distintas([g.V, g.errores['muestra-pura'] / 44 * 22.4, g.errores['masa-como-volumen'], g.errores['coeficiente-como-moles']], 2));
  const n = motor.neutralizar('H2SO4', 98, 'NaOH');
  assert.ok(distintas([n.masaBase, ...Object.values(n.errores)]));
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.masaMolar('Xx2'), /sin masa|entiendo/);
  assert.throws(() => motor.masaMolar('Ca(OH2'), /falta/);
  assert.throws(() => motor.producir({ reaccion: 'oro', muestra: 1 }), /desconocida/);
  assert.throws(() => motor.producir({ reaccion: 'hierro', muestra: 0 }), /mayor que cero/);
  assert.throws(() => motor.producir({ reaccion: 'hierro', muestra: 10, pureza: 120 }), /0 a 100/);
  assert.throws(() => motor.producir({ reaccion: 'hierro', muestra: 10, rendimiento: 0 }), /0 a 100/);
  assert.throws(() => motor.rendimientoPorcentual({ reaccion: 'caliza', masa: 50, real: 30 }), /teórico/);
  assert.throws(() => motor.masaAMasa('caliza', 10, 'CaCO3', 'Fe'), /no está/);
  assert.throws(() => motor.rendimientoCadena([90]), /dos pasos/);
  assert.throws(() => motor.balanceMasa({ reaccion: 'hierro', masa: 10, rendimiento: 50 }), /un solo reactivo/);
  assert.throws(() => motor.combustionIncompleta(12, 2), /0 a 1/);
  assert.throws(() => motor.masaEquivalente('NaHCO3'), /θ/);
  assert.throws(() => motor.neutralizar('NaOH', 10, 'HCl'), /no es un ácido/);
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
