// Pruebas del motor de Cinética química. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del motor
//    (regla 2 de CLAUDE.md).
// 2. Coherencia: leyes integradas contra la ley diferencial, vidas medias encadenadas, Arrhenius ida y vuelta.
//    Mecanismos (0.3.0): la suma cancela intermediarios y catalizadores y conserva los átomos, la ley sale de la
//    etapa lenta (con el equilibrio previo sustituido), el perfil de dos etapas y la velocidad media con unidades.
// 3. Las partículas: la fracción de choques A–B eficaces sigue a p·e^(−Ea/RT) (teoría de colisiones); más
//    temperatura, más concentración o catalizador dan más producto en el mismo tiempo; la energía media es R·T
//    (en dos dimensiones); los átomos se conservan.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`); else assert.deepEqual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: al menos 12 casos con nombre', () => { assert.ok(datos.casos.length >= 12); for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera); });
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
test('las leyes integradas cumplen la ley diferencial d[A]/dt = −k[A]ⁿ', () => {
  for (const n of [0, 1, 2]) {
    const k = 0.07, C0 = 0.9; let C = C0; const h = 1e-4;
    for (let t = 0; t < 5 - 1e-9; t += h) { const k1 = -k * C ** n, k2 = -k * (C + h / 2 * k1) ** n, k3 = -k * (C + h / 2 * k2) ** n, k4 = -k * (C + h * k3) ** n; C += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); }
    cerca(motor.concentracion(n, k, C0, 5), C, `orden ${n}`, 1e-8);
  }
});
test('vida media: en orden 1 no depende de [A]₀; en orden 2 la siguiente dura el doble; en orden 0, la mitad', () => {
  cerca(motor.vidaMedia(1, 0.3, 1), motor.vidaMedia(1, 0.3, 0.01), 'orden 1');
  cerca(motor.vidaMedia(2, 0.3, 0.5) / motor.vidaMedia(2, 0.3, 1), 2, 'orden 2');
  cerca(motor.vidaMedia(0, 0.3, 0.5) / motor.vidaMedia(0, 0.3, 1), 0.5, 'orden 0');
  for (const n of [0, 1, 2]) cerca(motor.concentracion(n, 0.2, 0.8, motor.vidaMedia(n, 0.2, 0.8)), 0.4, `mitad en orden ${n}`);
});
test('tiempo y concentración ida y vuelta', () => {
  for (const n of [0, 1, 2]) cerca(motor.tiempo(n, 0.05, 1, motor.concentracion(n, 0.05, 1, 7)), 7, `orden ${n}`);
});
test('Arrhenius: Ea de vuelta desde dos k y la razón de k', () => {
  const Ea = 62000, k1 = motor.arrhenius(1e10, Ea, 300), k2 = motor.arrhenius(1e10, Ea, 330);
  cerca(motor.energiaActivacion(k1, 300, k2, 330), Ea, 'Ea', 1e-9);
  cerca(k2 / k1, motor.razonK(Ea, 300, 330), 'razón');
  assert.ok(motor.razonK(0, 300, 400) === 1, 'sin barrera, la temperatura no cambia k');
});
test('el orden se lee de los datos, no de los coeficientes', () => {
  const r = motor.ordenes([{ conc: { A: 0.2, B: 0.5 }, v: 1 }, { conc: { A: 0.4, B: 0.5 }, v: 1 }, { conc: { A: 0.2, B: 1 }, v: 4 }]);
  assert.equal(r.ordenes.A, 0); assert.equal(r.ordenes.B, 2); assert.equal(r.unidades, 'L/(mol·s)');
});
test('huecos (7 nov 2026): el orden puede no ser el coeficiente y los errores de la tabla salen distintos de la correcta', () => {
  const ley = { k: 1.2, ordenes: { NO: 2, H2: 1 } }, concs = [{ NO: 0.1, H2: 0.1 }, { NO: 0.3, H2: 0.1 }, { NO: 0.1, H2: 0.2 }];
  const r = motor.ordenes(concs.map(c => ({ conc: c, v: motor.velocidad(ley, c) })), { NO: 2, H2: 2 });
  const txt = o => JSON.stringify(o);
  const leyes = [r.ordenes, r.errores.coeficientes, r.errores.proporcion, r.errores.todosUno].map(txt);
  assert.equal(new Set(leyes).size, 4, 'las cuatro leyes de las opciones son distintas');
  assert.notEqual(r.ordenes.H2, r.errores.coeficientes.H2, 'el orden de H₂ no es su coeficiente');
  for (const sp of ['NO', 'H2']) cerca(r.pares[sp].fv, Math.pow(r.pares[sp].fc, r.ordenes[sp]), `factor de ${sp}`);
  assert.throws(() => motor.ordenes(concs.map(c => ({ conc: c, v: motor.velocidad(ley, c) })), { NO: 2 }), /coeficiente/);
});
test('huecos: vidas medias seguidas encadenan con la ley integrada; en orden 1 todas iguales, en orden 2 cada una el doble', () => {
  for (const n of [0, 1, 2]) {
    const l = motor.vidasMedias(n, 0.2, 0.8, 4);
    for (const q of l) cerca(motor.concentracion(n, 0.2, 0.8, q.hasta), q.Cfin, `orden ${n} en t = ${q.hasta}`);
    for (let i = 1; i < l.length; i++) {
      cerca(l[i].desde, l[i - 1].hasta, 'seguidas');
      cerca(l[i].dura / l[i - 1].dura, n === 1 ? 1 : n === 2 ? 2 : 0.5, `razón en orden ${n}`);
    }
  }
  assert.equal(motor.vidasMedias(1, 1, 1, 0).length, 0);
});
test('huecos: lo que queda en primer orden coincide con la ley integrada; los errores dan otra cosa', () => {
  for (const [C0, th, t] of [[0.8, 10, 30], [80, 5, 20], [1, 3, 7.5]]) {
    const r = motor.primerOrdenQueda(C0, th, t);
    cerca(r.valor, motor.concentracion(1, Math.LN2 / th, C0, t), `C0 = ${C0}, t = ${t}`);
    cerca(r.errores.vidaMediaCrece, motor.concentracion(2, 1 / (C0 * th), C0, t), 'segundo orden con la misma primera t½');
    for (const e of Object.values(r.errores)) assert.ok(Math.abs(e - r.valor) > 1e-6 * C0, 'cada error da distinto de la correcta');
  }
  cerca(motor.primerOrdenQueda(0.8, 10, 10).valor, 0.4, 'una vida media');
});

// 2b. Mecanismos (0.3.0)
const MEC = {
  peroxido: [{ r: { H2O2: 1, 'I-': 1 }, p: { H2O: 1, 'IO-': 1 } }, { r: { H2O2: 1, 'IO-': 1 }, p: { H2O: 1, O2: 1, 'I-': 1 } }],
  ozonoCl: [{ r: { Cl: 1, O3: 1 }, p: { ClO: 1, O2: 1 } }, { r: { ClO: 1, O: 1 }, p: { Cl: 1, O2: 1 } }],
  no2co: [{ r: { NO2: 2 }, p: { NO3: 1, NO: 1 } }, { r: { NO3: 1, CO: 1 }, p: { NO2: 1, CO2: 1 } }],
  ozono: [{ r: { O3: 1 }, p: { O2: 1, O: 1 } }, { r: { O: 1, O3: 1 }, p: { O2: 2 } }],
  tres: [{ r: { A: 1, Z: 1 }, p: { AZ: 1 } }, { r: { AZ: 1, B: 1 }, p: { X: 1, ZB: 1 } }, { r: { ZB: 1 }, p: { Z: 1, Y: 2 } }],
};
// Suma por otro camino: átomos de cada etapa (que deben conservarse) y la global reconstruida especie por especie.
const atomos = sp => { const r = {}; for (const [, el, n] of sp.replace(/[+-]$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)) r[el] = (r[el] || 0) + (+n || 1); return r; };
const cuenta = lado => { const r = {}; for (const [sp, c] of Object.entries(lado)) for (const [el, n] of Object.entries(atomos(sp))) r[el] = (r[el] || 0) + c * n; return r; };
test('mecanismos: la suma cancela intermediarios y catalizadores y deja la global; cada etapa y la global conservan los átomos', () => {
  for (const [nombre, et] of Object.entries(MEC)) {
    const M = motor.mecanismo(et);
    for (const sp of [...M.intermediarios, ...M.catalizadores]) {
      assert.ok(!(sp in M.global.r) && !(sp in M.global.p), `${nombre}: ${sp} no debe quedar en la global`);
      assert.equal(M.tachadas[sp], et.reduce((s, e) => s + (e.r[sp] || 0), 0), `${nombre}: todas las fichas de ${sp} se tachan`);
    }
    for (const sp of M.especies) {
      const neto = et.reduce((s, e) => s + (e.p[sp] || 0) - (e.r[sp] || 0), 0);
      assert.equal((M.global.p[sp] || 0) - (M.global.r[sp] || 0), neto, `${nombre}: neto de ${sp}`);
    }
    if (nombre !== 'tres') {
      for (const e of et) assert.deepEqual(cuenta(e.r), cuenta(e.p), `${nombre}: átomos de una etapa`);
      assert.deepEqual(cuenta(M.global.r), cuenta(M.global.p), `${nombre}: átomos de la global`);
    }
    // El catalizador entra antes de salir; el intermediario sale antes de entrar.
    const primero = sp => { for (const e of et) { if (e.r[sp]) return 'r'; if (e.p[sp]) return 'p'; } };
    for (const sp of M.catalizadores) assert.equal(primero(sp), 'r');
    for (const sp of M.intermediarios) assert.equal(primero(sp), 'p');
    assert.equal(motor.mecanismo(et, M.global).coincide, true);
    assert.notDeepEqual(M.errores.intercambio.intermediarios, M.intermediarios.length ? M.intermediarios : ['—']);
  }
  const M3 = motor.mecanismo(MEC.tres);
  assert.deepEqual(M3.intermediarios, ['AZ', 'ZB']); assert.deepEqual(M3.catalizadores, ['Z']);
  assert.deepEqual(M3.global, { r: { A: 1, B: 1 }, p: { X: 1, Y: 2 } });
});
test('mecanismos: el orden de las etapas decide catalizador contra intermediario', () => {
  const inv = [MEC.ozonoCl[1], MEC.ozonoCl[0]];
  const M = motor.mecanismo(inv);
  assert.deepEqual(M.catalizadores, ['ClO']); assert.deepEqual(M.intermediarios, ['Cl']);
});
test('ley de velocidad: la de la etapa lenta; los errores dan leyes distintas de la correcta', () => {
  for (const [et, L] of [[MEC.peroxido, 1], [MEC.no2co, 1], [MEC.ozono, 2]]) {
    const l = motor.leyVelocidad(et, L), txt = o => JSON.stringify(Object.entries(o.ordenes).sort());
    for (const [k, e] of Object.entries(l.errores)) assert.notEqual(txt(e), txt(l), `error ${k} igual a la correcta`);
    cerca(l.ordenTotal, Object.values(l.ordenes).reduce((s, x) => s + x, 0), 'orden total');
    // Ningún intermediario queda en la ley.
    for (const sp of l.mecanismo.intermediarios) assert.ok(!(sp in l.ordenes));
  }
  // Con la lenta primera y sin intermediarios, la ley es la elemental de esa etapa.
  assert.deepEqual(motor.leyVelocidad(MEC.no2co, 1).ordenes, MEC.no2co[0].r);
  // Pre-equilibrio, comprobado con números: v = k2·[O][O3] con [O] = K1[O3]/[O2] da k2·K1·[O3]²/[O2].
  const k2 = 3, K1 = 0.02, O3 = 0.5, O2 = 0.8, O = K1 * O3 / O2, l = motor.leyVelocidad(MEC.ozono, 2);
  cerca(k2 * K1 * O3 ** l.ordenes.O3 * O2 ** l.ordenes.O2, k2 * O * O3, 'sustitución');
  assert.throws(() => motor.leyVelocidad(MEC.peroxido, 3), /lenta/);
  // El catalizador sí entra en la ley (su concentración cuenta); no se sustituye.
  assert.deepEqual(motor.leyVelocidad([{ r: { A: 1, X: 1 }, p: { B: 1 } }, { r: { B: 1 }, p: { X: 1, C: 1 } }], 1).ordenes, { A: 1, X: 1 });
});
test('perfil de dos etapas: Ea desde cada valle, ΔH = suma de los dos desniveles; las lecturas erradas dan otros números', () => {
  for (const o of [{ R: 40, TS1: 100, I: -10, TS2: 75, P: -50 }, { R: 0, TS1: 70, I: -20, TS2: 80, P: 30 }, { R: 10, TS1: 95, I: -15, TS2: 30, P: -60 }]) {
    const p = motor.perfilDosEtapas(o);
    cerca(p.dH, p.dH1 + p.dH2, 'ΔH'); cerca(p.Ea1 - p.EaInv1, p.dH1, 'etapa 1'); cerca(p.Ea2 - p.EaInv2, p.dH2, 'etapa 2');
    assert.equal(p.lenta, p.Ea1 > p.Ea2 ? 1 : 2);
    assert.ok(p.valleBajo);
    const leidas = [[p.Ea1, p.Ea2], ...['desdeCero', 'desdeReactivos', 'inversa'].map(k => [p.errores[k].Ea1, p.errores[k].Ea2])].map(String);
    assert.ok(new Set(leidas).size >= 3, 'las lecturas no coinciden todas');
  }
  assert.throws(() => motor.perfilDosEtapas({ R: 0, TS1: -5, I: -10, TS2: 20, P: 0 }), /cima 1/);
});
test('velocidad media: 1 mg/mL = 1 g/L = 1 kg/m³; la secante coincide con la interpolación; el signo dice si baja', () => {
  const C = [[0, 0], [1, 0.08], [2, 0.12], [3, 0.09], [4, 0.07], [5, 0.06], [6, 0.05]];
  for (const a of ['g/L', 'kg/m3', 'mg/mL']) cerca(motor.velocidadMedia(C, 2, 5, { de: 'mg/mL', a, tiempo: 'h' }).valor, -0.02, a);
  cerca(motor.velocidadMedia(C, 2, 5, { de: 'mg/mL', a: 'mg/L', tiempo: 'h' }).valor, -20, 'mg/L');
  cerca(motor.velocidadMedia(C, 2, 5, { de: 'mg/mL', a: 'kg/m3', tiempo: 'h', tiempoA: 's' }).valor, -0.02 / 3600, 'por segundo');
  const v = motor.velocidadMedia(C, 2, 5, { de: 'mg/mL', a: 'kg/m3', tiempo: 'h' });
  for (const e of Object.values(v.errores)) assert.ok(Math.abs(e - v.valor) > 1e-12, 'cada error da distinto');
  cerca(motor.velocidadMedia(C, 5, 2).valor, motor.velocidadMedia(C, 2, 5).valor, 'simétrica');
  cerca(motor.velocidadMedia(C, 1.5, 2).c1, 0.1, 'interpolación');
  assert.throws(() => motor.velocidadMedia(C, 0, 9), /fuera/);
  assert.throws(() => motor.velocidadMedia(C, 0, 1, { de: 'mg/mL', a: 'mol/L' }), /pasar/);
});

// 3. Partículas
const correr = (c, s) => { for (let i = 0; i < Math.round(s * 60); i++) c.paso(1 / 60); return c; };
test('teoría de colisiones: la fracción de choques A–B eficaces es p·e^(−Ea/RT)', () => {
  for (const [T, Ea, orientacion] of [[300, 5000, false], [600, 5000, false], [300, 2500, true]]) {
    let ab = 0, ef = 0, teo = 0;
    for (const semilla of [1, 2, 3, 4]) {
      const c = correr(motor.caja({ nA: 40, nB: 40, T, Ea, orientacion, reaccionar: false, semilla }), 2);
      c.reiniciarCuenta(); correr(c, 30);
      ab += c.cuenta.choquesAB; ef += c.cuenta.eficaces; teo = c.fraccionTeorica();
    }
    // Con discos que chocan de verdad y un paso de tiempo finito queda una diferencia de unos pocos por ciento.
    cerca(ef / ab, teo, `T = ${T}, Ea = ${Ea}, orientación ${orientacion}`, 0.08);
  }
});
test('con orientación y sin barrera, dos tercios de los choques A–B están mal orientados', () => {
  const c = correr(motor.caja({ nA: 40, nB: 40, Ea: 0, reaccionar: false, semilla: 4 }), 40);
  cerca(c.cuenta.malOrientados / c.cuenta.choquesAB, 2 / 3, 'mal orientados', 0.08);
});
test('la energía media de traslación es R·T (en dos dimensiones) y sube con T', () => {
  const c = correr(motor.caja({ nA: 60, nB: 60, T: 300, reaccionar: false, semilla: 6 }), 5);
  let s = 0; for (let i = 0; i < 40; i++) { correr(c, 0.25); s += c.energiaMedia(); }
  cerca(s / 40, motor.R * 300, 'E media', 0.1);
});
const producto = (o, s) => { let t = 0; for (const semilla of [1, 2, 3, 4, 5, 6]) { const c = motor.caja({ ...o, semilla }); if (o.cat) c.catalizador(o.cat); t += correr(c, s).contar().C; } return t / 6; };
test('más temperatura, más producto en el mismo tiempo', () => {
  assert.ok(producto({ nA: 30, nB: 30, T: 500 }, 5) > producto({ nA: 30, nB: 30, T: 300 }, 5) * 1.25);
});
test('el catalizador (menos Ea) da más producto en el mismo tiempo', () => {
  assert.ok(producto({ nA: 30, nB: 30, cat: 2000 }, 2) > producto({ nA: 30, nB: 30 }, 2) * 1.6); // a los 2 s, antes de que se gasten
});
test('el doble de A, cerca del doble de choques A–B', () => {
  let a = 0, b = 0;
  for (const semilla of [1, 2, 3]) {
    a += correr(motor.caja({ nA: 20, nB: 20, reaccionar: false, semilla }), 20).cuenta.choquesAB;
    b += correr(motor.caja({ nA: 40, nB: 20, reaccionar: false, semilla }), 20).cuenta.choquesAB;
  }
  cerca(b / a, 2, 'razón de choques', 0.2);
});
test('la caja que reacciona no se enfría: la energía media sigue cerca de R·T', () => {
  const c = correr(motor.caja({ nA: 30, nB: 30, T: 400, semilla: 3 }), 2);
  let s = 0; for (let i = 0; i < 40; i++) { correr(c, 0.25); s += c.energiaMedia(); }
  cerca(s / 40, motor.R * 400, 'E media reaccionando', 0.1);
  assert.ok(c.contar().C > 5, 'reaccionó');
});
test('los discos nacen sin encimarse', () => {
  const c = motor.caja({ nA: 30, nB: 30, semilla: 9 }), l = c.parts;
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) assert.ok(Math.hypot(l[i].x - l[j].x, l[i].y - l[j].y) >= 2 * c.r - 1e-12);
});
test('se conserva la materia: A + C y B + C no cambian; todo sigue dentro de la caja', () => {
  const c = correr(motor.caja({ nA: 25, nB: 20, T: 450, semilla: 8 }), 20), n = c.contar();
  assert.equal(n.A + n.C, 25); assert.equal(n.B + n.C, 20); assert.ok(n.C > 0);
  for (const p of c.parts) assert.ok(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
});
test('calentar a mano escala las rapideces con √T', () => {
  const c = motor.caja({ nA: 10, nB: 10, reaccionar: false, semilla: 2 }), e0 = c.energiaMedia();
  c.temperatura(600); cerca(c.energiaMedia() / e0, 2, 'energía al doble de T');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.velocidad({ k: 1, ordenes: { A: 1 } }, {}), /falta/);
  assert.throws(() => motor.ordenes([{ conc: { A: 1 }, v: 1 }]), /dos experimentos/);
  assert.throws(() => motor.ordenes([{ conc: { A: 1, B: 1 }, v: 1 }, { conc: { A: 2, B: 2 }, v: 4 }]), /solo cambie/);
  assert.throws(() => motor.concentracion(3, 1, 1, 1), /orden/);
  assert.throws(() => motor.tiempo(1, 1, 0.5, 0.8), /mayor/);
  assert.throws(() => motor.perfil({ Ea: 50, dH: -20, EaCat: 60 }), /no sube/);
  assert.throws(() => motor.energiaActivacion(1, 300, 2, 300), /distintas/);
  assert.throws(() => motor.caja({ nA: 1 }).agregar('C', 1), /solo/);
  assert.throws(() => motor.primerOrdenQueda(1, 0, 1), /vida media/);
  assert.throws(() => motor.vidasMedias(3, 1, 1, 2), /orden/);
});

// 5. Problemas de papel (regla 6)
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
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
