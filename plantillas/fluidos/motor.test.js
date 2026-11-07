// Pruebas del motor de fluidos. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Equilibrio de verdad, armado aquí por separado: en cualquier recipiente, la fuerza del fondo es el peso del
//    agua más la fuerza vertical de las paredes (sumada aquí franja por franja); en el tubo en U, la presión a la
//    altura de la frontera es la misma en las dos ramas; en la prensa, el volumen que baja es el que sube.
// 3. Lo que enseña la escena: la presión solo depende de la profundidad, no de la forma (F2, F3); el nivel es el
//    mismo en ramas de distinto ancho (F1); el empuje no depende de la masa (F10) ni de la profundidad una vez
//    sumergido (F12); dos cuerpos iguales que flotan en líquidos distintos tienen el mismo empuje (F13); solo hay
//    tres destinos para un cuerpo suelto (F11); dinamómetro más balanza suman siempre lo mismo; la prensa no crea
//    trabajo.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Equilibrio de verdad
test('recipiente: fuerza en el fondo = peso del agua + fuerza de las paredes, sumada aquí en franjas finas', () => {
  const formas = [
    [{ alto: 1, ancho: 0.6 }, { alto: 0.5, ancho: 0.2 }, { alto: 1, ancho: 0.9 }],
    [{ alto: 0.3, ancho: 2 }, { alto: 2, ancho: 0.1 }],
    [{ alto: 1.2, ancho: 0.4 }]
  ];
  for (const secciones of formas) for (const H of [0.2, 0.9, 1.4, 2.2]) for (const rho of [800, 1000, 13600]) {
    const alto = secciones.reduce((s, q) => s + q.alto, 0); if (H > alto) continue;
    const r = motor.recipiente({ secciones, H, rho });
    // Peso por franjas, sin usar el motor
    let y = 0, peso = 0; const n = 4000, dy = H / n;
    for (let i = 0; i < n; i++) { const ym = (i + 0.5) * dy; let a = 0, y0 = 0; for (const q of secciones) { if (ym >= y0 && ym < y0 + q.alto) a = q.ancho; y0 += q.alto; } peso += rho * 10 * a * dy; y += dy; }
    cerca(r.pesoAgua, peso, `peso por franjas ${JSON.stringify(secciones)} H=${H}`, 1e-3);
    // Paredes: en cada cambio de ancho bajo la superficie, presión de ahí por la diferencia de áreas
    let paredes = 0, y0 = 0;
    for (let i = 0; i < secciones.length - 1; i++) { y0 += secciones[i].alto; if (y0 < H) paredes += rho * 10 * (H - y0) * (secciones[i].ancho - secciones[i + 1].ancho); }
    cerca(r.fuerzaParedes, paredes, 'fuerza de las paredes', 1e-9);
    cerca(r.fuerzaFondo, r.pesoAgua + r.fuerzaParedes, 'fondo = peso + paredes', 1e-9);
    cerca(r.Pfondo, rho * 10 * H, 'la presión del fondo solo depende de H');
  }
});
test('tubo en U: misma presión a la altura de la frontera en las dos ramas; las superficies quedan a P₀', () => {
  for (const rho1 of [700, 800, 1000]) for (const rho2 of [1200, 13600]) for (const h1 of [0.05, 0.272, 0.6]) {
    const r = motor.tuboU({ rho1, h1, rho2 });
    const izq = 1e5 + rho1 * 10 * h1, der = 1e5 + rho2 * 10 * r.x;
    cerca(izq, der, `frontera ρ1=${rho1} ρ2=${rho2} h1=${h1}`);
    cerca(r.bajaFrontera + r.subeDerecha, r.x, 'la frontera baja lo que sube la otra rama (tubo parejo)');
    assert.ok(r.x < h1, 'el líquido denso sube menos que la columna del ligero');
  }
});
test('prensa: el volumen que baja es el que sube y el trabajo de entrada es el de salida', () => {
  for (const A1 of [0.001, 0.01, 0.05]) for (const r of [2, 10, 50]) for (const F1 of [10, 200]) for (const d1 of [0.1, 0.5]) {
    const p = motor.prensa({ A1, A2: A1 * r, F1, d1 });
    cerca(A1 * d1, p.A2 * p.d2, 'volumen'); cerca(p.trabajo1, p.trabajo2, 'trabajo');
    cerca(p.F1 / p.A1, p.F2 / p.A2, 'la misma presión en los dos émbolos');
    assert.ok(p.F2 > p.F1 && p.d2 < p.d1);
  }
});

// 3. Lo que enseña la escena
test('F2, F3, F4: a la misma profundidad, la misma presión en las cuatro formas, bajo techo o no', () => {
  const H = 2;
  for (const forma of Object.keys(motor.FORMAS)) {
    const r = motor.recipiente({ forma, H });
    for (const y of [0, 0.3, 0.5, 0.79, 1, 1.5, 2]) {
      const q = r.presionEn(0, y);
      cerca(q.P, 10000 * (H - y), `${forma} y=${y}`);
    }
  }
  const b = motor.recipiente({ forma: 'botella', H });
  cerca(b.presionEn(0.45, 0.2).P, b.presionEn(0, 0.2).P, 'bajo el techo y bajo el cuello');
  assert.equal(b.presionEn(0.45, 0.2).bajoTecho, true); assert.equal(b.presionEn(0, 0.2).bajoTecho, false);
});
test('F1: en vasos comunicantes, las ramas quedan al mismo nivel, sean como sean de anchas', () => {
  for (const areas of [[0.01, 0.02], [0.05, 0.001, 0.02], [1, 1]]) for (const volumen of [0, 0.003, 0.5]) {
    const r = motor.vasosComunicantes({ areas, volumen });
    for (const h of r.niveles) cerca(h, r.niveles[0], 'mismo nivel');
    cerca(r.niveles.reduce((s, h, i) => s + h * areas[i], 0), volumen, 'el volumen se conserva');
  }
});
test('F10 y F12: el empuje no depende de la masa ni, ya sumergido entero, de la profundidad', () => {
  const base = { V: 0.0005, mVaso: 1, Avaso: 0.02, hLiq: 0.15 };
  for (const m of [0.6, 1, 2, 5]) {
    const r0 = motor.balanza(Object.assign({ m, bajada: 0.06 }, base));
    for (const bajada of [0.07, 0.09, 0.12, 0.149]) {
      const r = motor.balanza(Object.assign({ m, bajada }, base));
      cerca(r.E, 5, `E con m=${m}, bajada=${bajada}`); cerca(r.T, r0.T, 'el dinamómetro no cambia'); cerca(r.N, r0.N, 'la balanza no cambia');
    }
    cerca(motor.sumergido({ m, V: 0.0005 }).E, 5, `sumergido m=${m}`);
  }
});
test('balanza: lo que marcan el dinamómetro y la balanza suma siempre el peso de todo; el empuje crece al hundir', () => {
  for (const m of [0.15, 0.3, 0.5, 2]) for (const rhoF of [800, 1000, 1200]) {
    let Eprev = -1;
    for (let bajada = -0.04; bajada <= 0.12; bajada += 0.005) {
      const r = motor.balanza({ m, V: 0.0005, mVaso: 1, Avaso: 0.02, hLiq: 0.15, rhoF, bajada });
      cerca(r.T + r.N, r.Wvaso + r.W, `total m=${m} ρ=${rhoF} y=${bajada}`);
      assert.ok(r.T >= -1e-12, 'el hilo no empuja');
      assert.ok(r.E >= Eprev - 1e-12, 'el empuje no baja al hundir más'); Eprev = r.E;
      cerca(r.E, rhoF * 10 * r.Vsum, 'E = ρ g V sumergido');
      if (r.s > 0 && !r.entero) cerca(r.profundidadFondo, r.s, 'el alto sumergido es la profundidad del fondo del bloque bajo la nueva superficie');
      cerca(r.subida * 0.02, r.Vsum, 'el nivel sube lo que ocupa lo sumergido');
      if (r.flojo) cerca(r.E, r.W, 'si el hilo queda flojo, flota: empuje = peso');
    }
  }
});
test('F13: el mismo cuerpo que flota en dos líquidos recibe el mismo empuje, igual a su peso', () => {
  for (const rhoC of [200, 600, 790]) for (const rhoF of [800, 1000, 1260, 13600]) {
    const r = motor.flotacion({ rhoC, V: 0.002, rhoF });
    assert.equal(r.destino, 'flota'); cerca(r.E, r.W, `ρC=${rhoC} ρF=${rhoF}`);
    cerca(r.fraccion, rhoC / rhoF, 'fracción sumergida');
  }
});
test('F11: solo tres destinos, según la densidad comparada con la del líquido', () => {
  const r = motor.bloques({ masas: [0.1, 0.3, 0.5, 0.7, 3, 10], V: 0.0005 });
  assert.deepEqual(r.destinos, ['flota', 'flota', 'media agua', 'fondo', 'fondo', 'fondo']);
  for (const b of r.lista) if (b.destino === 'fondo') cerca(b.normalFondo + b.Eentero, b.W, 'en el fondo: normal + empuje = peso');
});
test('continuidad y Bernoulli: el caudal se conserva; más rápido, menos presión en un tubo horizontal', () => {
  for (const A1 of [0.01, 0.04]) for (const A2 of [0.005, 0.02, 0.08]) for (const v1 of [0.5, 3]) {
    const c = motor.continuidad({ A1, v1, A2 }); cerca(c.A2 * c.v2, A1 * v1, 'caudal');
    const b = motor.bernoulli({ P1: 2e5, v1, A1, A2 });
    cerca(b.P2 + 500 * b.v2 * b.v2, 2e5 + 500 * v1 * v1, 'P + ½ρv² se conserva');
    if (A2 < A1) assert.ok(b.P2 < 2e5); if (A2 > A1) assert.ok(b.P2 > 2e5);
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.presion({ h: -1 }), /negativo/);
  assert.throws(() => motor.presion({ h: 3, H: 2 }), /pasar la altura/);
  assert.throws(() => motor.recipiente({ forma: 'taza', H: 1 }), /desconocida/);
  assert.throws(() => motor.recipiente({ forma: 'ancho', H: 3 }), /pasar la altura/);
  assert.throws(() => motor.recipiente({ forma: 'botella', H: 2 }).presionEn(0.6, 0.2), /fuera/);
  assert.throws(() => motor.recipiente({ forma: 'botella', H: 2 }).presionEn(0, 2.1), /sobre la superficie/);
  assert.throws(() => motor.tuboU({ rho1: 1000, h1: 0.2, rho2: 800 }), /más denso/);
  assert.throws(() => motor.prensa({ A1: 0, A2: 1, F1: 10 }), /mayor que cero/);
  assert.throws(() => motor.flotacion({ V: 0.001 }), /inválido/);
  assert.throws(() => motor.vasosComunicantes({ areas: [1] , volumen: 1 }), /dos ramas/);
  assert.throws(() => motor.balanza({ m: 2, V: 0.0005, Avaso: 0.02, hLiq: 0.15, bajada: 0.2 }), /tocaría el fondo/);
  assert.throws(() => motor.balanza({ m: 2, V: 0.03, Avaso: 0.02, hLiq: 0.15 }), /no cabe/);
  assert.throws(() => motor.presion({ h: 'hondo' }), /inválido/);
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
