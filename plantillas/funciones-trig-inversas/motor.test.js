// Pruebas del motor de «Una sola respuesta». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - arcsen, arccos, arctan y arccot coinciden con Math y caen en su rango; fn(arcfn k) = k;
//    - las identidades: arcsen(−k) = −arcsen k, arccos(−k) = π − arccos k, arctan(−k) = −arctan k,
//      arcsen k + arccos k = π/2, arccot k = π/2 − arctan k;
//    - los cortes cumplen fn θ = k, están en el intervalo y uno solo es el principal;
//    - arcfn(fn φ) cae en el rango y tiene la misma razón que φ; las compuestas con Math; el dominio con dentro();
//      arctan a + arctan b con Math y la dirección de la cuadrícula;
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
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === '=' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.ok(espera && typeof espera === 'object' && !Array.isArray(espera), `${que}: 'espera' debe ser un objeto`);
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'funciones-trig-inversas');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera && typeof c.espera === 'object', JSON.stringify(c).slice(0, 80));
    for (const t of c.tambien || []) assert.ok(t.espera && typeof t.espera === 'object' && !Array.isArray(t.espera), `${c.nombre}: 'espera' de 'tambien' debe ser un objeto`);
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
const N = 300;
const GR = Math.PI / 180;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const NOTABLES_SC = ['0', '1/2', '√2/2', '√3/2', '1', '3/5', '4/5', '7/25', '24/25'];
const NOTABLES_T = ['0', '√3/3', '1', '√3', '3/4', '4/3', '7/24', '24/7'];
const conSigno = xs => xs.flatMap(t => (t === '0' ? [t] : [t, '-' + t]));
const fraccionAzar = () => { const q = ent(2, 30), p = ent(-q, q); return `${p}/${q}`; };
const f = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => Math.cos(x) / Math.sin(x) };
const arcM = { sen: Math.asin, cos: Math.acos, tan: Math.atan, cot: k => Math.PI / 2 - Math.atan(k) };
const enRango = (fn, x) => { const R = motor.RANGO[fn], a = R.de * GR, b = R.a * GR;
  return R.abierto ? x > a - 1e-12 && x < b + 1e-12 && Math.abs(x - a) > 1e-12 && Math.abs(x - b) > 1e-12 : x >= a - 1e-12 && x <= b + 1e-12; };

test('las inversas coinciden con Math, caen en su rango y deshacen a la directa', () => {
  assert.deepEqual(Object.keys(motor.RANGO), ['sen', 'cos', 'tan', 'cot']);
  const ks = { sen: conSigno(NOTABLES_SC), cos: conSigno(NOTABLES_SC), tan: conSigno(NOTABLES_T), cot: conSigno(NOTABLES_T) };
  for (const fn of motor.RANGO ? Object.keys(motor.RANGO) : []) {
    const lista = ks[fn].concat(Array.from({ length: N }, () => (fn === 'sen' || fn === 'cos' ? fraccionAzar() : `${ent(-60, 60)}/${ent(1, 9)}`)));
    for (const k of lista) {
      const A = motor.arco({ fn, k }), v = motor.exacto(k).valor;
      assert.ok(A.existe, `${fn} ${k}`);
      cerca(A.valor, arcM[fn](v), `arc${fn} ${k}`);
      assert.ok(enRango(fn, A.valor), `arc${fn} ${k} en su rango`);
      if (!(fn === 'cot' && v === 0)) cerca(f[fn](A.valor), v, `${fn}(arc${fn} ${k}) = ${k}`, 1e-9);
      if (A.academia) assert.ok(Math.abs(A.angulo.grados - A.angulo.gradosReal) < 1, `${fn} ${k}: la de academia está a menos de 1° de la de verdad`);
      else if (A.exacto) cerca(A.angulo.grados * GR, A.valor, `${fn} ${k}: grados exactos y radianes`);
    }
  }
  for (const k of ['2', '-3/2', '1001/1000']) for (const fn of ['sen', 'cos']) assert.equal(motor.arco({ fn, k }).existe, false, `arc${fn} ${k} no existe`);
});
test('propiedades: impar, π − arccos, π/2 y arccot', () => {
  const ks = conSigno(NOTABLES_SC).concat(Array.from({ length: N }, fraccionAzar));
  for (const k of ks) {
    const v = motor.exacto(k).valor, mk = String(-v);
    const S = motor.arco({ fn: 'sen', k }), Sm = motor.arco({ fn: 'sen', k: -v }), C = motor.arco({ fn: 'cos', k }), Cm = motor.arco({ fn: 'cos', k: -v });
    cerca(Sm.valor, -S.valor, `arcsen(−${k}) = −arcsen ${k}`);
    cerca(Cm.valor, Math.PI - C.valor, `arccos(−${k}) = π − arccos ${k}`);
    cerca(S.valor + C.valor, Math.PI / 2, `arcsen + arccos (${k})`);
    cerca(motor.sumaSenCos({ k }).valor, Math.PI / 2, `sumaSenCos ${k}`);
    void mk;
  }
  for (let i = 0; i < N; i++) {
    const k = `${ent(-80, 80)}/${ent(1, 12)}`, v = motor.exacto(k).valor;
    cerca(motor.arco({ fn: 'tan', k: -v }).valor, -motor.arco({ fn: 'tan', k }).valor, `arctan(−${k})`);
    cerca(motor.arco({ fn: 'cot', k }).valor, Math.PI / 2 - motor.arco({ fn: 'tan', k }).valor, `arccot ${k}`);
    if (v !== 0) cerca(motor.arco({ fn: 'cot', k: -v }).valor, Math.PI - motor.arco({ fn: 'cot', k }).valor, `arccot(−${k})`);
  }
});
test('cortes: todos cumplen fn θ = k, están en el intervalo, sin repetir, y uno solo es el principal', () => {
  for (let i = 0; i < N; i++) {
    const fn = elegir(['sen', 'cos', 'tan']), k = fn === 'tan' ? elegir(conSigno(NOTABLES_T).concat([`${ent(-9, 9)}/${ent(1, 5)}`])) : elegir(conSigno(NOTABLES_SC).concat([fraccionAzar()]));
    const desde = ent(-2, 1) * 180, hasta = desde + ent(1, 4) * 180;
    const C = motor.cortes({ fn, k, desde, hasta }), v = motor.exacto(k).valor;
    for (const x of C.lista) {
      assert.ok(x.grados >= desde - 1e-9 && x.grados < hasta - 1e-9, `${fn} ${k}: ${x.grados} en [${desde}; ${hasta}⟩`);
      cerca(f[fn](x.rad), v, `${fn} de un corte (${k})`, 1e-9);
    }
    for (let j = 1; j < C.lista.length; j++) assert.ok(C.lista[j].grados > C.lista[j - 1].grados + 1e-6, 'en orden y sin repetir');
    const P = motor.arco({ fn, k });
    const dentro = P.angulo.grados >= desde - 1e-9 && P.angulo.grados < hasta - 1e-9;
    assert.equal(C.lista.filter(x => x.principal).length, dentro ? 1 : 0, `${fn} ${k}: un solo principal`);
    // cuántos: en un periodo completo, 2 para sen y cos (salvo ±1), 1 para tan
    const per = fn === 'tan' ? 180 : 360, n = (hasta - desde) / per;
    if (Number.isInteger(n) && fn !== 'tan' && Math.abs(v) < 1) assert.equal(C.cuantos, 2 * n, `${fn} ${k} en ${n} periodo(s)`);
    if (Number.isInteger(n) && fn === 'tan') assert.equal(C.cuantos, n, `tan ${k} en ${n} periodo(s)`);
  }
});
test('arcoDe: cae en el rango, tiene la misma razón que φ y es φ solo si φ ya estaba en el rango', () => {
  for (let i = 0; i < N; i++) {
    const fn = elegir(['sen', 'cos', 'tan', 'cot']), phi = ent(-720, 720);
    const r = motor.arcoDe({ fn, grados: phi });
    if (!r.existe) { assert.ok(Math.abs(Math.cos(phi * GR) * (fn === 'tan' ? 1 : 0)) < 1e-9 || Math.abs(Math.sin(phi * GR) * (fn === 'cot' ? 1 : 0)) < 1e-9, `${fn} ${phi}° no existe`); continue; }
    assert.ok(enRango(fn, r.valor * GR), `arc${fn}(${fn} ${phi}°) = ${r.valor} en el rango`);
    cerca(f[fn](r.valor * GR), f[fn](phi * GR), `misma razón (${fn} ${phi}°)`, 1e-9);
    assert.equal(r.igual, enRango(fn, phi * GR), `igual (${fn} ${phi}°)`);
  }
});
test('ventana: solo las ventanas de un tramo creciente o decreciente completo sirven', () => {
  for (let i = 0; i < N; i++) {
    const fn = elegir(['sen', 'cos']), desde = ent(-12, 12) * 15, hasta = desde + ent(1, 24) * 15;
    const V = motor.ventana({ fn, desde, hasta });
    const base = fn === 'sen' ? -90 : 0, exacta = hasta - desde === 180 && (desde - base) % 180 === 0;
    assert.equal(V.sirve, exacta, `${fn} [${desde}; ${hasta}]`);
    if (V.repetido) assert.ok(V.repetido.cortes.length >= 2);
    if (V.falta) { const k = motor.exacto(V.falta.k).valor; assert.ok(k < V.min - 1e-9 || k > V.max + 1e-9); }
  }
});
test('compuestas, dominio y suma de arctan contra Math', () => {
  const EXT = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'], g = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) };
  for (let i = 0; i < N; i++) {
    const inv = elegir(['sen', 'cos', 'tan']), ext = elegir(EXT), k = inv === 'tan' ? `${ent(-20, 20)}/${ent(1, 9)}` : fraccionAzar();
    const C = motor.compuesta({ ext, inv, k }), th = arcM[inv](motor.exacto(k).valor);
    if (!C.existe) { assert.ok(Math.abs(g[ext](th)) > 1e6 || !Number.isFinite(g[ext](th)), `${ext}(arc${inv} ${k}) no existe`); continue; }
    cerca(C.valor, g[ext](th), `${ext}(arc${inv} ${k})`, 1e-9);
    cerca(C.lados.op.valor ** 2 + C.lados.ady.valor ** 2, C.lados.hip.valor ** 2, 'Pitágoras', 1e-9);
  }
  for (let i = 0; i < N; i++) {
    const fn = elegir(['sen', 'cos']), a = `${elegir([-1, 1]) * ent(1, 6)}/${ent(1, 4)}`, b = `${ent(-6, 6)}/${ent(1, 4)}`;
    const D = motor.dominio({ fn, a, b });
    for (let j = 0; j < 20; j++) {
      const x = D.de - 1 + (D.a - D.de + 2) * j / 19;
      const r = motor.dentro({ fn, a, b, x });
      assert.equal(r.dentro, x >= D.de - 1e-12 && x <= D.a + 1e-12, `${fn}(${a}x + ${b}) con x = ${x}`);
    }
  }
  for (let i = 0; i < N; i++) {
    const a = `${ent(-9, 9)}/${ent(1, 9)}`, b = `${ent(-9, 9)}/${ent(1, 9)}`;
    const S = motor.sumaTan({ a, b }), real = Math.atan(motor.exacto(a).valor) + Math.atan(motor.exacto(b).valor);
    cerca(S.valor, real, `arctan ${a} + arctan ${b}`);
    if (S.direccion[0] || S.direccion[1]) cerca(Math.atan2(S.direccion[1], S.direccion[0]), real, 'la dirección de la cuadrícula', 1e-9);
  }
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
const ID_OK = id => /^(TR\d+|IN\d+)$/.test(id) && motor.ERRORES[id];
function sinChoques(r, que) {
  if (!r || r.existe === false) return;
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(ID_OK(e.id), `${que}: el error ${k} no tiene id del catálogo`);
    if (e.lista) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} da la misma lista`);
    else if (e.de !== undefined) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} da el mismo intervalo`);
    else {
      const correcta = r.valor !== undefined ? r.valor : r.angulo.rad;
      const valE = e.valor !== undefined ? e.valor : e.rad;
      // arcoDe da grados en 'valor'
      const vE = r.grados !== undefined && r.angulo && r.valor === r.angulo.grados ? e.grados : valE;
      assert.ok(!casi(vE, correcta), `${que}: el error ${k} da lo mismo que la correcta (${r.texto})`);
      if (e.textoArctan) assert.notEqual(e.textoArctan, r.textoArctan, `${que}: el error ${k} se escribe igual que la correcta`);
      else if (r.texto && e.texto) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    }
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) {
    if (['textoRad', 'textoGrados', 'exacto', 'muestras', 'ventana', 'dentro'].includes(c.fn)) continue;
    sinChoques(llamar(c.fn, c.args), c.nombre);
    for (const t of c.tambien || []) if (!['textoGrados', 'exacto', 'dentro'].includes(t.fn || c.fn)) sinChoques(llamar(t.fn || c.fn, t.args), c.nombre);
  }
  for (let i = 0; i < N; i++) {
    const fn = elegir(['sen', 'cos', 'tan', 'cot']);
    const k = fn === 'sen' || fn === 'cos' ? elegir(conSigno(NOTABLES_SC).concat([fraccionAzar(), String(ent(-99, 99) / 100)])) : elegir(conSigno(NOTABLES_T).concat([`${ent(-50, 50)}/${ent(1, 7)}`]));
    sinChoques(motor.arco({ fn, k }), `arc${fn} ${k}`);
    sinChoques(motor.cortes({ fn: elegir(['sen', 'cos', 'tan']), k: elegir(conSigno(NOTABLES_SC)), desde: 0, hasta: 360 }), 'cortes');
    sinChoques(motor.arcoDe({ fn, grados: ent(-720, 720) }), `arcoDe ${fn}`);
    const inv = elegir(['sen', 'cos', 'tan']);
    sinChoques(motor.compuesta({ ext: elegir(['sen', 'cos', 'tan', 'cot', 'sec', 'csc']), inv, k: inv === 'tan' ? `${ent(-20, 20)}/${ent(1, 9)}` : fraccionAzar() }), 'compuesta');
    sinChoques(motor.dominio({ fn: elegir(['sen', 'cos']), a: `${elegir([-1, 1]) * ent(1, 6)}/${ent(1, 4)}`, b: `${ent(-6, 6)}/${ent(1, 4)}` }), 'dominio');
    sinChoques(motor.sumaSenCos({ k: fraccionAzar() }), 'sumaSenCos');
    const kk = elegir(['1/2', '√2/2', '√3/2', '-1/2', '3/5', fraccionAzar()]);
    if (motor.exacto(kk).valor !== 0) sinChoques(motor.notacion({ fn: elegir(['sen', 'cos']), k: kk }), 'notacion');
    sinChoques(motor.sumaTan({ a: `${ent(-9, 9)}/${ent(1, 9)}`, b: `${ent(-9, 9)}/${ent(1, 9)}` }), 'sumaTan');
  }
  // lo que se arrastra en la escena: la recta y = k en el paso 1 y 2 (k de −1 a 1 de 0,01 en 0,01)
  for (let j = -100; j <= 100; j++) sinChoques(motor.arco({ fn: 'sen', k: j / 100 }), `arcsen ${j / 100}`);
});

// Las predicciones de la escena (index.html): respuesta del motor, opciones distintas y con la misma forma.
const ER = (r, ...ks) => [r.texto, ...ks.map(k => { assert.ok(r.errores[k], `falta el error ${k}`); return r.errores[k].texto; })];
const FORMAS = {
  listaRad: /^(−?\d*π(\/\d+)?|0)((, | y )(−?\d*π(\/\d+)?|0))*$/,
  rad: /^(−?\d*π(\/\d+)?|0)$/,
  grados: /^(≈ )?−?\d+(,\d+)?°$/,
  numero: /^−?(\d+|\d*√\d+)(\/\d+)?$/,
  decimal: /^(≈ )?−?\d+(,\d+)?( rad)?$/,
  intervalo: /^\[−?\d+(\/\d+)?; −?\d+(\/\d+)?\]$/,
  arctan: /^arctan\(−?\d+(\/\d+)?\)$/
};
const C1 = motor.cortes({ fn: 'sen', k: '1/2', desde: 0, hasta: 360 });
const T1000 = motor.arco({ fn: 'tan', k: 1000 }), ST = motor.sumaTan({ a: '1/2', b: '1/3' });
const SC = motor.sumaSenCos({ k: '0,3' }), NO = motor.notacion({ fn: 'sen', k: '1/2' });
const ESCENA = {
  paso1: ['listaRad', () => ER(C1, 'una', 'sinSigno', 'comoCoseno')],
  paso2: ['rad', () => ER(motor.arco({ fn: 'sen', k: '-1/2' }), 'fueraDelRango', 'vueltaPositiva', 'sinSigno')],
  paso3: ['grados', () => ER(motor.arcoDe({ fn: 'sen', grados: 150 }), 'siempre', 'complemento', 'signo')],
  paso4: ['rad', () => ER(motor.arco({ fn: 'cos', k: '-1/2' }), 'negativo', 'fueraDelRango', 'sinSigno')],
  paso5: ['numero', () => ER(motor.compuesta({ ext: 'cos', inv: 'sen', k: '3/5' }), 'cancela', 'sinRaiz', 'reciproca')],
  paso6: ['rad', () => ER(motor.arco({ fn: 'cot', k: '-1' }), 'arctanInverso', 'sinSigno', 'fueraDelRango')],
  paso7: ['decimal', () => [SC.decimal, SC.errores.suplementarios.decimal, SC.errores.seAnulan.decimal, SC.errores.iguales.decimal]],
  paso8: ['intervalo', () => ER(motor.dominio({ fn: 'sen', a: '2', b: '-1' }), 'copia', 'signoB', 'sinDividir')],
  'coseno-de-un-negativo': ['grados', () => ER(motor.arcoDe({ fn: 'cos', grados: -60 }), 'siempre', 'vuelta', 'impar')],
  'tangente-enorme': ['grados', () => [T1000.textoG, T1000.errores.rangoCerrado.textoG, T1000.errores.comoCot.textoG, T1000.errores.mezcla.textoG]],
  'lo-que-dice-el-exponente': ['decimal', () => [NO.decimal, NO.errores.reciprocoNumero.decimal, NO.errores.reciprocaFuncion.decimal, NO.errores.otraInversa.decimal]],
  'dos-arcos-tangentes': ['arctan', () => [ST.textoArctan, ST.errores.lineal.textoArctan, ST.errores.signoDen.textoArctan, ST.errores.producto.textoArctan]]
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [id, [forma, fn]] of Object.entries(ESCENA)) {
    const ops = fn();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    for (const t of ops) assert.ok(FORMAS[forma].test(t), `${id}: «${t}» no tiene la forma ${forma}`);
    assert.ok(html.includes(`'${id}'`) || html.includes(`funciones-trig-inversas-${id}`), `${id}: la escena no la usa`);
  }
  // la ventana [0; π] del experimento 1 no sirve: repite 1/2 y no llega a −1/2
  const V = motor.ventana({ fn: 'sen', desde: 0, hasta: 180 });
  assert.ok(!V.sirve && !V.inyectiva && !V.cubre);
  assert.ok(html.includes(`'otra-ventana'`), 'otra-ventana: la escena no la usa');
  // ningún «solo» en las opciones (todas con la misma forma)
  const opciones = [...html.matchAll(/\['[a-d]', ('|`)([^'`]*)\1/g)].map(m => m[2]);
  for (const t of opciones) assert.ok(!/\bsolo\b/i.test(t), `opción con «solo»: ${t}`);
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.arco({ fn: 'seno', k: '1/2' }), /desconocida/);
  assert.throws(() => motor.arco({ fn: 'sen', k: 'un medio' }), /número exacto/);
  assert.throws(() => motor.arco({ fn: 'sen', k: '1/0' }), /cero/);
  assert.throws(() => motor.arco({ fn: 'sen', k: NaN }), /número/);
  assert.throws(() => motor.cortes({ fn: 'sen', k: '1/2', desde: 90, hasta: 0 }), /mayor/);
  assert.throws(() => motor.arcoDe({ fn: 'sen', grados: 'ciento cincuenta' }), /número/);
  assert.throws(() => motor.ventana({ fn: 'tan', desde: 0, hasta: 90 }), /desconocida/);
  assert.throws(() => motor.compuesta({ ext: 'sen', inv: 'cot', k: '1' }), /desconocida/);
  assert.throws(() => motor.compuesta({ ext: 'sen', inv: 'sen', k: 0.123456789 }), /exacto/);
  assert.equal(motor.compuesta({ ext: 'sen', inv: 'cos', k: '3/2' }).existe, false);
  assert.throws(() => motor.dominio({ fn: 'sen', a: '0', b: '1' }), /a no puede ser 0/);
  assert.throws(() => motor.dominio({ fn: 'sen', a: '√2', b: '1' }), /racional/);
  assert.throws(() => motor.sumaSenCos({ k: '3/2' }), /entre −1 y 1/);
  assert.throws(() => motor.notacion({ fn: 'sen', k: '2' }), /fuera/);
  assert.throws(() => motor.sumaTan({ a: '√3', b: '1' }), /racional/);
  assert.throws(() => motor.textoRad(12.5), /enteros/);
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
