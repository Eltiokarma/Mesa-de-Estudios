// Pruebas del motor de Ácidos, bases y pH. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: pH + pOH = 14; al diluir 10 veces un ácido fuerte, el pH sube 1; un ácido nunca pasa de pH 7
//    al diluir (ni una base baja de 7); la cuadrática coincide con la aproximación cuando Ka ≪ C; la
//    neutralización exacta de fuerte con fuerte da pH 7; un ácido débil se ioniza más al diluirse; el balance
//    de cargas se cumple; las partículas de la lupa cuentan lo mismo que las concentraciones.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia || 1e-9;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
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
  assert.equal(datos.plantilla, 'acidos-bases');
  assert.ok(datos.casos.length >= 15);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades, con valores al azar (semilla fija)
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const logAl = (a, b) => Math.pow(10, al(Math.log10(a), Math.log10(b)));
const KAS = [Infinity, 1e-2, 1e-3, 2e-5, 1.8e-5, 1e-7, 1e-9];   // de más fuerte a más débil

test('pH + pOH = 14 y [H⁺]·[OH⁻] = Kw en ácidos, bases, neutros y mezclas', () => {
  for (let k = 0; k < 400; k++) {
    const C = logAl(1e-9, 2), K = KAS[k % KAS.length];
    for (const r of [motor.solucion({ acido: C, Ka: K }), motor.solucion({ base: C, Kb: K }), motor.solucion({ neutro: C })]) {
      cerca(r.pH + r.pOH, 14, 'pH + pOH');
      cerca(r.H * r.OH, motor.KW, 'Kw', 1e-9);
    }
    const m = motor.mezclar({ acido: { C: al(0.01, 1), mL: al(1, 50), Ka: K }, base: { C: al(0.01, 1), mL: al(0, 80) } });
    cerca(m.pH + m.pOH, 14, 'mezcla');
  }
});
test('balance de cargas: [H⁺] + cationes = [OH⁻] + aniones', () => {
  for (let k = 0; k < 300; k++) {
    const C = logAl(1e-9, 1), K = KAS[k % KAS.length], t = K === Infinity ? 1 + (k % 2) : 1;
    const a = motor.solucion({ acido: C, Ka: K, theta: t }), e = a.especies;
    cerca(e.H, e.OH + t * e.A, 'ácido', 1e-8);
    cerca(e.A + e.HA, C, 'se conservan las fórmulas del ácido');
    const b = motor.solucion({ base: C, Kb: K, theta: t }), f = b.especies;
    cerca(f.OH, f.H + t * f.M + f.BH, 'base', 1e-8);
  }
});
test('al diluir 10 veces un ácido fuerte, el pH sube 1 (mientras el agua no cuente)', () => {
  for (let k = 0; k < 300; k++) {
    const C = logAl(1e-4, 2), t = 1 + (k % 2), d = motor.diluir({ acido: C, theta: t }, 10);
    cerca(d.dpH, 1, `C = ${C}`, 1e-4);
    cerca(d.despues.aprox.pH - d.antes.aprox.pH, 1, 'academia: exacto');
    const b = motor.diluir({ base: C, theta: t }, 10);
    cerca(b.dpH, -1, 'una base fuerte baja 1', 1e-4);
    // diluir 100 veces es como diluir 10 dos veces
    const d100 = motor.diluir({ acido: C, theta: t }, 100), d10b = motor.diluir({ acido: C / 10, theta: t }, 10);
    cerca(d100.despues.pH, d10b.despues.pH, 'dos diluciones');
  }
});
test('un ácido nunca pasa de pH 7 al diluir, y una base nunca baja de 7', () => {
  for (const K of KAS) for (let k = 0; k < 60; k++) {
    const C = logAl(1e-6, 1);
    let ant = motor.solucion({ acido: C, Ka: K }).pH, antB = motor.solucion({ base: C, Kb: K }).pH;
    for (const f of [10, 100, 1e3, 1e4, 1e6, 1e9, 1e12]) {
      const d = motor.diluir({ acido: C, Ka: K }, f), b = motor.diluir({ base: C, Kb: K }, f);
      assert.ok(d.despues.pH < 7, `ácido Ka=${K} C=${C} ×${f}: pH ${d.despues.pH}`);
      assert.ok(d.despues.pH >= ant - 1e-12, 'diluir nunca baja el pH de un ácido');
      assert.ok(b.despues.pH > 7, `base Kb=${K} C=${C} ×${f}: pH ${b.despues.pH}`);
      assert.ok(b.despues.pH <= antB + 1e-12, 'diluir nunca sube el pH de una base');
      ant = d.despues.pH; antB = b.despues.pH;
    }
  }
  // muy diluido, se acerca a 7 tanto como se quiera
  assert.ok(7 - motor.diluir({ acido: 1 }, 1e15).despues.pH < 1e-3);
});
test('la cuadrática coincide con la aproximación cuando Ka ≪ C, y la aproximación falla al diluir', () => {
  for (let k = 0; k < 300; k++) {
    const Ka = logAl(1e-10, 1e-4), C = Ka * logAl(1e4, 1e8);   // C/Ka entre 10⁴ y 10⁸
    const r = motor.solucion({ acido: C, Ka });
    assert.ok(Math.abs(r.errorAprox) < 0.006, `error ${r.errorAprox}`);
    assert.ok(Math.abs(r.aprox.pH - r.cuadratica.pH) < 0.003);
    assert.equal(r.aproxValida, true);
    if (r.H > 1e-6) cerca(r.cuadratica.H, r.H, 'sin el agua, el balance completo y la cuadrática coinciden', 1e-6);
  }
  // C/Ka pequeño: la aproximación da una ionización mayor que 5 % y se marca como no válida
  const r = motor.solucion({ acido: 0.01, Ka: 1e-3 });
  assert.equal(r.aproxValida, false); assert.ok(r.errorAprox > 0.1);
});
test('un ácido débil se ioniza más al diluirse; uno fuerte ya estaba todo roto', () => {
  for (const Ka of [1e-3, 2e-5, 1e-7]) {
    let ant = 0;
    for (const C of [1, 0.1, 0.01, 1e-3, 1e-4]) {
      const r = motor.solucion({ acido: C, Ka });
      assert.ok(r.ionizacion > ant, `Ka=${Ka} C=${C}`); ant = r.ionizacion;
    }
  }
  for (const C of [1, 1e-3, 1e-7]) assert.equal(motor.solucion({ acido: C }).ionizacion, 1);
  // diluir 100 veces un débil sube el pH menos que 2; uno fuerte sube 2
  const d = motor.diluir({ acido: 0.2, Ka: 2e-5 }, 100);
  assert.ok(d.dpH > 0.9 && d.dpH < 1.1, `sube ${d.dpH}`);
  assert.ok(d.errores.comoFuerte - d.antes.pH > 1.99);
});
test('a la misma concentración, más fuerte es más ácido; a la misma fuerza, más concentrado es más ácido', () => {
  for (const C of [1, 0.1, 1e-3]) {
    const ph = KAS.map(K => motor.solucion({ acido: C, Ka: K }).pH);
    for (let i = 1; i < ph.length; i++) assert.ok(ph[i] >= ph[i - 1] - 1e-12, `C=${C}: ${ph}`);
  }
  for (const K of KAS) {
    const ph = [1, 0.1, 0.01, 1e-3].map(C => motor.solucion({ acido: C, Ka: K }).pH);
    for (let i = 1; i < ph.length; i++) assert.ok(ph[i] > ph[i - 1], `Ka=${K}`);
  }
  // pero un débil concentrado puede ser más ácido que un fuerte diluido (AB2)
  assert.ok(motor.solucion({ acido: 1, Ka: 2e-5 }).pH < motor.solucion({ acido: 1e-3 }).pH);
});
test('la neutralización exacta de ácido fuerte con base fuerte da pH 7; con ácido débil, básica', () => {
  for (let k = 0; k < 300; k++) {
    const ta = 1 + (k % 2), tb = 1 + ((k >> 1) % 2), Ca = al(0.001, 1), mL = al(1, 100), Cb = al(0.001, 1);
    const v = motor.volumenEquivalencia({ C: Ca, mL, theta: ta }, { C: Cb, theta: tb }).mL;
    const m = motor.mezclar({ acido: { C: Ca, mL, theta: ta }, base: { C: Cb, mL: v, theta: tb } });
    cerca(m.pH, 7, 'pH 7', 1e-6); assert.equal(m.sobra, 'nada'); cerca(m.eqAcido, m.eqBase, 'equivalentes');
    const md = motor.mezclar({ acido: { C: Ca, mL, Ka: 2e-5 }, base: { C: Cb, mL: Ca * mL / Cb } });
    assert.ok(md.pH > 7, 'ácido débil + base fuerte: sal básica');
    // un poco menos de base: ácida; un poco más: básica
    assert.ok(motor.mezclar({ acido: { C: Ca, mL, theta: ta }, base: { C: Cb, mL: v * 0.9, theta: tb } }).pH < 7);
    assert.ok(motor.mezclar({ acido: { C: Ca, mL, theta: ta }, base: { C: Cb, mL: v * 1.1, theta: tb } }).pH > 7);
  }
});
test('titulación: el pH sube desde la primera gota, despacio al inicio y de golpe cerca de la equivalencia', () => {
  const vols = Array.from({ length: 41 }, (_, k) => k);
  const t = motor.titulacion({ C: 0.1, mL: 20 }, { C: 0.1 }, vols);
  for (let k = 1; k < t.length; k++) assert.ok(t[k].pH > t[k - 1].pH, `a ${k} mL`);
  assert.ok(t[10].pH - t[0].pH < 0.6, 'plano al inicio');
  assert.ok(t[21].pH - t[19].pH > 5, 'salto en la equivalencia');
});
test('errores típicos: los valores de las opciones', () => {
  const s = motor.solucion({ acido: 0.002 });
  assert.ok(s.errores.signoLog > 3 && s.pH < 3, 'el signo cambiado da más de 3');
  assert.equal(motor.solucion({ acido: 0.01 }).errores.signoLog, undefined, 'con 10⁻ᵏ exacto no hay error de signo');
  cerca(motor.solucion({ base: 0.005, theta: 2 }).errores.sinTheta, 14 + Math.log10(0.005), 'sin θ');
  cerca(motor.solucion({ base: 0.02 }).errores.pOHcomoPH, motor.solucion({ base: 0.02 }).pOH, 'pOH como pH');
  cerca(motor.razonH(2, 6).veces, 1e4, 'razón'); cerca(motor.razonH(2, 6).errores.resta, 4, 'resta');
});
test('partículas: cada especie cuenta su concentración entre la escala, y fuerte se ve roto, débil entero', () => {
  for (let k = 0; k < 200; k++) {
    const C = logAl(1e-3, 1), K = KAS[k % 5], r = motor.solucion({ acido: C, Ka: K }), esc = C / 40;
    const p = motor.particulas(r, esc);
    cerca(p.formulas, 40, 'fórmulas');
    cerca(p.esperado.A + p.esperado.HA, 40, 'rotas + enteras');
    cerca(p.esperado.H, r.H / esc, 'H⁺');
    assert.ok(Math.abs(p.n.A - p.esperado.A) <= 0.5 && Math.abs(p.n.HA - p.esperado.HA) <= 0.5, 'redondeo');
    if (K === Infinity) { assert.equal(p.n.HA, 0); assert.equal(p.n.A, 40); }
    else if (K <= 2e-5 && C >= 0.1) assert.ok(p.n.HA >= 38, 'un débil concentrado está casi todo entero');
  }
  // la lupa de volumen fijo: diluir 10 veces deja 10 veces menos fórmulas en la lupa
  const a = motor.particulas(motor.solucion({ acido: 0.1 }), 0.0025), b = motor.particulas(motor.solucion({ acido: 0.01 }), 0.0025);
  assert.equal(a.n.A, 40); assert.equal(b.n.A, 4);
  // con un máximo, se recorta y se avisa
  const c = motor.particulas(motor.solucion({ acido: 1e-8 }), 2.5e-10, { max: 120 });
  assert.equal(c.n.A, 40); assert.equal(c.n.H, 120); assert.equal(c.recorte, true); assert.ok(c.esperado.H > 400);
  // ubicar: dentro del círculo, siempre igual con la misma semilla
  for (const n of [0, 1, 7, 40, 150]) {
    const u = motor.ubicar(n, 9);
    assert.equal(u.length, n); assert.deepEqual(u, motor.ubicar(n, 9));
    for (const q of u) assert.ok(Math.hypot(q.x, q.y) <= 0.9 + 1e-12);
  }
  cerca(motor.escalaPara(0.2, 100), 0.002, 'escala');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.solucion({}), /una sola/);
  assert.throws(() => motor.solucion({ acido: 0.1, base: 0.1 }), /una sola/);
  assert.throws(() => motor.solucion({ acido: 0 }), /mayor que cero/);
  assert.throws(() => motor.solucion({ acido: -1 }), /mayor que cero/);
  assert.throws(() => motor.solucion({ acido: 'mucho' }), /número/);
  assert.throws(() => motor.solucion({ acido: 0.1, Ka: 0 }), /Ka/);
  assert.throws(() => motor.solucion({ acido: 0.1, Ka: -2e-5 }), /Ka/);
  assert.throws(() => motor.solucion({ base: 0.1, Kb: 'x' }), /Kb/);
  assert.throws(() => motor.solucion({ acido: 0.1, theta: 1.5 }), /θ/);
  assert.throws(() => motor.solucion({ acido: 0.1, theta: 0 }), /θ/);
  assert.throws(() => motor.solucion({ acido: 0.1, Ka: 1e-3, theta: 2 }), /polipróticos fuertes/);
  assert.throws(() => motor.sustancia('H2O2', 0.1), /desconocida/);
  assert.throws(() => motor.diluir({ acido: 0.1 }, 0.5), /menor que el inicial/);
  assert.throws(() => motor.diluir({ acido: 0.1 }, 0), /mayor que cero/);
  assert.throws(() => motor.mezclar({ acido: { C: 0.1, mL: 20 } }), /falta la base/);
  assert.throws(() => motor.mezclar({ acido: { C: 0.1, mL: 0 }, base: { C: 0.1, mL: 0 } }), /volumen/);
  assert.throws(() => motor.mezclar({ acido: { C: 0.1, mL: -5 }, base: { C: 0.1, mL: 5 } }), /negativo/);
  assert.throws(() => motor.volumenEquivalencia({ C: 0.1, mL: 20 }, { C: 0 }), /mayor que cero/);
  assert.throws(() => motor.titulacion({ C: 0.1, mL: 20 }, { C: 0.1 }, []), /volúmenes/);
  assert.throws(() => motor.desdeH(0), /mayor que cero/);
  assert.throws(() => motor.desdePH(-1), /negativo/);
  assert.throws(() => motor.particulas({}, 0.1), /especies/);
  assert.throws(() => motor.particulas(motor.solucion({ acido: 0.1 }), 0), /mayor que cero/);
  assert.throws(() => motor.ubicar(2.5), /enteros/);
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
