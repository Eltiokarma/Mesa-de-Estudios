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

// 3. Abanico de rayos ("¿qué pasa si…?"): lo que muestra la escena debe salir
//    de la ecuación, no de una animación hecha a mano.
test('abanico: todos los rayos que pasan llegan al punto imagen, se tape o no media lente', () => {
  for (const [o, f, y0] of [[30, 10, 4], [24, 8, 2], [15, 10, -3], [50, 20, 6]]) {
    const r = motor.imagen(o, f, y0);
    for (const tapa of [null, 'arriba', 'abajo']) {
      const rayos = motor.abanico(o, f, y0, 12, 9, tapa);
      assert.equal(rayos.length, 9);
      const pasan = rayos.filter(x => !x.tapado);
      assert.equal(pasan.length, tapa ? 5 : 9, 'tapar media lente deja pasar la mitad (el rayo del centro pasa)');
      for (const x of pasan) {
        // Altura del rayo en x = i, con la pendiente de salida que da la regla de la lente.
        const y = x.yL + x.uSale * r.i;
        assert.ok(Math.abs(y - r.h) < 1e-9, `o=${o} f=${f} tapa=${tapa}: el rayo llega a ${y}, la imagen está en ${r.h}`);
      }
    }
  }
});

test('mancha en la pantalla: cero en la imagen, crece al correr la pantalla y escala con el diámetro', () => {
  const o = 30, f = 10, y0 = 4, r = motor.imagen(o, f, y0); // i = 15, imagen a -2
  const nitida = motor.mancha(o, f, y0, 12, r.i, null);
  assert.ok(nitida.ancho < 1e-9 && Math.abs(nitida.centro - r.h) < 1e-9);
  // Tapar media lente: el punto imagen sigue en el mismo lugar, con la mitad de luz.
  const media = motor.mancha(o, f, y0, 12, r.i, 'arriba');
  assert.ok(media.ancho < 1e-9 && Math.abs(media.centro - r.h) < 1e-9 && media.luz === 0.5);
  // Fuera de la imagen: mancha de ancho D·|1 + xp/o − xp/f|, igual a la que da el trazado.
  for (const xp of [8, 12, 20, 30]) {
    const m = motor.mancha(o, f, y0, 12, xp, null);
    const ys = motor.abanico(o, f, y0, 12, 2, null).map(x => x.yL + x.uSale * xp);
    assert.ok(Math.abs(m.ancho - Math.abs(ys[1] - ys[0])) < 1e-9, `xp=${xp}`);
    assert.ok(m.ancho > 0.5, `xp=${xp}: fuera de la imagen debe haber mancha`);
  }
  // Lente el doble de ancha: misma imagen, la mancha desenfocada se duplica.
  const a = motor.mancha(o, f, y0, 6, 20, null).ancho, b = motor.mancha(o, f, y0, 12, 20, null).ancho;
  assert.ok(Math.abs(b - 2 * a) < 1e-9);
});

// 4. Problemas de papel (regla 6): cada respuesta escrita debe coincidir con el motor.
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta y pasos', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(p.verificar, `${p.id}: falta verificar`);
  }
});
for (const p of papel.problemas) {
  test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
    const v = p.verificar;
    const { pasos } = resolver({ o1: v.o1, h: v.h ?? 1, lentes: v.lentes });
    const fin = pasos[pasos.length - 1];
    if (v.espera.infinito) { assert.ok(fin.inf, `${p.id}: se esperaba imagen en el infinito`); return; }
    assert.ok(!fin.inf && pasos.length === v.lentes.length, `${p.id}: la cadena se cortó`);
    if ('i' in v.espera) cerca(fin.i, v.espera.i, `${p.id} i`);
    if ('A' in v.espera) cerca(motor.aumentoTotal(pasos), v.espera.A, `${p.id} A`);
    if ('hi' in v.espera) cerca(fin.h, v.espera.hi, `${p.id} altura de la imagen`);
    if ('x' in v.espera) cerca(fin.x, v.espera.x, `${p.id} posición final`);
  });
}
