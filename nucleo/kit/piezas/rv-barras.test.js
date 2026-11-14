// Pruebas de la pieza «rv-barras»: el largo de cada barra es proporcional a (valor − min), el corte del eje aparece
// solo si la escala no empieza en cero, el alto no cambia con el estado, sin NaN ni colores fijos, texto de 14 o más.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rv-barras.js');

const datos = (min = 0) => ({ titulo: 'Venta de quinua (toneladas)', texto: 'En 2025, las dos ferias vendieron más que el año anterior, sobre todo la de Juliaca.', barras: [{ id: 'a', nombre: 'Puno', valor: 82 }, { id: 'b', nombre: 'Juliaca', valor: 88 }], min, max: 100, unidad: ' t', fuente: 'Datos inventados' });
const anchos = s => [...s.matchAll(/class="rv-barra[^"]*" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/g)].map(m => +m[2]);

test('fidelidad: con la escala desde 0, el largo es proporcional al valor', () => {
  const [a, b] = anchos(P.dibujar(datos(0)));
  assert.ok(Math.abs(a / b - 82 / 88) < 0.01);
});

test('con la escala desde 80, el largo es proporcional a valor − 80 y se dibuja el corte', () => {
  const s = P.dibujar(datos(80));
  const [a, b] = anchos(s);
  assert.ok(Math.abs(a / b - 2 / 8) < 0.02);
  assert.match(s, /rv-corte/);
  assert.ok(!/rv-corte/.test(P.dibujar(datos(0))));
});

test('alto fijo por datos, puro, sin NaN ni colores fijos, texto de 14 o más, párrafo dentro del lienzo', () => {
  const altos = new Set();
  for (const e of [{}, { marcas: { a: 'i', b: 'h' }, texto: 'i', titulo: 'h' }, { valores: false, nuevo: ['a'] }]) {
    const s = P.dibujar(datos(80), e);
    assert.equal(s, P.dibujar(datos(80), e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'h', 'd'].includes(c));
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.alt(datos(80)), /no empieza en cero/);
});

test('extremo y valorEn: la manija cae en la punta de su barra y la inversa devuelve su valor', () => {
  for (const min of [0, 60, 80]) {
    const d = datos(min), svg = P.dibujar(d, {}), alto = +svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
    for (const b of d.barras) {
      const p = P.extremo(d, b.id);
      assert.ok(p.x > 0 && p.x <= 320 && p.y > 0 && p.y < alto);
      assert.ok(Math.abs(P.valorEn(d, p.x) - b.valor) < 1e-9);
    }
    // La punta coincide con el ancho del rect de la barra.
    const L = P.disponer(d), r = svg.match(/class="rv-barra" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/);
    assert.ok(Math.abs(+r[1] + +r[2] - P.extremo(d, 'a').x) < 0.02);
    assert.ok(L.barras.length === 2);
  }
  assert.equal(P.extremo(datos(), 'nada'), null);
});
