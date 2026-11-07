// Pruebas del motor de estática. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Equilibrio de verdad: con las fuerzas que da el motor se arma aquí, por separado, la lista de fuerzas en el
//    plano (con su punto de aplicación) y se comprueba que la suma de fuerzas y la de momentos dan cero respecto
//    a varios puntos, también con la barra inclinada. En el nudo, las tres fuerzas cierran el triángulo.
// 3. Lo que enseña la escena: el momento neto es cero respecto a cualquier punto (E5); inclinar la barra no rompe el
//    equilibrio (E3); al cortar un bate en su punto de equilibrio, la parte gruesa pesa más (E1); la tensión crece
//    al acercarse la cuerda a la horizontal y no depende del largo (E7, E8); en la polea fija la tensión es la misma
//    en toda la cuerda (E6, E9); el roce estático vale lo necesario, no μs·N (E10); un par hace girar aunque la
//    fuerza neta sea cero (E4).
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

// 2. Equilibrio de verdad, con las fuerzas armadas aquí
const rad = d => d * Math.PI / 180;
// Fuerzas de la barra en el plano: el primer apoyo en el origen, la barra girada φ (exacto, con el seno real).
function fuerzasBarra(o, r) {
  const s = r.reacciones[0].x, phi = rad(o.inclinacion || 0);
  const p = x => ({ x: (x - s) * Math.cos(phi), y: (x - s) * Math.sin(phi) });
  const lista = [Object.assign(p(r.xcg), { Fx: 0, Fy: -r.P })];
  for (const c of r.cargas) lista.push(Object.assign(p(c.x), { Fx: 0, Fy: -c.F }));
  for (const q of r.reacciones) lista.push(Object.assign(p(q.x), { Fx: 0, Fy: q.R }));
  return lista;
}
function momentoAqui(lista, x0, y0) { return lista.reduce((t, f) => t + (f.x - x0) * f.Fy - (f.y - y0) * f.Fx, 0); }
test('barra con un apoyo y una carga desconocida: suma de fuerzas y de momentos cero respecto a cualquier punto', () => {
  for (const L of [2, 6, 9]) for (const m of [0, 5, 30]) for (const fs_ of [0.1, 0.35, 0.8]) for (const fc of [0, 0.5, 1]) for (const phi of [0, 15, -40]) {
    const s = L * fs_, xc = L * fc;
    if (Math.abs(xc - s) < 1e-6) continue;
    const o = { L, m, apoyos: [{ x: s }], cargas: [{ x: L * 0.9, F: 70 }, { x: xc, F: '?' }], inclinacion: phi, exacto: true };
    const r = motor.barra(o), lista = fuerzasBarra(o, r);
    cerca(lista.reduce((t, f) => t + f.Fy, 0), 0, `ΣF ${JSON.stringify(o)}`, 1e-9);
    for (const [x0, y0] of [[0, 0], [3, -2], [-L, 1.5], [L, L]]) cerca(momentoAqui(lista, x0, y0), 0, `Στ respecto a (${x0}, ${y0})`, 1e-9);
    assert.equal(r.equilibrio, r.R >= -1e-9);
  }
});
test('barra con dos apoyos: las dos reacciones cumplen ΣF = 0 y Στ = 0 respecto a los dos apoyos y a otros puntos', () => {
  for (const L of [3, 8]) for (const m of [0, 12]) for (const [a, b] of [[0, 1], [0.2, 0.7], [0, 0.6]]) for (const fc of [0, 0.4, 1]) {
    const o = { L, m, apoyos: [{ x: L * a }, { x: L * b }], cargas: [{ x: L * fc, F: 90 }, { x: L * 0.3, m: 2 }] };
    const r = motor.barra(o), lista = fuerzasBarra(o, r);
    cerca(lista.reduce((t, f) => t + f.Fy, 0), 0, 'ΣF', 1e-9);
    for (const x0 of [0, L * (b - a), -2, 7]) cerca(momentoAqui(lista, x0, 0), 0, `Στ respecto a x = ${x0}`, 1e-9);
    assert.equal(r.vuelca, r.R < -1e-9 || r.R2 < -1e-9);
  }
});
test('nudo: las dos tensiones y el peso suman cero (el triángulo de fuerzas se cierra), por componentes y por Lamy', () => {
  for (const a1 of [10, 16, 30, 37, 45, 53, 60, 74, 85, 90]) for (const a2 of [5, 20, 37, 53, 70, 90]) {
    if (a1 === 90 && a2 === 90) continue;
    for (const exacto of [false, true]) {
      const r = motor.nudo({ m: 7, a1, a2, exacto });
      const s1 = exacto ? Math.sin(rad(a1)) : motor.trig(a1).sen, c1 = exacto ? Math.cos(rad(a1)) : motor.trig(a1).cos;
      const s2 = exacto ? Math.sin(rad(a2)) : motor.trig(a2).sen, c2 = exacto ? Math.cos(rad(a2)) : motor.trig(a2).cos;
      cerca(-r.T1 * c1 + r.T2 * c2, 0, `Σx ${a1}, ${a2}`, 1e-9);
      cerca(r.T1 * s1 + r.T2 * s2 - r.P, 0, `Σy ${a1}, ${a2}`, 1e-9);
      cerca(r.lamy.T1, r.T1, 'Lamy T1', 1e-9); cerca(r.lamy.T2, r.T2, 'Lamy T2', 1e-9);
      if (exacto) {
        // Lamy con los senos de verdad de los ángulos entre las fuerzas.
        const k = r.P / Math.sin(rad(180 - a1 - a2));
        cerca(k * Math.sin(rad(90 + a2)), r.T1, 'Lamy con senos reales', 1e-9);
      }
    }
  }
});
test('momento de una fuerza inclinada: igual al producto cruz con la fuerza puesta en el extremo de la barra', () => {
  for (const F of [10, 50]) for (const d of [0.5, 2]) for (const ang of [0, 20, 37, 53, 90, 120, 143, 180]) {
    const r = motor.momentoFuerza({ F, d, angulo: ang, exacto: true });
    const cruz = motor.momentos2D([{ x: d, y: 0, Fx: F * Math.cos(rad(ang)), Fy: F * Math.sin(rad(ang)) }], { x: 0, y: 0 }).neto;
    cerca(r.tau, Math.abs(cruz), `τ F=${F} d=${d} θ=${ang}`, 1e-9);
    cerca(r.tau, F * r.brazo, 'τ = F·brazo', 1e-9);
    // El pie del brazo está sobre la línea de la fuerza, a la distancia 'brazo' del eje, y el brazo es perpendicular a la fuerza.
    const ux = Math.cos(rad(ang)), uy = Math.sin(rad(ang));
    cerca(Math.hypot(r.pie.x, r.pie.y), r.brazo, 'largo del brazo', 1e-9);
    cerca(r.pie.x * ux + r.pie.y * uy, 0, 'brazo ⟂ fuerza', 1e-9);
    cerca((r.pie.x - d) * uy - r.pie.y * ux, 0, 'pie sobre la línea de la fuerza', 1e-9);
    assert.ok(r.tau <= F * d + 1e-9, 'nunca más que con la fuerza perpendicular');
  }
});

// 3. Lo que enseña la escena
test('E5: con la barra en equilibrio, el momento neto da cero respecto a cualquier punto; si no hay equilibrio, no', () => {
  const o = { L: 6, m: 30, apoyos: [{ x: 2 }], cargas: [{ x: 0, F: 150 }] };
  for (let x = 0; x <= 6; x += 0.25) cerca(motor.momentoNeto(o, x).neto, 0, `respecto a x = ${x}`);
  const mal = { L: 6, m: 30, apoyos: [{ x: 2 }], cargas: [{ x: 0, F: 100 }] };
  assert.equal(motor.barra(mal).equilibrio, false);
});
test('E3: inclinar la barra no cambia la carga que la equilibra', () => {
  for (const phi of [-60, -37, -10, 0, 10, 37, 60]) cerca(motor.barra({ L: 6, m: 30, apoyos: [{ x: 2 }], cargas: [{ x: 0, F: '?' }], inclinacion: phi }).incognita, 150, `φ = ${phi}`);
});
test('E1: el mismo peso a cada lado solo coincide con la respuesta si el apoyo está en el centro de una barra pareja', () => {
  for (const s of [0.5, 1, 2, 2.5, 3.5]) {
    const r = motor.barra({ L: 6, m: 30, apoyos: [{ x: s }], cargas: [{ x: 0, F: '?' }] });
    if (s < 3) assert.notEqual(Math.round(r.errores.igualarPesosLados * 1e6), Math.round(r.incognita * 1e6), `apoyo en ${s}`);
  }
});
test('E1 en el bate: las dos partes giran igual respecto al corte, pero la gruesa pesa más', () => {
  for (const razon of [1.5, 2, 4, 9]) {
    const r = motor.bate({ L: 0.84, m: 1.1, razon });
    cerca(r.mango.tau, r.punta.tau, `momentos iguales con razón ${razon}`, 1e-9);
    cerca(r.mango.m + r.punta.m, r.M, 'masa total');
    assert.ok(r.punta.m > r.mango.m, 'la parte gruesa pesa más'); assert.equal(r.masMasa, 'punta');
    assert.ok(r.punta.largo < r.mango.largo, 'y es más corta');
  }
  for (const corte of [0.2, 0.5, 0.7]) {
    const r = motor.bate({ tramos: [{ largo: 0.6, m: 0.3 }, { largo: 0.3, m: 0.6 }] }, corte);
    cerca(r.mango.m + r.punta.m, 0.9, `masa total con corte en ${corte}`);
  }
});
test('E8: con dos cuerdas iguales, cada tensión es más de la mitad del peso y crece sin límite hacia la horizontal', () => {
  let antes = Infinity;
  for (let a = 5; a <= 89; a += 1) {
    const r = motor.nudo({ m: 10, a1: a, a2: a, exacto: true });
    assert.ok(r.T1 > 50, `a ${a}° la tensión pasa de 50 N`); assert.ok(r.T1 < antes, 'baja al acercarse a la vertical'); antes = r.T1;
  }
  assert.ok(motor.nudo({ m: 10, a1: 1, a2: 1, exacto: true }).T1 > 2000);
});
test('E7: el largo de la cuerda no cambia la tensión (la geometría solo dice dónde se amarra)', () => {
  const r = motor.nudo({ m: 10, a1: 37, a2: 53 });
  for (const h of [0.5, 1, 3]) {
    const g = r.geometria(h);
    assert.ok(g.l1 > g.l2, 'la cuerda de 37° es la más larga'); cerca(g.l1 / g.l2, 4 / 3, 'razón de largos');
  }
  assert.ok(r.T1 < r.T2, 'pero la más tensa es la de 53°');
});
test('E6 y E9: en la polea fija la tensión es la misma en cualquier punto de la cuerda', () => {
  const r = motor.polea({ m1: 4, m2: 4 });
  for (const s of [0, 0.3, 1, 2.5]) cerca(r.tensionEn(s), 40, `tensión en ${s} m`);
  assert.equal(motor.polea({ m1: 4, m2: 4.5 }).equilibrio, false);
});
test('E10: el roce estático vale lo que hace falta, nunca más que μs·N, y el cuerpo empieza a deslizar en tan θ = μs', () => {
  for (const F of [0, 10, 40, 99, 100]) {
    const r = motor.planoRoce({ m: 20, mus: 0.5, F });
    assert.ok(r.quieto); cerca(r.roce, F, `roce con F = ${F}`); assert.ok(r.roce <= r.fsMax + 1e-9);
  }
  const lim = motor.planoRoce({ m: 1, angulo: 1, mus: 0.6 }).anguloLimite;
  for (let a = 1; a < 60; a += 0.5) {
    const r = motor.planoRoce({ m: 5, angulo: a, mus: 0.6, exacto: true });
    if (a < lim - 1e-6) { assert.ok(r.quieto, `${a}°`); cerca(r.roce, r.Ppar, 'roce = componente del peso'); }
    else if (a > lim + 1e-6) assert.ok(!r.quieto, `${a}°`);
  }
});
test('E4: en el par la fuerza neta es cero y el momento es el mismo respecto a cualquier punto', () => {
  const r = motor.par({ F: 20, L: 1, m: 0.6 });
  for (const [x, y] of [[0, 0], [0.5, 0], [1, 0], [3, -2], [-1, 4]]) cerca(r.momentoRespecto(x, y), 20, `(${x}, ${y})`);
  cerca(r.angulo(0.1), 2, 'ángulo a los 0,1 s'); cerca(r.angulo(0), 0, 'al inicio');
});
test('centro de gravedad: el momento de los pesos respecto a él es cero; una figura en L da lo mismo cortada de dos formas', () => {
  const ms = [{ m: 2, x: 0, y: 1 }, { m: 6, x: 4, y: -2 }, { m: 1.5, x: -3, y: 5 }];
  const c = motor.centroGravedad(ms);
  cerca(ms.reduce((t, q) => t + q.m * (q.x - c.x), 0), 0, 'Σ m·(x − xcg)'); cerca(ms.reduce((t, q) => t + q.m * (q.y - c.y), 0), 0, 'Σ m·(y − ycg)');
  const a = motor.figuraCompuesta([{ tipo: 'rect', x: 0, y: 0, ancho: 4, alto: 2 }, { tipo: 'rect', x: 0, y: 2, ancho: 2, alto: 4 }]);
  const b = motor.figuraCompuesta([{ tipo: 'rect', x: 0, y: 0, ancho: 2, alto: 6 }, { tipo: 'rect', x: 2, y: 0, ancho: 2, alto: 2 }]);
  const h = motor.figuraCompuesta([{ tipo: 'rect', x: 0, y: 0, ancho: 4, alto: 6 }, { tipo: 'rect', x: 2, y: 2, ancho: 2, alto: 4, hueco: true }]);
  for (const k of ['x', 'y', 'area']) { cerca(a[k], b[k], `L de dos formas · ${k}`); cerca(a[k], h[k], `L como rectángulo con hueco · ${k}`); }
});
test('los ángulos notables coinciden con el seno de verdad a menos de 0,4° y sen(a + b) usa sus valores', () => {
  for (const k of Object.keys(motor.NOTABLES)) {
    const t = motor.trig(+k), d = Math.abs(Math.asin(t.sen) * 180 / Math.PI - +k);
    assert.ok(d < 0.4, `${k}°: ${d}`);
    cerca(t.sen * t.sen + t.cos * t.cos, 1, `sen² + cos² en ${k}°`);
  }
  cerca(motor.senSuma(53, 53), 24 / 25, 'sen 106° de academia'); cerca(motor.senSuma(37, 53), 1, 'sen 90°');
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.barra({ L: 0, m: 2, apoyos: [{ x: 0 }] }), /mayor que cero/);
  assert.throws(() => motor.barra({ L: 6, m: 30, apoyos: [] }), /uno o dos apoyos/);
  assert.throws(() => motor.barra({ L: 6, m: 30, apoyos: [{ x: 7 }] }), /sobre la barra/);
  assert.throws(() => motor.barra({ L: 6, m: 30, apoyos: [{ x: 2 }], cargas: [{ x: 0, F: '?' }, { x: 6, F: '?' }] }), /una carga desconocida/);
  assert.throws(() => motor.barra({ L: 6, m: 30, apoyos: [{ x: 2 }, { x: 5 }], cargas: [{ x: 0, F: '?' }] }), /faltan datos/);
  assert.throws(() => motor.barra({ L: 6, m: 30, apoyos: [{ x: 2 }], cargas: [{ x: 2, F: '?' }] }), /mismo apoyo/);
  assert.throws(() => motor.barra({ L: 6, m: 'mucha', apoyos: [{ x: 2 }] }), /inválido/);
  assert.throws(() => motor.barra({ L: 5, tramos: [{ largo: 2, m: 1 }], apoyos: [{ x: 1 }] }), /no coincide/);
  assert.throws(() => motor.nudo({ m: 10, a1: 0, a2: 53 }), /más de 0°/);
  assert.throws(() => motor.nudo({ m: 10, a1: 90, a2: 90 }), /no pueden sostener/);
  assert.throws(() => motor.momentoFuerza({ F: 10, d: 1, angulo: 200 }), /0° a 180°/);
  assert.throws(() => motor.centroGravedad([]), /al menos una/);
  assert.throws(() => motor.figuraCompuesta([{ tipo: 'rect', ancho: 1, alto: 1 }, { tipo: 'rect', ancho: 2, alto: 2, hueco: true }]), /huecos/);
  assert.throws(() => motor.figuraCompuesta([{ tipo: 'estrella' }]), /desconocido/);
  assert.throws(() => motor.bate({ L: 1, m: 1, razon: 2 }, 1.2), /dentro/);
  assert.throws(() => motor.planoRoce({ m: 10, angulo: 95, mus: 0.3 }), /0° a menos de 90°/);
  assert.throws(() => motor.polea({ m1: 0, m2: 2 }), /mayor que cero/);
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
