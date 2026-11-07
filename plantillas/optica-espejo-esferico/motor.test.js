// Pruebas del motor de Espejos esféricos. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas, debe salir
//    igual del motor (regla 2 de CLAUDE.md).
// 2. El dibujo no puede contradecir a la ecuación: los rayos principales
//    trazados con la ley de reflexión se cruzan (o sus prolongaciones, si la
//    imagen es virtual) justo donde la ecuación pone la imagen.
// 3. La imagen no depende de dónde esté el ojo (idea errónea S2): todos los
//    rayos del abanico, y el rayo que llega a cualquier ojo, pasan por el mismo punto.
// 4. Cada problema de papel.json coincide con el motor.
// 5. El doblez (0.2.0): la hoja de la luz que sale de una lente, doblada sobre la línea del espejo, es el
//    dibujo del espejo; en cada cuadro los rayos siguen concurriendo y la imagen no cambia su distancia a
//    la bisagra. Las fórmulas de la lente y de la proyección se escriben aquí aparte, no se toman del motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = 1e-6;

function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t,
    `${que}: el motor da ${real}, se esperaba ${esperado} (tolerancia ${t})`);
}

// 1. Casos: cada uno llama a motor[fn](...args) y compara 'espera' (campos anidados con punto).
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  const ver = (x, v, k) => {
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`, datos.tolerancia);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  };
  if (espera !== null && typeof espera === 'object') for (const [k, v] of Object.entries(espera)) ver(leer(r, k), v, k);
  else ver(r, espera, 'valor');
  return r;
}
for (const caso of datos.casos) {
  test(`casos.json: ${caso.nombre}`, () => {
    const r = comprobar(caso.fn, caso.args, caso.espera, caso.nombre);
    for (const t of caso.tambien || []) comprobar(t.fn || caso.fn, t.args, t.espera, caso.nombre);
    if (caso.fn === 'imagen' && !r.inf) {
      cerca(r.m, -r.i / caso.args[0], 'A = -i/o');
      cerca(r.x, -r.i, 'posición en el dibujo (la imagen real se dobla hacia el objeto)');
    }
  });
}
// Los siete casos del informe siguen ahí, con sus valores (la migración de formato no cambió ninguno).
test('casos.json: los siete casos del informe, en el formato fn/args/espera', () => {
  const im = datos.casos.filter(c => c.fn === 'imagen');
  assert.equal(im.length, 7);
  assert.deepEqual(im.map(c => c.args[0]), [15, 30, 20, 10, 5, 10, 30]);
  assert.deepEqual(im.map(c => c.espera.i === undefined ? null : c.espera.i), [30, 15, 20, null, -10, -5, -7.5]);
});

test('focal: f = R/2, positiva en el cóncavo y negativa en el convexo', () => {
  assert.equal(motor.focal(20, 'concavo'), 10);
  assert.equal(motor.focal(20, 'convexo'), -10);
  assert.equal(motor.focal(-40, 'convexo'), -20);
});

test('reglas del examen: el convexo siempre da imagen virtual, derecha y menor', () => {
  for (const f of [-5, -10, -25]) for (const o of [1, 3, 10, 30, 100, 500]) {
    const d = motor.describir(motor.imagen(o, f, 1));
    assert.ok(!d.real && d.derecha && d.tamano === 'menor', `f=${f} o=${o}`);
  }
});

test('reglas del examen: zonas del cóncavo', () => {
  const f = 10;
  const ver = (o, real, derecha, tamano) => {
    const d = motor.describir(motor.imagen(o, f, 1));
    assert.deepEqual([d.real, d.derecha, d.tamano], [real, derecha, tamano], `o=${o}`);
  };
  for (const o of [21, 30, 80]) ver(o, true, false, 'menor');   // más allá de C
  for (const o of [11, 15, 19]) ver(o, true, false, 'mayor');   // entre C y F
  for (const o of [1, 5, 9.5]) ver(o, false, true, 'mayor');    // entre F y el espejo
});

// 2. El dibujo coincide con la ecuación
function cruce(a, b) {
  // Dos rectas reflejadas y = yM + pend·x
  const x = (b.yM - a.yM) / (a.pend - b.pend);
  return [x, a.yM + a.pend * x];
}
const configuraciones = datos.casos.filter(c => c.fn === 'imagen' && !c.espera.inf).map(c => [c.nombre, ...c.args])
  .concat([['cóncavo, objeto casi en F', 10.5, 10, 3], ['convexo grande', 40, -25, 5], ['cóncavo, objeto muy cerca', 1, 10, 2]]);
for (const [nombre, o, f, h] of configuraciones) {
  test(`el dibujo coincide con la ecuación: ${nombre}`, () => {
    const r = motor.imagen(o, f, h);
    const rp = motor.rayosPrincipales(o, f, h);
    const rayos = [rp.paralelo, rp.foco, rp.vertice, rp.centro].filter(Boolean);
    assert.ok(rayos.length >= 3, 'deben existir al menos tres rayos principales');
    // Cada par de rayos se cruza en el punto imagen.
    for (let a = 0; a < rayos.length; a++) for (let b = a + 1; b < rayos.length; b++) {
      const [x, y] = cruce(rayos[a], rayos[b]);
      cerca(x, r.x, `posición según ${rayos[a].nombre} y ${rayos[b].nombre}`, 1e-7);
      cerca(y, r.h, `altura según ${rayos[a].nombre} y ${rayos[b].nombre}`, 1e-7);
    }
    // Lo que dice cada rayo en palabras.
    cerca(motor.alturaEn(rp.paralelo, -f), 0, 'el paralelo sale por F (o parece venir de F)');
    if (rp.foco) cerca(rp.foco.pend, 0, 'el que va por F sale paralelo');
    cerca(rp.vertice.yM, 0, 'el del vértice toca el espejo en el eje');
    cerca(rp.vertice.pend, -rp.vertice.uEntra, 'el del vértice sale simétrico');
    if (rp.centro) cerca(rp.centro.pend, rp.centro.uEntra, 'el que va por C vuelve por el mismo camino');
    // Imagen real: delante del espejo (x < 0). Virtual: detrás (x > 0).
    assert.equal(r.x < 0, r.i > 0);
  });
}

test('objeto en F: los rayos reflejados salen paralelos entre sí', () => {
  const rayos = motor.abanico(10, 10, 4, 16, 7);
  for (const r of rayos) cerca(r.pend, rayos[0].pend, 'pendiente');
});

// 3. La imagen no depende del ojo
test('abanico: todos los rayos reflejados pasan por el punto imagen', () => {
  for (const [o, f, h] of [[15, 10, 4], [30, 10, 4], [5, 10, 3], [10, -10, 4], [30, -10, 4], [40, -15, 6]]) {
    const r = motor.imagen(o, f, h);
    for (const rayo of motor.abanico(o, f, h, 20, 11)) {
      cerca(motor.alturaEn(rayo, r.x), r.h, `o=${o} f=${f} yM=${rayo.yM}`, 1e-9);
    }
  }
});

test('mover el ojo no mueve la imagen: el rayo que llega a cada ojo sale del mismo punto', () => {
  for (const [o, f, h] of [[5, 10, 3], [15, 10, 4], [30, -10, 4]]) {
    const r = motor.imagen(o, f, h);
    // Ojos repartidos delante del espejo (para la imagen real, más allá de ella).
    const xs = r.real ? [-38, -45, -60] : [-8, -20, -35];
    for (const xe of xs) for (const ye of [-9, -3, 0, 4, 9]) {
      const rayo = motor.rayoAlOjo(o, f, h, xe, ye);
      cerca(motor.alturaEn(rayo, xe), ye, 'el rayo llega al ojo', 1e-9);
      cerca(motor.alturaEn(rayo, r.x), r.h, `ojo en (${xe}, ${ye}): la imagen sigue en su sitio`, 1e-9);
      // Y es un rayo de verdad: sale de la punta del objeto.
      cerca(rayo.yM - rayo.uEntra * o, h, 'el rayo sale de la punta del objeto', 1e-9);
    }
  }
});

test('rayoAlOjo: dice si el rayo cae fuera del espejo', () => {
  const dentro = motor.rayoAlOjo(5, 10, 3, -20, 2, 20);
  assert.ok(dentro.enEspejo);
  const fuera = motor.rayoAlOjo(5, 10, 3, -20, -60, 20);
  assert.ok(!fuera.enEspejo);
});

test('retrovisor: el convexo ve un campo más ancho que un espejo plano del mismo tamaño', () => {
  for (const [xe, ye] of [[-30, -5], [-20, 0], [-40, 3]]) {
    const cv = motor.campoVisual(xe, ye, -10, 12), pl = motor.campoVisual(xe, ye, Infinity, 12);
    assert.ok(cv.angulo > pl.angulo, `ojo en (${xe}, ${ye})`);
  }
  // Espejo plano: el borde reflejado es simétrico al rayo que llega.
  const p = motor.campoVisual(-20, 0, Infinity, 12);
  // Llega subiendo (u = 6/20) y sale hacia la izquierda, también subiendo: dy/dx = -6/20.
  cerca(p.bordes[0].pend, -6 / 20, 'reflexión en espejo plano');
});

// 4. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta y pasos', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(p.verificar && p.verificar.espera, `${p.id}: falta verificar`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
    const v = p.verificar, e = v.espera;
    if (v.R !== undefined) cerca(Math.abs(v.f), v.R / 2, `${p.id}: f = R/2`);
    const r = motor.imagen(v.o, v.f, v.h === undefined ? 1 : v.h);
    if (e.infinito) { assert.ok(r.inf, `${p.id}: se esperaba imagen en el infinito`); return; }
    assert.ok(!r.inf, `${p.id}: el motor no da imagen`);
    if ('i' in e) cerca(r.i, e.i, `${p.id} i`);
    if ('A' in e) cerca(r.m, e.A, `${p.id} A`);
    if ('hi' in e) cerca(r.h, e.hi, `${p.id} altura de la imagen`);
    if ('xEspejo' in e) cerca(r.x, e.xEspejo, `${p.id} posición de la imagen del espejo`);
    if ('xLente' in e) cerca(motor.hojaDeSalida(v.o, v.f, v.h === undefined ? 1 : v.h, 0).imagen.x, e.xLente, `${p.id} posición de la imagen de la lente`);
  });
}

// 5. El doblez
const K = motor.PROYECCION;
const lenteI = (o, f) => 1 / (1 / f - 1 / o);   // la lente delgada, escrita aquí aparte
const pasosS = (n) => Array.from({ length: n + 1 }, (_, j) => j / n);
const grillaOF = [];
for (const o of [3, 5, 8, 12, 15, 25, 30, 45]) for (const f of [-20, -10, -6, 6, 10, 20]) if (Math.abs(o - f) > 1e-9) grillaOF.push([o, f]);

test('doblez 1 · extremos: con s = 0 la hoja está abierta y con s = 1 cae en (−x, y), con cualquier k', () => {
  for (const k of [K, { kx: 0.3, ky: 0.5 }, { kx: -0.6, ky: 0.2 }])
    for (const x of [-30, -7.5, 0, 4, 22]) for (const y of [-11, 0, 3.5]) {
      const a = motor.plegar(x, y, 0, k), b = motor.plegar(x, y, 1, k);
      cerca(a.x, x, 's = 0, x', 1e-12); cerca(a.y, y, 's = 0, y', 1e-12); cerca(a.z, 0, 's = 0, z', 1e-12);
      cerca(b.x, -x, 's = 1, x', 1e-12); cerca(b.y, y, 's = 1, y', 1e-12); cerca(b.z, 0, 's = 1, z', 1e-12);
    }
});

test('doblez 2 · el giro es rígido: cada punto conserva su distancia a la bisagra en todo s', () => {
  for (const s of pasosS(40)) for (const x of [-25, -5, 3, 30]) {
    const p = motor.plegar(x, 2, s);
    cerca(Math.hypot(p.x - K.kx * p.z, p.z), Math.abs(x), `x = ${x}, s = ${s}`, 1e-9);
  }
  for (const s of pasosS(20)) cerca(motor.hojaDeSalida(15, 10, 4, s).distanciaBisagra, 30, `distancia de la imagen, s = ${s}`, 1e-12);
});

test('doblez 3 · en cada cuadro, los rayos plegados (o sus prolongaciones) pasan por la imagen plegada', () => {
  const conf = datos.casos.filter(c => c.fn === 'imagen' && !c.espera.inf).map(c => c.args)
    .concat([[10.5, 10, 3], [40, -25, 5], [1, 10, 2]]);
  for (const [o, f, h] of conf) for (const s of pasosS(20)) {
    const H = motor.hojaDeSalida(o, f, h, s), I = H.imagen;
    assert.ok(H.rayos.length >= 3, `o=${o} f=${f}: tres rayos`);
    for (const r of H.rayos) {
      const ax = r.hasta.x - r.desde.x, ay = r.hasta.y - r.desde.y, bx = I.x - r.desde.x, by = I.y - r.desde.y;
      const cruz = (ax * by - ay * bx) / Math.max(1, Math.hypot(ax, ay));
      cerca(cruz, 0, `o=${o} f=${f} s=${s} rayo ${r.nombre}`, 1e-7);
      if (!I.real) assert.ok(r.prolongacion, 'imagen virtual: el rayo trae su prolongación');
    }
  }
});

test('doblez 4 · doblada es el espejo: la pendiente de cada rayo es la de reflejar y la imagen cae en imagen().x', () => {
  for (const [o, f] of grillaOF) {
    const H = motor.hojaDeSalida(o, f, 3, 1), r = motor.imagen(o, f, 3);
    cerca(H.imagen.x, r.x, `o=${o} f=${f}: x`, 1e-9); cerca(H.imagen.y, r.h, `o=${o} f=${f}: y`, 1e-9);
    for (const ry of H.rayos) {
      cerca(ry.pendPantalla, motor.reflejar(ry.yM, ry.uEntra, f), `o=${o} f=${f} rayo ${ry.nombre}`, 1e-9);
      cerca(motor.reflejar(ry.yM, ry.uEntra, f), -motor.pendienteLente(ry.yM, ry.uEntra, f), 'reflejar = −pendienteLente', 1e-12);
    }
  }
});

test('doblez 5 · abierta es la lente: la imagen queda en x = 1/(1/f − 1/o), al otro lado si es real', () => {
  for (const [o, f] of grillaOF) {
    const H = motor.hojaDeSalida(o, f, 2, 0);
    cerca(H.imagen.x, lenteI(o, f), `o=${o} f=${f}`, 1e-9);
    assert.equal(H.imagen.x > 0, H.imagen.real, 'real: al otro lado de la lente');
  }
});

test('doblez 6 · focos: doblada, F′ cae sobre F (x = −f) y el doble foco sobre C (x = −2f)', () => {
  for (const f of [-15, -10, 8, 10, 20]) {
    const H = motor.hojaDeSalida(30, f, 4, 1);
    cerca(H.focoPrima.x, -f, `f=${f} F′`, 1e-12); cerca(H.focoPrima.y, 0, 'F′ en el eje', 1e-12);
    cerca(H.dobleFoco.x, -2 * f, `f=${f} C`, 1e-12);
  }
});

test('doblez 7 · la regla de i se voltea con la hoja: doblada, la marca v queda en x = −v; el sentido cambia una vez, en sDeCanto', () => {
  const H = motor.hojaDeSalida(15, 10, 4, 1, { regla: [-10, -5, 5, 10, 20, 30] });
  for (const m of H.regla) { cerca(m.x, -m.v, `marca ${m.v}`, 1e-12); assert.equal(m.x < 0, m.v > 0, 'positiva: delante'); }
  const sc = motor.sDeCanto();
  let cambios = 0, ant = motor.hojaDeSalida(15, 10, 4, 0).sentido;
  for (const s of pasosS(500).slice(1)) {
    const v = motor.hojaDeSalida(15, 10, 4, s).sentido;
    if (v !== ant && v !== 0) { cambios++; assert.ok(Math.abs(s - sc) < 0.003, `cambia en s = ${s}, cerca de ${sc}`); ant = v; }
  }
  assert.equal(cambios, 1);
});

test('doblez 8 · de canto: anchoHoja(sDeCanto) = 0 y deCanto vale solo en un tramo seguido alrededor de s*', () => {
  const sc = motor.sDeCanto();
  cerca(motor.anchoHoja(sc), 0, 'ancho de canto', 1e-12);
  cerca(sc, Math.atan(4) / Math.PI, 's* = atan 4/π', 1e-12);
  const marcas = pasosS(1000).map(s => motor.hojaDeSalida(15, 10, 4, s).deCanto);
  const ini = marcas.indexOf(true), fin = marcas.lastIndexOf(true);
  assert.ok(ini > 0 && fin < 1000, 'no está de canto en los extremos');
  for (let j = ini; j <= fin; j++) assert.ok(marcas[j], 'el tramo de canto es seguido');
  assert.ok(ini / 1000 < sc && fin / 1000 > sc, 'el tramo contiene s*');
});

test('doblez 9 · arrastre: sMasCercano devuelve el s de cada punto del recorrido de la pestaña, y 0 o 1 fuera de él', () => {
  for (const [W, yH] of [[34, 14], [20, -5], [10, 0]]) for (const s of pasosS(50)) {
    const p = motor.plegar(W, yH, s);
    cerca(motor.sMasCercano(p, W, yH), s, `W=${W} yH=${yH} s=${s}`, 1e-9);
  }
  // Fuera de la media elipse (del lado de la hoja abierta o de la doblada): 0 o 1, sin saltos raros.
  assert.equal(motor.sMasCercano({ x: 40, y: 30 }, 34, 14), 0);
  assert.equal(motor.sMasCercano({ x: -40, y: 30 }, 34, 14), 1);
  let ant = 0;
  for (let x = 40; x >= -40; x -= 0.5) {
    const s = motor.sMasCercano({ x, y: 14 + 0.5 * K.ky * 34 * Math.max(0, 1 - (x / 40) ** 2) }, 34, 14);
    assert.ok(s >= ant - 1e-9, `monótono al barrer x = ${x}`); ant = s;
  }
});

test('doblez 10 · errores de entrada', () => {
  assert.throws(() => motor.plegar(1, 1, 1.2), RangeError);
  assert.throws(() => motor.plegar(1, 1, -0.1), RangeError);
  assert.throws(() => motor.plegar(1, 1, NaN), RangeError);
  assert.throws(() => motor.plegar('1', 1, 0.5), TypeError);
  assert.throws(() => motor.plegar(1, Infinity, 0.5), TypeError);
  assert.throws(() => motor.anchoHoja(2), RangeError);
  assert.throws(() => motor.hojaDeSalida(0, 10, 4, 0.5), RangeError);
  assert.throws(() => motor.hojaDeSalida(15, 0, 4, 0.5), RangeError);
  assert.throws(() => motor.hojaDeSalida(15, 10, 4, 1.5), RangeError);
  assert.throws(() => motor.pendienteLente(1, 0, 0), RangeError);
  assert.throws(() => motor.sMasCercano({ x: 0, y: 0 }, 0, 14), RangeError);
  assert.throws(() => motor.sMasCercano({ x: 0, y: 0 }, 34, 14, { kx: -0.25, ky: 0 }), RangeError);
  cerca(motor.pendienteLente(4, 0.1, Infinity), 0.1, 'vidrio plano: no desvía', 1e-12);
});

test('doblez 11 · papel p10: la lente y el espejo dan i = 36 y A = −2; la lente la pone en x = +36 y el espejo en x = −36', () => {
  const p10 = papel.problemas.find(p => p.id === 'p10');
  assert.ok(p10, 'falta el p10');
  const v = p10.verificar;
  const r = motor.imagen(v.o, v.f, 1);
  cerca(r.i, 36, 'i'); cerca(r.m, -2, 'A');
  cerca(motor.hojaDeSalida(v.o, v.f, 1, 0).imagen.x, 36, 'lente'); cerca(motor.hojaDeSalida(v.o, v.f, 1, 1).imagen.x, -36, 'espejo');
  cerca(lenteI(v.o, v.f), 36, 'lente, con la fórmula escrita aquí');
});
