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

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = 1e-6;

function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(Math.abs(real - esperado) <= t,
    `${que}: el motor da ${real}, se esperaba ${esperado} (tolerancia ${t})`);
}
const focalDe = e => e.f !== undefined ? e.f : motor.focal(e.R, e.tipo);

// 1. Casos
for (const caso of datos.casos) {
  test(`casos.json: ${caso.nombre}`, () => {
    const e = caso.entrada, x = caso.esperado;
    const f = focalDe(e);
    if (x.f !== undefined) cerca(f, x.f, 'f = R/2');
    if (x.zona) assert.equal(motor.zona(e.o, f), x.zona, 'zona del objeto');
    const r = motor.imagen(e.o, f, e.h);
    if (x.sin_imagen) { assert.ok(r.inf, 'se esperaba que no hubiera imagen (objeto en el foco)'); return; }
    assert.ok(!r.inf);
    cerca(r.i, x.i, 'i');
    cerca(r.m, x.A, 'A');
    cerca(r.m, -r.i / e.o, 'A = -i/o');
    cerca(r.h, x.h_imagen, 'altura de la imagen');
    cerca(r.x, -x.i, 'posición en el dibujo (la imagen real se dobla hacia el objeto)');
    const d = motor.describir(r);
    assert.equal(d.real, x.real, 'real o virtual');
    assert.equal(d.derecha, x.derecha, 'derecha o invertida');
    assert.equal(d.tamano, x.tamano, 'mayor, menor o igual');
  });
}

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
const configuraciones = datos.casos.filter(c => !c.esperado.sin_imagen).map(c => [c.nombre, c.entrada.o, focalDe(c.entrada), c.entrada.h])
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
  });
}
