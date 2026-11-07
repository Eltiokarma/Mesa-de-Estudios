// Pruebas del motor de Redox y celda galvánica. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: E° > 0 si y solo si es espontánea; invertir la celda cambia el signo; la reacción global
//    conserva átomos y carga; E° no se multiplica por los coeficientes; la masa de Faraday escala con I·t y
//    con M/z; en la animación la carga se conserva en cada paso y los electrones nunca pasan por una
//    disolución (EC2); sin puente, cada vaso se carga y la reacción se frena (EC1, EC11). Electrólisis con agua
//    y con sal: los mismos moles de e⁻ en los dos electrodos, H₂ y O₂ en 2 : 1, V = n · 22,4 y los errores.
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
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'celda-galvanica');
  assert.ok(datos.casos.length >= 15);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const IDS = motor.POTENCIALES.map(p => p.id);
const pares = []; for (const a of IDS) for (const b of IDS) if (a !== b) pares.push([a, b]);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
// carga de una especie escrita con superíndices: 'Cu²⁺' → 2, 'Ag⁺' → 1, 'Zn' → 0
function cargaDe(s) {
  const m = /([⁰-⁹¹²³]*)([⁺⁻])$/.exec(s); if (!m) return 0;
  const n = m[1] ? Number([...m[1]].map(d => SUP.indexOf(d)).join('')) : 1;
  return m[2] === '⁺' ? n : -n;
}
// elemento de una especie: 'Cu²⁺' → Cu, 'H₂' → H (2 átomos)
function atomos(s) {
  const m = /^([A-Z][a-z]?)([₀-₉]*)/.exec(s);
  return { el: m[1], k: m[2] ? Number([...m[2]].map(d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d)).join('')) : 1 };
}

test('E° > 0 si y solo si la reacción es espontánea; invertir la celda cambia el signo', () => {
  for (const [a, c] of pares) {
    const r = motor.celda({ anodo: a, catodo: c }), inv = motor.celda({ anodo: c, catodo: a });
    assert.equal(r.espontanea, r.E > 0, `${a}→${c}`);
    cerca(inv.E, -r.E, `${a}/${c} invertida`);
    assert.notEqual(r.espontanea, inv.espontanea, `${a}/${c}: exactamente una de las dos es espontánea`);
    cerca(r.E, motor.par(c).E - motor.par(a).E, 'E° = E°cát − E°án', 1e-9);
    assert.deepEqual(inv.polos, { anodo: r.polos.catodo, catodo: r.polos.anodo });
  }
});
test('la pila siempre se arma espontánea: el de menor potencial es el ánodo, esté a la izquierda o a la derecha (EC4)', () => {
  for (const [i, d] of pares) {
    const p = motor.pila(i, d), q = motor.pila(d, i);
    assert.ok(p.espontanea && p.E > 0);
    assert.equal(p.anodo, motor.par(i).E < motor.par(d).E ? i : d);
    assert.equal(p.anodo, q.anodo, 'cambiar de lugar los vasos no cambia quién es el ánodo');
    assert.notEqual(p.lados.anodo, q.lados.anodo, 'pero sí cambia de lado');
    assert.notEqual(p.sentido.electrones.lado, q.sentido.electrones.lado);
    assert.equal(p.polos.anodo, '−'); assert.equal(p.polos.catodo, '+');
    // electrones del ánodo al cátodo; aniones hacia el ánodo y cationes hacia el cátodo
    assert.equal(p.sentido.electrones.de, p.anodo); assert.equal(p.sentido.electrones.a, p.catodo);
    assert.equal(p.sentido.aniones.hacia, p.anodo); assert.equal(p.sentido.cationes.hacia, p.catodo);
    assert.equal(p.sentido.aniones.lado, p.lados.anodo); assert.equal(p.sentido.cationes.lado, p.lados.catodo);
    assert.equal(p.sentido.electrones.lado, p.lados.anodo === 'izq' ? 'izq→der' : 'der→izq');
  }
});
test('electrólisis: la fuente invierte la reacción y los polos, pero "cátodo = reducción" y el sentido ánodo → cátodo no cambian (EC3, EC8)', () => {
  for (const [i, d] of pares) {
    const p = motor.pila(i, d), e = motor.electrolisis(i, d);
    assert.equal(e.anodo, p.catodo); assert.equal(e.catodo, p.anodo);
    cerca(e.E, -p.E, 'E'); assert.equal(e.espontanea, false); cerca(e.voltajeMinimo, p.E, 'voltaje mínimo');
    assert.equal(e.polos.catodo, '−'); assert.equal(e.polos.anodo, '+');
    assert.equal(e.sentido.electrones.de, e.anodo); assert.equal(e.sentido.electrones.por, 'alambre');
    assert.equal(e.reduccion.tipo, 'reducción'); assert.equal(e.reduccion.id, e.catodo);
    assert.notEqual(e.sentido.electrones.lado, p.sentido.electrones.lado, 'los electrones cambian de sentido');
  }
});
test('la reacción global conserva átomos y carga, y los electrones cedidos son los ganados (EC11)', () => {
  for (const [a, c] of pares) {
    const r = motor.celda({ anodo: a, catodo: c });
    const cuenta = lado => { const at = {}; let q = 0; for (const [k, s] of lado) { const { el, k: n } = atomos(s); at[el] = (at[el] || 0) + k * n; q += k * cargaDe(s); } return { at, q }; };
    const izq = cuenta(r.reaccion.reactivos), der = cuenta(r.reaccion.productos);
    assert.deepEqual(izq.at, der.at, `${r.reaccion.texto}: átomos`);
    assert.equal(izq.q, der.q, `${r.reaccion.texto}: carga`);
    const pa = motor.par(a), pc = motor.par(c);
    assert.equal(r.factores.anodo * pa.n, r.electrones); assert.equal(r.factores.catodo * pc.n, r.electrones);
    // los coeficientes son los mínimos: no tienen un factor común
    const mcd = (x, y) => (y ? mcd(y, x % y) : x);
    assert.equal([...r.reaccion.reactivos, ...r.reaccion.productos].map(x => x[0]).reduce(mcd), 1, r.reaccion.texto);
    for (const [, s] of r.reaccion.reactivos) assert.ok(!r.reaccion.productos.some(x => x[1] === s), 'nada aparece a los dos lados');
  }
});
test('E° no se multiplica: con coeficientes iguales a 1 el error de multiplicar coincide con la respuesta, y si no, difiere', () => {
  for (const [a, c] of pares) {
    const r = motor.celda({ anodo: a, catodo: c });
    const uno = r.factores.anodo === 1 && r.factores.catodo === 1;
    if (uno) cerca(r.errores.multiplicaCoeficientes, r.E, `${a}/${c}`);
    else if (Math.abs(motor.par(a).E) + Math.abs(motor.par(c).E) > 0) assert.notEqual(r.errores.multiplicaCoeficientes, r.E, `${a}/${c}`);
    cerca(r.errores.restaAlReves, -r.E, 'restar al revés'); cerca(r.errores.duplicada, 2 * r.E, 'duplicada');
  }
});
test('Faraday: la masa escala con I·t y con M/z; la segunda ley reparte los mismos moles de electrones', () => {
  const rnd = motor.azar(2026);
  for (const id of IDS) for (let k = 0; k < 40; k++) {
    const I = 0.1 + 20 * rnd(), s = 1 + 7200 * rnd(), p = motor.par(id), r = motor.faraday({ especie: id, I, s });
    cerca(r.Q, I * s, 'Q = I·t'); cerca(r.molE, I * s / 96500, 'moles de e⁻');
    cerca(r.g, I * s / 96500 * p.M * p.bRed / p.n, 'm = Q·M/(z·F)');
    const doble = motor.faraday({ especie: id, I: 2 * I, s }), mitad = motor.faraday({ especie: id, I, s: s / 2 });
    cerca(doble.g, 2 * r.g, 'doble corriente, doble masa'); cerca(mitad.g, r.g / 2, 'mitad de tiempo, mitad de masa');
    cerca(r.errores.sinCarga, r.g * r.z, 'olvidar la carga multiplica por z');
    // en minutos y en horas da lo mismo que en segundos
    cerca(motor.faraday({ especie: id, I, min: s / 60 }).g, r.g, 'minutos'); cerca(motor.faraday({ especie: id, I, h: s / 3600 }).g, r.g, 'horas');
    // el problema al revés devuelve el tiempo
    cerca(motor.tiempoFaraday({ especie: id, g: r.g, I }).s, s, 'tiempo');
  }
  for (let k = 0; k < 50; k++) {
    const Q = 10 + 1e5 * rnd(), s = motor.serie(Q, IDS);
    for (const x of s) cerca(x.molE, Q / 96500, 'mismos moles de e⁻ en serie');
    const cu = s.find(x => x.especie === 'Cu'), ag = s.find(x => x.especie === 'Ag');
    cerca(ag.mol, 2 * cu.mol, 'por cada Cu se depositan 2 Ag'); cerca(ag.g / cu.g, (108 / 1) / (63.5 / 2), 'masas en razón M/z');
  }
  for (let e = 0; e <= 30; e++) for (const id of ['Cu', 'Ag', 'Al']) {
    const d = motor.deposito(id, e); assert.equal(d.depositados * d.z + d.sobran, e); assert.ok(d.sobran < d.z);
  }
});

// Modelo de partículas de la animación
const COMBOS = [['Zn', 'Cu'], ['Cu', 'Ag'], ['Fe', 'Cu'], ['Zn', 'Ag'], ['Zn', 'Fe'], ['Fe', 'Ag'], ['Al', 'Ag'], ['Mg', 'Cu'], ['Zn', 'H2'], ['H2', 'Cu']];
test('animación: la carga total se conserva en cada paso y los electrones solo existen en el alambre o en los electrodos (EC2, EC11)', () => {
  for (const [a, c] of COMBOS) for (const puente of [true, false]) for (const semilla of [1, 7, 42]) {
    const est = motor.crearParticulas({ anodo: a, catodo: c, puente, semilla });
    const q0 = motor.cargas(est);
    assert.equal(q0.total, 0); assert.equal(q0.vasoA, 0, 'cada vaso empieza neutro'); assert.equal(q0.vasoC, 0); assert.equal(q0.puente, 0);
    for (let k = 0; k < 1800; k++) {
      motor.pasoParticulas(est, 1 / 30);
      const q = motor.cargas(est);
      assert.equal(q.total, 0, `${a}/${c} puente=${puente} paso ${k}: la carga no se conserva`);
      for (const p of est.parts) {
        if (p.tipo === 'e') assert.equal(p.zona, 'alambre', 'un electrón fuera del alambre');
        if (p.zona === 'alambre') assert.equal(p.tipo, 'e', 'en el alambre solo hay electrones');
        if (p.zona === 'puente') assert.ok(p.tipo === 'cat' || p.tipo === 'an', 'en el puente solo hay iones');
        if (p.zona === 'alambre' || p.zona === 'puente') assert.ok(p.sp >= 0 && p.sp <= 1);
        else assert.ok(p.u >= 0 && p.u <= 1 && p.v >= 0 && p.v <= 1, 'dentro del vaso');
      }
      assert.ok(est.eA >= 0 && est.eC >= 0);
      if (!puente) assert.ok(!est.parts.some(p => p.zona === 'puente'), 'sin puente no hay iones en el puente');
      // electrones: los que salieron = los que llegaron + los que están en camino
      assert.equal(est.emitidos, est.llegados + est.eA + est.parts.filter(p => p.tipo === 'e').length);
      // estequiometría: na electrones por átomo disuelto; nc por cada unidad depositada
      assert.equal(est.emitidos, est.disueltos * motor.par(a).n);
      assert.equal(est.llegados - est.eC, est.depositados / motor.par(c).bRed * motor.par(c).n);
    }
  }
});
test('animación: con la misma semilla se repite igual; con otra, cambia', () => {
  const correr = sem => { const e = motor.crearParticulas({ anodo: 'Zn', catodo: 'Cu', semilla: sem }); for (let k = 0; k < 600; k++) motor.pasoParticulas(e, 1 / 30); return e; };
  const a = correr(5), b = correr(5), c = correr(6);
  assert.deepEqual(a.parts, b.parts);
  assert.notDeepEqual(a.parts, c.parts);
});
test('animación: con puente la pila trabaja; sin puente cada vaso se carga y se frena enseguida (EC1, EC11)', () => {
  for (const [a, c] of COMBOS) {
    const con = motor.simular({ anodo: a, catodo: c, semilla: 3 }, 90), sin = motor.simular({ anodo: a, catodo: c, puente: false, semilla: 3 }, 90);
    assert.ok(con.disueltos >= 3, `${a}/${c} con puente: ${con.disueltos}`);
    assert.ok(sin.disueltos <= 2 && sin.disueltos >= 1, `${a}/${c} sin puente: ${sin.disueltos}`);
    assert.ok(sin.frenada, 'sin puente queda frenada');
    assert.ok(sin.cargas.vasoA > 0 && sin.cargas.vasoC < 0, 'el vaso del ánodo queda positivo y el del cátodo negativo');
    assert.ok(Math.abs(con.cargas.vasoA) <= 2 * motor.par(a).n && Math.abs(con.cargas.vasoC) <= 2 * motor.par(a).n, 'con puente, cada vaso se mantiene casi neutro');
    // el ánodo adelgaza y el cátodo engorda en la razón de la reacción
    const r = motor.celda({ anodo: a, catodo: c });
    if (con.llegados === con.emitidos && con.cargas.electrodoC === 0) assert.equal(con.depositados * r.factores.anodo * motor.par(a).bRed, con.disueltos * r.factores.catodo * motor.par(c).bRed);
  }
});
test('animación: el ánodo pierde átomos y nunca queda con menos de cero', () => {
  const e = motor.crearParticulas({ anodo: 'Zn', catodo: 'Ag', atomos: 3, ionesCatodo: 20, ionesPuente: 30 });
  for (let k = 0; k < 3000; k++) motor.pasoParticulas(e, 1 / 30);
  assert.equal(e.atomosA, 0); assert.equal(e.disueltos, 3); assert.ok(e.agotada);
});

test('voltímetro: la fem con puente salino; 0 sin puente; con un alambre en su lugar ya no es esa pila (null) (EC1)', () => {
  for (const [i, d] of pares) {
    const p = motor.pila(i, d);
    cerca(motor.voltimetro(p), p.E, 'por omisión hay puente'); cerca(motor.voltimetro(p, { puente: 'sal' }), p.E, 'sal');
    assert.equal(motor.voltimetro(p, { puente: 'alambre' }), null); assert.equal(motor.voltimetro(p, { puente: 'ninguno' }), 0);
  }
});
test('animación: con el circuito abierto no sale ningún electrón ni se disuelve nada, y al cerrarlo empieza', () => {
  const e = motor.crearParticulas({ anodo: 'Zn', catodo: 'Cu', abierto: true, semilla: 9 });
  for (let k = 0; k < 900; k++) motor.pasoParticulas(e, 1 / 30);
  assert.equal(e.disueltos, 0); assert.equal(e.emitidos, 0); assert.equal(motor.cargas(e).total, 0);
  e.abierto = false;
  for (let k = 0; k < 900; k++) motor.pasoParticulas(e, 1 / 30);
  assert.ok(e.disueltos > 0 && e.depositados > 0);
});

// Electrólisis con agua y con sal
const SIS = Object.keys(motor.SISTEMAS);
test('electrólisis con agua y con sal: los mismos moles de e⁻ en los dos electrodos; n = moles de e⁻ / z y V = n · 22,4', () => {
  assert.deepEqual(SIS.sort(), ['agua-acida', 'agua-sulfato', 'nacl-acuoso', 'nacl-fundido']);
  const rnd = motor.azar(77);
  for (const id of SIS) for (let k = 0; k < 40; k++) {
    const Q = 1 + 1e5 * rnd(), r = motor.electrolizar(id, { Q });
    cerca(r.molE, Q / 96500, 'moles de e⁻');
    for (const lado of ['catodo', 'anodo']) {
      const p = r[lado];
      cerca(p.mol * p.z, r.molE, `${id} ${lado}: e⁻ que se usan`);
      cerca(p.g, p.mol * p.M, 'masa');
      if (p.gas) cerca(p.L, p.mol * 22.4, 'volumen en condiciones normales'); else assert.equal(p.L, null);
      cerca(r.errores.sinDividir[lado], p.gas ? p.L * p.z : p.g * p.z, 'sin dividir entre z');
      // la semirreacción lleva sus z electrones, del lado que toca
      const ee = p.z === 1 ? 'e⁻' : `${p.z} e⁻`, [izq, der] = p.semirreaccion.split(' → ');
      assert.ok((lado === 'catodo' ? izq : der).includes(ee), `${id} ${lado}: ${p.semirreaccion}`);
      assert.ok(der.includes(p.producto), `${id} ${lado}: el producto sale a la derecha (${p.semirreaccion})`);
    }
    // la fuente manda: el cátodo es el polo − y ahí ocurre la reducción (EC3, EC8)
    assert.equal(r.catodo.polo, '−'); assert.equal(r.anodo.polo, '+');
    assert.equal(r.catodo.tipo, 'reducción'); assert.equal(r.anodo.tipo, 'oxidación');
    if (r.razonVolumen !== null) cerca(r.catodo.L / r.anodo.L, r.razonVolumen, 'razón de volúmenes');
    // la misma carga dada como I · t da lo mismo
    cerca(motor.electrolizar(id, { I: 2, s: Q / 2 }).catodo.mol, r.catodo.mol, 'I · t');
  }
});
test('agua: H₂ en el cátodo y O₂ en el ánodo, siempre el doble de H₂; los errores dan otra cosa', () => {
  for (const id of ['agua-acida', 'agua-sulfato']) for (const Q of [965, 9650, 19300, 1234.5]) {
    const r = motor.electrolizar(id, { Q });
    assert.equal(r.catodo.producto, 'H₂'); assert.equal(r.anodo.producto, 'O₂');
    assert.equal(r.razonVolumen, 2); cerca(r.catodo.L, 2 * r.anodo.L, '2 : 1');
    assert.notEqual(r.errores.unoAUno, r.anodo.L); cerca(r.errores.unoAUno, r.catodo.L, '1 : 1');
    assert.equal(r.errores.catodoAlReves, r.anodo.producto); assert.equal(r.errores.anodoAlReves, r.catodo.producto);
    cerca(r.errores.oxigenoConDos, 2 * r.anodo.L, 'O₂ con 2 F en vez de 4');
    assert.equal(r.global, '2 H₂O → 2 H₂ + O₂');
  }
});
test('NaCl: en agua sale H₂ en el cátodo y nunca sodio; fundido, sodio; en los dos, Cl₂ en el ánodo', () => {
  const a = motor.electrolizar('nacl-acuoso', { Q: 9650 }), f = motor.electrolizar('nacl-fundido', { Q: 9650 });
  assert.equal(a.catodo.producto, 'H₂'); assert.notEqual(a.catodo.producto, a.errores.saleSodio);
  assert.equal(f.catodo.producto, 'Na'); assert.notEqual(f.catodo.producto, f.errores.saleHidrogeno);
  assert.equal(a.anodo.producto, 'Cl₂'); assert.equal(f.anodo.producto, 'Cl₂');
  cerca(a.anodo.mol, f.anodo.mol, 'el mismo Cl₂ con la misma carga');
  cerca(f.catodo.mol, 2 * a.catodo.mol, 'dos Na por cada H₂');
  assert.ok(!/Na\b|Na$/.test(a.catodo.semirreaccion), 'en el cátodo de la salmuera no aparece sodio metálico');
});
test('productos: unidades · z + sobran = electrones, iguales en los dos electrodos', () => {
  for (const id of SIS) for (let e = 0; e <= 40; e++) {
    const r = motor.productos(id, e), x = motor.electrolizar(id);
    for (const lado of ['catodo', 'anodo']) {
      assert.equal(r[lado].unidades * x[lado].z + r[lado].sobran, e); assert.ok(r[lado].sobran < x[lado].z);
      assert.equal(r[lado].producto, x[lado].producto);
    }
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.par('Xx'), /tabla/);
  assert.throws(() => motor.celda({ anodo: 'Zn' }), /falta/);
  assert.throws(() => motor.celda({ anodo: 'Zn', catodo: 'Zn' }), /mismo par/);
  assert.throws(() => motor.pila('Cu', 'Cu'), /mismo par/);
  assert.throws(() => motor.electrolisis('Ag', 'Ag'), /mismo par/);
  assert.throws(() => motor.pila('Cu', 'Oro'), /tabla/);
  assert.throws(() => motor.semirreaccion('Cu', 'arriba'), /sentido/);
  assert.throws(() => motor.faraday({ especie: 'Cu', I: 5 }), /tiempo/);
  assert.throws(() => motor.faraday({ especie: 'Cu', I: 0, s: 10 }), /mayor que cero/);
  assert.throws(() => motor.faraday({ especie: 'Cu', I: -2, s: 10 }), /mayor que cero/);
  assert.throws(() => motor.faraday({ especie: 'Cu', I: 'cinco', s: 10 }), /número/);
  assert.throws(() => motor.faraday({ especie: 'Cu', I: 5, s: 0 }), /mayor que cero/);
  assert.throws(() => motor.faraday({ especie: 'Cu', Q: -1 }), /mayor que cero/);
  assert.throws(() => motor.faraday({ I: 5, s: 10 }), /tabla/);
  assert.throws(() => motor.tiempoFaraday({ especie: 'Ag', g: 0, I: 1 }), /mayor que cero/);
  assert.throws(() => motor.serie(100, []), /celdas/);
  assert.throws(() => motor.deposito('Cu', 2.5), /enteros/);
  assert.throws(() => motor.crearParticulas({ anodo: 'Cu', catodo: 'Cu' }), /mismo par/);
  assert.throws(() => motor.crearParticulas({ anodo: 'Zn', catodo: 'Cu', ionesCatodo: 2.5 }), /enteros/);
  assert.throws(() => motor.pasoParticulas(motor.crearParticulas({ anodo: 'Zn', catodo: 'Cu' }), -1), /negativo/);
  assert.throws(() => motor.simular({ anodo: 'Zn', catodo: 'Cu' }, 0), /mayor que cero/);
  assert.throws(() => motor.voltimetro(null), /celda/);
  assert.throws(() => motor.voltimetro(motor.pila('Zn', 'Cu'), { puente: 'papel' }), /puente/);
  assert.throws(() => motor.electrolizar('agua-salada', { Q: 10 }), /desconocido/);
  assert.throws(() => motor.electrolizar('agua-acida', { Q: -5 }), /mayor que cero/);
  assert.throws(() => motor.electrolizar('agua-acida', { I: 2 }), /tiempo/);
  assert.throws(() => motor.electrolizar('nacl-acuoso', { I: 0, s: 10 }), /mayor que cero/);
  assert.throws(() => motor.productos('nacl-fundido', 1.5), /enteros/);
  assert.throws(() => motor.productos('vinagre', 4), /desconocido/);
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
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
