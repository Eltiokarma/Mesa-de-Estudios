// Pruebas de lo que dice la carta completa (Kit.Tabla.ficha, en nucleo/kit/tabla/tabla.js). El componente se mide
// en el navegador con herramientas/medir-tabla.js; aquí se carga tal cual en un contexto de Node sin DOM.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { console };
ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['datos.js', 'arreglos.js', 'mesa.js', 'lentes.js', 'tabla.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, { filename: f });
}
const { ficha } = ctx.Kit.Tabla;
const valor = (f, k) => (f.lineas.find(l => l.k === k) || {}).v;

test('hierro: peso abreviado con coma decimal, valor completo y ubicación con grupo A/B', () => {
  const f = ficha(26);
  assert.equal(f.titulo, 'Fe · hierro');
  assert.equal(valor(f, 'Peso atómico estándar'), '55,845 ± 0,002');
  assert.equal(valor(f, 'Valor completo'), '55,845(2)');
  assert.equal(valor(f, 'En la tabla'), 'Periodo 4 · Grupo 8 (VIIIB) · Bloque d');
});

test('un intervalo de la CIAAW se escribe con punto y coma entre los extremos', () => {
  assert.equal(valor(ficha(1), 'Valor completo'), '[1,007 84; 1,008 11]');
  assert.equal(valor(ficha(1), 'Peso atómico estándar'), '1,0080 ± 0,0002');
});

test('sin peso estándar: lo dice, y da el número másico entre corchetes (varios si no se distinguen)', () => {
  const tc = ficha(43);
  assert.equal(valor(tc, 'Peso atómico estándar'), 'No tiene: la CIAAW no lo asigna');
  assert.equal(valor(tc, 'Número másico del isótopo más estable'), '[97] o [98] (no se distinguen)');
  assert.equal(valor(ficha(118), 'Número másico del isótopo más estable'), '[294]');
  assert.equal(valor(ficha(118), 'Valor completo'), undefined);
});

test('las series: periodo y fila aparte, sin inventar grupo ni bloque', () => {
  assert.equal(valor(ficha(57), 'En la tabla'), 'Periodo 6 · Lantánidos, en la fila aparte');
  assert.equal(valor(ficha(92), 'En la tabla'), 'Periodo 7 · Actínidos, en la fila aparte');
});

test('grupos A y B como en las academias', () => {
  const g = z => valor(ficha(z), 'En la tabla');
  assert.match(g(11), /Grupo 1 \(IA\)/);
  assert.match(g(13), /Grupo 13 \(IIIA\)/);
  assert.match(g(29), /Grupo 11 \(IB\)/);
  assert.match(g(30), /Grupo 12 \(IIB\)/);
  assert.match(g(28), /Grupo 10 \(VIIIB\)/);
  assert.match(g(2), /Grupo 18 \(VIIIA\) · Bloque s/);
});

test('otros nombres y fuente; «sin dato» solo en las propiedades, nunca un valor vacío', () => {
  assert.equal(valor(ficha(74), 'También se llama'), 'tungsteno');
  for (let z = 1; z <= 118; z++) {
    const f = ficha(z);
    for (const l of f.lineas) {
      assert.ok(l.v && !/undefined|NaN|null/i.test(l.v), `${f.titulo}: ${l.k}`);
      if (!l.propiedad) assert.ok(!/sin dato/.test(l.v), `${f.titulo}: ${l.k}`);
    }
    assert.match(f.fuente, /CIAAW|NUBASE2020/);
    assert.match(f.fuente, /NIST/);
  }
});

test('la carta completa trae las propiedades con su tipo', () => {
  assert.equal(valor(ficha(11), 'Energía de ionización'), '496 kJ/mol');
  assert.equal(valor(ficha(1), 'Energía de ionización'), '1 312 kJ/mol (calculado)');
  assert.equal(valor(ficha(118), 'Energía de ionización'), 'sin dato');
  assert.equal(valor(ficha(9), 'Electronegatividad (Pauling)'), '3,98');
  assert.equal(valor(ficha(95), 'Electronegatividad (Pauling)'), 'sin dato');
  assert.equal(valor(ficha(35), 'Estado a 25 °C'), 'líquido');
  assert.equal(valor(ficha(14), 'Clase de elemento'), 'semimetal');
});
