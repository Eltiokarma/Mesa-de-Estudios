// Pruebas comunes a todo generador del formato "predicciones" (se usan desde cada
// plantillas/<id>/generador.test.js). Cada módulo agrega su cálculo independiente.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RESPALDOS = ['documentado', 'parcial', 'hipotesis'];
const raiz = path.join(__dirname, '..');

// igual(esperado, valor): cómo comparar el recálculo independiente con la respuesta. Por defecto,
// números con tolerancia 1e-9; para respuestas de armarTexto, igualdad de claves (===).
const igualNumero = (a, b) => Math.abs(a - b) < 1e-9;

function probarGenerador(gen, { semillas = 400, recalcular, igual = igualNumero } = {}) {
  test(`${gen.id}: la misma semilla da el mismo problema`, () => {
    for (const s of [0, 1, 'entrada-1', 'salida-3']) assert.deepEqual(gen.generar(s), gen.generar(s));
  });

  test(`${gen.id}: ${semillas} problemas bien armados`, () => {
    for (let s = 0; s < semillas; s++) {
      const p = gen.generar(s);
      const alt = p.alternativas;
      assert.ok(alt.length >= 4 && alt.length <= 5, `semilla ${s}: ${alt.length} alternativas`);
      assert.equal(alt.filter(a => a.correcta).length, 1, `semilla ${s}: debe haber una sola correcta`);
      assert.equal(new Set(alt.map(a => a.texto)).size, alt.length, `semilla ${s}: alternativas repetidas`);
      assert.deepEqual(alt.map(a => a.letra), ['A', 'B', 'C', 'D', 'E'].slice(0, alt.length));
      for (const a of alt.filter(a => !a.correcta)) {
        assert.ok(a.error && a.error.id && a.error.explicacion, `semilla ${s}: error sin id o explicación`);
        assert.ok(RESPALDOS.includes(a.error.respaldo), `semilla ${s}: respaldo inválido`);
        if (a.error.fuente) assert.ok(fs.existsSync(path.join(raiz, a.error.fuente)), `no existe ${a.error.fuente}`);
      }
      const correcta = alt.find(a => a.correcta);
      assert.equal(correcta.valor, p.respuesta.valor, `semilla ${s}: la correcta no es la respuesta`);
      if (recalcular) {
        const esperado = recalcular(p);
        assert.ok(igual(esperado, p.respuesta.valor), `semilla ${s}: el cálculo independiente da ${esperado}, el generador ${p.respuesta.valor}`);
      }
      for (const campo of ['enunciado', 'pregunta', 'solucion']) assert.ok(Array.isArray(p[campo]) && p[campo].length, `semilla ${s}: falta ${campo}`);
    }
  });
}

module.exports = { probarGenerador };
