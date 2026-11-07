// Pruebas del motor de El átomo y la tabla periódica. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: los electrones de la configuración suman Z − carga; ninguna subcapa pasa su capacidad; Hund y Pauli
//    en las cajas; las únicas excepciones son las declaradas; el catión nunca conserva un 4s si perdió un 3d; las
//    tendencias de los datos de tabla (radio y energía de ionización en períodos y grupos); la ubicación coincide con
//    la casilla; ningún error típico coincide con la respuesta en las predicciones de la escena.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que) {
  assert.ok(Math.abs(real - esperado) <= TOL * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    if (typeof v === 'number') { assert.equal(typeof x, 'number', `${que} · ${k}`); cerca(x, v, `${que} · ${k}`); }
    else assert.deepEqual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: al menos 20 casos con nombre y la verificación pendiente o hecha', () => {
  assert.ok(datos.casos.length >= 20);
  assert.equal(typeof datos.verificacion, 'string');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera && Array.isArray(c.args));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const CAP = l => 2 * (2 * l + 1);
const suma = c => c.subcapas.reduce((t, s) => t + s.e, 0);
test('la configuración tiene Z − carga electrones y ninguna subcapa pasa su capacidad (Z = 1 a 86, cargas −3 a +3)', () => {
  for (let Z = 1; Z <= 86; Z++) for (let q = -3; q <= 3; q++) {
    if (Z - q < 0) continue;
    const c = motor.configuracion(Z, q);
    assert.equal(suma(c), Z - q, `Z ${Z}, carga ${q}`);
    for (const s of c.subcapas) assert.ok(s.e > 0 && s.e <= CAP(s.l), `Z ${Z}, carga ${q}: ${s.nombre}${s.e}`);
  }
});
test('solo Cr, Cu, Mo, Ag y Au se apartan de Möller; el Ni, el V y el Pd no', () => {
  const excep = [];
  for (let Z = 1; Z <= 86; Z++) if (motor.configuracion(Z).excepcion) excep.push(motor.SIMBOLOS[Z]);
  assert.deepEqual(excep, ['Cr', 'Cu', 'Mo', 'Ag', 'Au']);
  assert.equal(motor.configuracion('V').abreviada, '[Ar] 4s2 3d3');
  assert.equal(motor.configuracion('Pd').abreviada, '[Kr] 5s2 4d8');
});
test('Hund y Pauli: cada caja tiene a lo más dos flechas opuestas, y no se aparea hasta llenar todas con una', () => {
  for (let Z = 1; Z <= 36; Z++) for (const q of [0, 1, 2, 3, -1, -2]) {
    if (Z - q < 0) continue;
    const cj = motor.cajas(Z, q);
    let desap = 0;
    for (const s of cj.subcapas) {
      const arriba = s.orbitales.filter(o => o.arriba).length, abajo = s.orbitales.filter(o => o.abajo).length;
      assert.equal(arriba + abajo, s.e);
      for (const o of s.orbitales) assert.ok(!o.abajo || o.arriba, `Z ${Z}: flecha abajo sin la de arriba`);
      if (abajo > 0) assert.equal(arriba, s.orbitales.length, `Z ${Z}: apareó antes de llenar las cajas`);
      desap += arriba - abajo;
    }
    assert.equal(desap, cj.desapareados, `Z ${Z}, carga ${q}`);
    assert.equal(motor.configuracion(Z, q).paramagnetico, desap > 0);
  }
});
test('en un catión de transición del período 4, los 4s salen antes que cualquier 3d', () => {
  for (let Z = 21; Z <= 30; Z++) for (let q = 1; q <= 3; q++) {
    const c = motor.configuracion(Z, q), s4 = c.subcapas.find(s => s.nombre === '4s');
    const d0 = motor.configuracion(Z).subcapas.find(s => s.nombre === '3d').e, d = (c.subcapas.find(s => s.nombre === '3d') || { e: 0 }).e;
    if (d < d0) assert.ok(!s4, `Z ${Z}, carga ${q}: perdió un 3d y conserva el 4s`);
  }
});
test('el último electrón y el que sale tienen números cuánticos válidos (|mₗ| ≤ l < n, mₛ = ±1/2)', () => {
  for (let Z = 1; Z <= 36; Z++) for (const f of ['ultimoElectron', 'electronQueSale']) {
    const e = motor[f](Z);
    assert.ok(e.l < e.n && Math.abs(e.ml) <= e.l && Math.abs(Math.abs(e.ms) - 0.5) < 1e-12, `${f} Z ${Z}`);
  }
});
test('los niveles suman los electrones', () => {
  for (let Z = 1; Z <= 36; Z++) for (const q of [0, 2, -1]) if (Z - q >= 0) assert.equal(motor.niveles(Z, q).reduce((a, b) => a + b, 0), Z - q);
});
test('ubicación: cada casilla del período 1 a 4 tiene un solo elemento, y enCasilla la devuelve', () => {
  const vistas = new Set();
  for (let Z = 1; Z <= 36; Z++) {
    const u = motor.ubicacion(Z), k = `${u.periodo}-${u.grupo}`;
    assert.ok(!vistas.has(k), `casilla repetida ${k}`); vistas.add(k);
    assert.equal(motor.enCasilla(u.periodo, u.grupo).Z, Z);
    assert.ok(u.grupo >= 1 && u.grupo <= 18);
  }
  assert.equal(vistas.size, 36);
  const grupos = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 17: 'VIIA', 18: 'VIIIA', 3: 'IIIB', 8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB', 11: 'IB', 12: 'IIB' };
  for (let Z = 1; Z <= 36; Z++) { const u = motor.ubicacion(Z); if (grupos[u.grupo]) assert.equal(u.grupoAB, grupos[u.grupo], u.simbolo); }
});
test('tendencias de los datos: en los períodos 2 y 3 el radio baja con Z; en los grupos 1, 2, 17 y 18 sube con el período', () => {
  for (const [a, b] of [[3, 10], [11, 18], [19, 36]]) for (let Z = a; Z < b; Z++) assert.ok(motor.RADIO[Z] > motor.RADIO[Z + 1], `radio ${Z}`);
  for (const g of [[1, 3, 11, 19], [4, 12, 20], [9, 17, 35], [2, 10, 18, 36]]) for (let i = 0; i + 1 < g.length; i++) assert.ok(motor.RADIO[g[i]] < motor.RADIO[g[i + 1]], `grupo ${g}`);
});
test('energía de ionización: sube en el período con solo dos bajadas (2→13 y 15→16) en los períodos 2 y 3, y baja en los grupos', () => {
  for (const [a, b] of [[3, 10], [11, 18]]) for (let Z = a; Z < b; Z++) {
    const g = motor.ubicacion(Z).grupo, baja = motor.EI[Z + 1] < motor.EI[Z];
    assert.equal(baja, g === 2 || g === 15, `EI de ${motor.SIMBOLOS[Z]} a ${motor.SIMBOLOS[Z + 1]}`);
  }
  for (const g of [[3, 11, 19], [9, 17, 35], [2, 10, 18, 36]]) for (let i = 0; i + 1 < g.length; i++) assert.ok(motor.EI[g[i]] > motor.EI[g[i + 1]], `grupo ${g}`);
  for (const [a, b] of [['N', 'O'], ['P', 'S'], ['Be', 'B'], ['Mg', 'Al']]) assert.equal(motor.compararEI(a, b).mayor, a);
  assert.equal(motor.compararEI('N', 'O').razon, 'apareado');
  assert.equal(motor.compararEI('Be', 'B').razon, 'subcapa-nueva');
  assert.equal(motor.compararEI('Na', 'Mg').razon, 'mas-protones');
});
test('electronegatividad: sube en el período y baja en el grupo; los gases nobles no tienen valor', () => {
  for (const [a, b] of [[3, 9], [11, 17]]) for (let Z = a; Z < b; Z++) assert.ok(motor.EN[Z] < motor.EN[Z + 1], `EN ${Z}`);
  for (const g of [[3, 11, 19], [9, 17, 35]]) for (let i = 0; i + 1 < g.length; i++) assert.ok(motor.EN[g[i]] > motor.EN[g[i + 1]]);
  for (const Z of [2, 10, 18, 36]) assert.equal(motor.EN[Z], null);
  assert.throws(() => motor.ordenar(['Ne', 'F'], 'en'), /no tiene valor/);
});
test('mapa: 36 casillas con t entre 0 y 1; el extremo de cada propiedad es el esperado', () => {
  for (const [p, max, min] of [['ei', 'He', 'K'], ['radio', 'K', 'He'], ['en', 'F', 'K']]) {
    const m = motor.mapa(p);
    assert.equal(m.length, 36);
    for (const c of m) assert.ok(c.t === null || (c.t >= 0 && c.t <= 1));
    assert.equal(m.find(c => c.t === 1).simbolo, max, p); assert.equal(m.find(c => c.t === 0).simbolo, min, p);
  }
});
test('radios de iones: un anión es mayor que su átomo y un catión, menor; los radios iónicos de la tabla siguen la regla isoelectrónica', () => {
  for (const [at, an] of [['Cl', 'Cl-'], ['O', 'O2-'], ['F', 'F-'], ['S', 'S2-']]) assert.equal(motor.compararRadio(at, an).mayor, an);
  for (const [at, ca] of [['Na', 'Na+'], ['Mg', 'Mg2+'], ['Fe', 'Fe3+'], ['K', 'K+']]) assert.equal(motor.compararRadio(at, ca).mayor, at);
  assert.equal(motor.compararRadio('Fe2+', 'Fe3+').mayor, 'Fe2+');
  for (const serie of [['O2-', 'F-', 'Na+', 'Mg2+', 'Al3+'], ['S2-', 'Cl-', 'K+', 'Ca2+']]) {
    const r = motor.ordenarRadios(serie);
    for (let i = 0; i + 1 < r.ionicos.length; i++) assert.ok(r.ionicos[i] > r.ionicos[i + 1], serie.join(' '));
  }
});
test('sucesivas: el gran salto llega después de los electrones de valencia y la "atracción repartida" no lo explica', () => {
  for (const x of ['Na', 'Mg', 'Al']) {
    const r = motor.ionizacionesSucesivas(x);
    assert.equal(r.salto, r.valencia, x);
    assert.equal(motor.ubicacion(x).grupo % 10, r.valencia, x);
  }
  const na = motor.ionizacionesSucesivas('Na');
  assert.ok(na.errores['reparte-atraccion'] < na.valores[0] * 1.2 && na.errores['reparte-atraccion'] < na.valores[1] / 8, 'Na: la atracción repartida apenas sube la primera');
});

test('secuencia: al Fe³⁺ salen dos 4s y un 3d; al Na⁺ le entra un 3s; al Cl le entra un 3p', () => {
  assert.deepEqual(motor.secuencia('Fe', 0, 3).map(e => e.subcapa), ['4s', '4s', '3d']);
  assert.deepEqual(motor.secuencia('Na', 1, 0).map(e => [e.tipo, e.subcapa]), [['entra', '3s']]);
  assert.deepEqual(motor.secuencia('Cl', 0, -1).map(e => e.subcapa), ['3p']);
  assert.deepEqual(motor.secuencia('Na', 0, 2).map(e => e.n), [3, 2]);
  // Ida y vuelta: agregar el electrón que salió devuelve la misma configuración.
  for (let Z = 1; Z <= 36; Z++) for (let q = 0; q < Math.min(3, Z); q++) {
    if (Z === 24 || Z === 29) continue; // en el Cr y el Cu, el catión no vuelve por Möller a la excepción
    const ida = motor.electronQueSale(Z, q), vuelta = motor.electronQueEntra(Z, q + 1);
    if (q > 0 || Z <= 20 || Z >= 31) assert.equal(vuelta.subcapa, ida.subcapa, `Z ${Z}, carga ${q}`);
  }
});
test('escalas de dibujo: a escala con una sola tabla y, si no, en el orden de las reglas', () => {
  const a = motor.escalasDibujo(['Mg', 'Al']);
  assert.ok(a.aEscala && a.escalas[0] === 1 && a.escalas[1] < 1);
  const i = motor.escalasDibujo(['O2-', 'F-', 'Na+', 'Mg2+']);
  assert.ok(i.aEscala && i.fuente === 'ionico');
  for (let k = 0; k + 1 < 4; k++) assert.ok(i.escalas[k] > i.escalas[k + 1]);
  const r = motor.escalasDibujo(['Cl', 'Cl-']), s = motor.escalasDibujo(['Na', 'Na+']);
  assert.equal(r.aEscala, false);
  assert.ok(r.escalas[1] > r.escalas[0] && s.escalas[0] > s.escalas[1]);
  assert.throws(() => motor.escalasDibujo(['Cl', 'Cl-', 'Na', 'Na+']), /regla simple/);
});

// Las predicciones de la escena: ningún error típico da la respuesta correcta.
test('predicciones de la escena: cada error da algo distinto de la respuesta', () => {
  const p = motor.particulas({ simbolo: 'Fe', A: 56, carga: 3 });
  assert.notEqual(p.errores['resta-carga-a-neutrones'], p.neutrones);
  assert.notEqual(p.errores['suma-carga-a-electrones'], p.electrones);
  assert.notEqual(p.errores['ignora-la-carga'], p.electrones);
  const f = motor.configuracion('Fe3+'), errs = Object.values(f.errores);
  assert.equal(new Set([f.abreviada, ...errs]).size, 1 + errs.length, 'Fe³⁺: todas las configuraciones son distintas');
  assert.equal(f.errores['quita-solo-uno'], '[Ar] 4s1 3d6');
  const cr = motor.configuracion('Cr'), ni = motor.configuracion('Ni');
  assert.notEqual(cr.errores['sin-excepcion'], cr.abreviada); assert.notEqual(ni.errores['excepcion-generalizada'], ni.abreviada);
  const ps = motor.compararEI('P', 'S');
  assert.notEqual(ps.errores['solo-carga-nuclear'], ps.mayor);
  const ma = motor.compararEI('Mg', 'Al');
  assert.notEqual(ma.errores['solo-carga-nuclear'], ma.mayor);
  const iso = motor.ordenarRadios(['O2-', 'F-', 'Na+', 'Mg2+']);
  assert.notDeepEqual(iso.errores['mas-protones-mas-grande'], iso.orden); assert.notDeepEqual(iso.errores['ordena-como-atomos'], iso.orden);
  const na = motor.ionizacionesSucesivas('Na');
  assert.ok(Math.abs(na.errores['reparte-atraccion'] - na.valores[1]) > 1000);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.elemento('Xx'), /desconocido/);
  assert.throws(() => motor.elemento(0), /fuera de rango/);
  assert.throws(() => motor.especie('Fe3'), /no entiendo/);
  assert.throws(() => motor.particulas({ Z: 26, A: 20, carga: 0 }), /masa/);
  assert.throws(() => motor.particulas({ Z: 1, A: 1, carga: 2 }), /carga/);
  assert.throws(() => motor.configuracion(1, 2), /carga/);
  assert.throws(() => motor.propiedad('Rb', 'ei'), /sin datos/);
  assert.throws(() => motor.propiedad('Na', 'masa'), /propiedad/);
  assert.throws(() => motor.ionizacionesSucesivas('K'), /sin datos/);
  assert.throws(() => motor.compararRadio('Na+', 'Cl'), /regla simple/);
  assert.throws(() => motor.compararEI('Co', 'Ni'), /transición/);
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
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
