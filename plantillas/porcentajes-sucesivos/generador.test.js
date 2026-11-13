// Pruebas del generador de porcentajes: casos.json (verificados aparte con fracciones exactas)
// y un recálculo independiente en cada uno de 400 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: lo que queda tras cada cambio, multiplicado.
function recalcular(p) {
  const { tipo, precio, a, b } = p._datos;
  if (tipo === 'dos-descuentos') return precio * ((100 - a) * (100 - b)) / 10000;
  if (tipo === 'aumento-descuento') return precio * ((100 + a) * (100 - b)) / 10000;
  return 100 - ((100 - a) * (100 - b)) / 100;
}
probarGenerador(gen, { recalcular });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia);
  });
}

test('salen los tres tipos de problema', () => {
  const tipos = new Set(); for (let s = 0; s < 100; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 3);
});

// ---------- Escena viva (docs/escena-viva.md): pieza, arrastre, línea de tiempo y fantasmas ----------
const Kit = require('../../nucleo/kit/kit.js');
const barra = require('../../nucleo/kit/piezas/barra-porcentaje.js');
const LT = require('../../nucleo/kit/linea-tiempo.js');

test('escena viva: la pieza existe y su resultado es la respuesta del generador', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.equal(p.escena.pieza, 'barra-porcentaje');
    assert.ok(Kit.piezas[p.escena.pieza], 'la pieza está en el catálogo del kit');
    assert.ok(typeof p.escena.alt === 'string' && p.escena.alt.length > 20);
    assert.ok(Math.abs(barra.controles(p.escena.datos).respuesta - p.respuesta.valor) < 1e-9, `semilla ${s}`);
    const fin = barra.dibujar(p.escena.datos, LT.estado(p.pasos, p.pasos.length));
    assert.ok(fin.includes(`${Kit.formatear(p.respuesta.valor)}${p.respuesta.unidad === '%' ? ' %' : ''} ✓`), `semilla ${s}: el final no dibuja la respuesta`);
    assert.ok(!/NaN|undefined|null|Infinity/.test(fin));
  }
});

test('escena viva: presupuesto de texto (paso ≤ 14 palabras, error ≤ 20)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(p.pasos.length >= 2);
    for (const paso of p.pasos) {
      assert.ok(Kit.palabras(paso.texto) <= 14, `semilla ${s}: «${Kit.plano(paso.texto)}» pasa de 14 palabras`);
      assert.ok(Array.isArray(paso.ecuacion) && paso.ecuacion.length, `semilla ${s}: paso sin ecuación`);
      assert.ok(!/NaN|undefined|null/.test(Kit.plano(paso.texto) + Kit.plano(paso.ecuacion)));
      assert.ok(paso.estado && Number.isInteger(paso.estado.corte));
    }
    assert.ok(p.pasos[p.pasos.length - 1].estado.final, 'el último paso es el resultado');
    for (const a of p.alternativas.filter(x => x.error)) assert.ok(Kit.palabras(a.error.explicacion) <= 20, `semilla ${s}: «${a.error.explicacion}»`);
  }
});

test('escena viva: cada error con nombre tiene su fantasma, y la marca en su valor equivale a esa alternativa', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    const r = p.respuesta, c = barra.controles(p.escena.datos).marca;
    assert.equal(r.tipo, 'arrastrar'); assert.equal(r.control, 'marca');
    assert.ok(r.paso > 0 && r.tolerancia >= r.paso / 2);
    for (const a of p.alternativas) {
      assert.ok(a.valor >= c.min - 1e-9 && a.valor <= c.max + 1e-9, `semilla ${s}: ${a.texto} no cabe en la barra`);
      if (a.error) assert.deepEqual(p.fantasmas[a.error.id].marca, a.valor);
      // Lo que el alumno puede poner con la marca (múltiplos del paso) cerca de cada alternativa se lee como esa alternativa.
      const puesto = Kit.respuesta.ajustar(a.valor, r.paso, c.min, c.max);
      assert.equal(Kit.respuesta.clasificar(puesto, p.alternativas, r.tolerancia), a, `semilla ${s}: la marca en ${a.texto} no equivale a esa alternativa`);
    }
    assert.equal(Object.keys(p.fantasmas).length, p.alternativas.filter(x => x.error).length);
  }
});
