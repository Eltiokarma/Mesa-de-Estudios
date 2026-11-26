'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const banco = require('../../../catalogo/pruebas/fisica.json');
const verificar = require('../../../catalogo/pruebas/verificar.js').verificadores;
const cerca = (a, b) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${a} no coincide con ${b}`);

// Oráculo: fuerza mediante dos cantidades de movimiento; centro mediante velocidad del conjunto.
// No importa el motor de choques ni el generador de práctica.
function independiente(par, d) {
  if (par === 'fis-33') {
    const pAntes = d.masaG * d.rapidezLlegada / 1000;
    const pDespues = -d.masaG * d.rapidezSalida / 1000;
    const convertirDuracion = 1000 / d.duracionMs;
    return { correcta: (pDespues - pAntes) * convertirDuracion, errores: {
      'IC9-ignora-rebote': -pAntes * convertirDuracion,
      'IC9-omite-sentido-salida': (-pDespues - pAntes) * convertirDuracion,
      'IC9-resta-invertida': (pAntes - pDespues) * convertirDuracion,
      'IC9-impulso-como-fuerza': pDespues - pAntes,
    } };
  }
  const fraccionA = d.mA / (d.mA + d.mB), fraccionB = 1 - fraccionA;
  const inicial = fraccionA * d.xA + fraccionB * d.xB;
  const velocidad = fraccionA * d.rapidezA - fraccionB * d.rapidezB;
  return { correcta: inicial + velocidad * d.t, errores: {
    'IC9-centro-sin-avance': inicial,
    'IC9-posicion-promedio-simple': (d.xA + d.xB) / 2 + velocidad * d.t,
    'IC9-velocidad-promedio-simple': inicial + d.t * (d.rapidezA - d.rapidezB) / 2,
    'IC9-velocidades-sin-signo': inicial + d.t * (fraccionA * d.rapidezA + fraccionB * d.rapidezB),
  } };
}

test('Impulso y choques: cuatro formas de reserva con fórmulas visibles y una sola respuesta', () => {
  assert.equal(banco.pares.length, 10, 'las formas activas conservan diez pares');
  const pares = banco.reserva.filter(p => ['fis-33', 'fis-34'].includes(p.par));
  assert.equal(pares.length, 2);
  for (const par of pares) for (const forma of ['A', 'B']) {
    const caso = par[forma], esperado = independiente(par.par, caso.datos);
    assert.equal(par.unidad, 'fisica.impulso-y-choques');
    assert.equal(par.plantilla, 'fis-impulso-choques');
    assert.match(caso.enunciado, /Fórmula/);
    const valores = caso.opciones.map(o => o.valor);
    assert.equal(new Set(valores).size, 5);
    assert.equal(caso.opciones.filter(o => o.correcta).length, 1);
    assert.equal(valores.filter(v => Math.abs(v - esperado.correcta) < 1e-9).length, 1);
    for (const opcion of caso.opciones) {
      const valor = opcion.correcta ? esperado.correcta : esperado.errores[opcion.error];
      cerca(opcion.valor, valor);
      cerca(Number(opcion.texto.replace('−', '-').replace(',', '.').split(' ')[0]), valor);
      if (!opcion.correcta) assert.equal(banco.errores[opcion.error].respaldo, 'hipotesis');
    }
  }
});

test('Impulso y choques: verificadores del curso recalculados en cuatrocientas variantes', () => {
  for (let s = 0; s < 400; s++) {
    const datos = {
      'fis-33': { masaG: 275 + 25 * (s % 13), rapidezLlegada: 3 + s % 8, rapidezSalida: 1 + s % 5, duracionMs: 20 + 10 * (s % 12) },
      'fis-34': { mA: 1.25 + s % 7, mB: 2.75 + s % 7, xA: -2 + s % 5, xB: 6 + s % 7, rapidezA: 0.5 + (s % 5) / 10, rapidezB: 0.1 + (s % 3) / 10, t: 1 + s % 6 },
    };
    for (const [par, d] of Object.entries(datos)) {
      const obtenido = verificar[par](d), esperado = independiente(par, d);
      cerca(obtenido.correcta, esperado.correcta);
      assert.deepEqual(Object.keys(obtenido.errores).sort(), Object.keys(esperado.errores).sort());
      for (const error of Object.keys(esperado.errores)) cerca(obtenido.errores[error], esperado.errores[error]);
    }
  }
});
