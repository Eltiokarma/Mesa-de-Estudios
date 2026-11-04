// Pruebas del motor del Banco Óptico. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con cálculo independiente, debe salir
//    igual del motor (regla 2 de CLAUDE.md).
// 2. El dibujo no puede contradecir a la ecuación: dos rayos trazados desde la
//    punta del objeto deben cruzarse (o sus prolongaciones, si la imagen es
//    virtual) justo donde la ecuación pone la imagen final.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const tol = datos.tolerancia;

function cerca(real, esperado, que) {
  assert.ok(Math.abs(real - esperado) <= tol,
    `${que}: el motor da ${real}, se esperaba ${esperado} (tolerancia ${tol})`);
}

function resolver(entrada) {
  const sis = motor.sistema(entrada.o1, entrada.h, entrada.lentes);
  // Tolerancia mínima: los casos de prueba piden el valor exacto, sin el
  // "enganche" al foco que usa el deslizador de la escena.
  return { sis, pasos: motor.cadena(sis, 1e-9) };
}

for (const caso of datos.casos) {
  test(`casos.json: ${caso.nombre}`, () => {
    const { pasos } = resolver(caso.entrada);
    const e = caso.esperado;

    if (e.sin_imagen) {
      assert.ok(pasos[pasos.length - 1].inf, 'se esperaba que no hubiera imagen (objeto en el foco)');
      return;
    }

    assert.equal(pasos.length, caso.entrada.lentes.length, 'la cadena se cortó antes de la última lente');
    assert.ok(pasos.every(p => !p.inf), 'una imagen intermedia se fue al infinito');
    if (e.o) e.o.forEach((o, k) => cerca(pasos[k].o, o, `o${k + 1}`));
    if (e.i) e.i.forEach((i, k) => cerca(pasos[k].i, i, `i${k + 1}`));
    if (e.A !== undefined) cerca(motor.aumentoTotal(pasos), e.A, 'A');
    if (e.h_final !== undefined) cerca(pasos[pasos.length - 1].h, e.h_final, 'h final');
  });
}

for (const caso of datos.casos.filter(c => !c.esperado.sin_imagen)) {
  test(`el dibujo coincide con la ecuación: ${caso.nombre}`, () => {
    const { sis, pasos } = resolver(caso.entrada);
    const fin = pasos[pasos.length - 1];
    const xFin = fin.x + 100;

    // Dos rayos distintos desde la punta del objeto: uno paralelo al eje y
    // otro inclinado. Tras la última lente, cada uno es la recta
    // y = y0 + u (x - x0).
    const rectas = [0, -0.1].map(u0 => {
      const r = motor.trazar(sis, u0, xFin);
      const ult = r.en[r.en.length - 1];
      return { x0: ult.x, y0: ult.y, u: ult.uSale };
    });
    const [a, b] = rectas;
    assert.ok(Math.abs(a.u - b.u) > 1e-12, 'los dos rayos salen paralelos: no definen un punto');
    const x = (b.y0 - a.y0 + a.u * a.x0 - b.u * b.x0) / (a.u - b.u);
    const y = a.y0 + a.u * (x - a.x0);

    cerca(x, fin.x, 'posición de la imagen según los rayos');
    cerca(y, fin.h, 'altura de la imagen según los rayos');
  });
}

test('lente sola: el aumento es -i/o, también con imagen virtual', () => {
  for (const [o, f] of [[30, 10], [5, 10], [15, -10]]) {
    const r = motor.imagen(o, f, 1);
    cerca(r.m, -r.i / o, `A con o = ${o}, f = ${f}`);
  }
});
