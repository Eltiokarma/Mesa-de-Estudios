// Pruebas de la pieza «arit-queque» (el queque de la promoción, Números racionales): se dibuja sin NaN ni colores fijos,
// es pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (un queque mide lo mismo en todas las
// bandejas de la figura, cada porción 1/partes del queque y cada marca justo lo que dice); nunca usa verde. Con números
// (docs/molde-unidad.md §6): todo cabe con 4 de margen, ningún texto pisa a otro ni a una bandeja, y el alto no salta
// entre los pasos de una figura. Las figuras de la teoría que usan la pieza se revisan en numeros-racionales.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./arit-queque.js');

const B = (a, b, o = {}) => Object.assign({ partes: b, marcas: [{ c0: 0, c1: a, color: 'o' }], rotulo: [['Vendido: '], [String(a), 'o', 700], ['/'], [String(b), 'i', 700]] }, o);
const MUESTRAS = [
  { bandejas: [B(3, 5)] },
  { bandejas: [B(3, 5, { filas: 5 })] },
  { maxQueques: 2, bandejas: [B(5, 7), B(7, 4, { queques: 2 })] },
  { bandejas: [{ partes: 3, filas: 4, cortaFilas: [1, 3], marcas: [{ c0: 0, c1: 1, color: 'o' }, { c0: 1, c1: 3, f0: 0, f1: 1, color: 'o', estilo: 'rayado' }, { c0: 1, c1: 3, f0: 1, f1: 4, color: 'f', estilo: 'borde' }], rotulo: 'Mañana y tarde', nota: [['Queda: '], ['1/2', 'f', 700]] }] },
  { maxQueques: 3, bandejas: [B(11, 4, { queques: 3 })], letrero: 'Bandeja', pie: 'pie' },
  { bandejas: [{ partes: 6, marcas: [{ c0: 0, c1: 2, color: 'o' }] }, { partes: 10, marcas: [{ c0: 0, c1: 10 / 3, color: 'o' }] }] },
  { bandejas: [B(1, 2)], pasos: [{ bandejas: [B(1, 2)] }, { bandejas: [B(1, 2, { filas: 3 }), B(2, 3)] }, { bandejas: [B(1, 2), B(2, 3), B(3, 4)] }] },
  {},
];
const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-queque'], P));

test('sin NaN ni colores fijos, sin verde ni ids, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-d\)/.test(s), 'sin verde');
    assert.ok(!/\sid="|filter|<image|url\(#/.test(s), 'sin ids ni patrones');
    assert.equal(s, P.dibujar(d, { paso }), 'pura');
    assert.match(s, /data-objeto="queque" data-prueba="si"/);
    assert.match(s, /^<svg [^>]*viewBox="0 0 320 \d+"/);
    const a = P.alt(d, { paso });
    assert.ok(a.length > 20 && !/undefined|NaN/.test(a), a);
  }
});

test('fiel: un queque mide lo mismo en todas las bandejas; cada marca mide sus porciones', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const g = P.geometria(d, { paso });
    for (const f of g.filas.filter(x => x.visible)) {
      for (const q of f.queque) assert.ok(Math.abs((q.x1 - q.x0) - g.ancho) < 1e-9, 'el queque mide lo mismo en toda la figura');
      assert.ok(Math.abs(f.ancho1 * f.partes - g.ancho) < 1e-9, 'cada porción es 1/partes del queque');
      for (const m of f.marcas) {
        const ancho = m.trozos.reduce((u, t) => u + (t.x1 - t.x0), 0), alto = m.trozos[0].y1 - m.trozos[0].y0;
        assert.ok(Math.abs(ancho - (m.c1 - m.c0) * f.ancho1) < 1e-9, 'la marca mide sus porciones');
        assert.ok(Math.abs(alto - (m.f1 - m.f0) * g.ALTO / f.filas) < 1e-9, 'y sus pedazos');
      }
    }
  }
});

test('encuadre y rótulos: todo cabe con 4 de margen, nada se pisa y el alto no salta entre pasos', () => {
  const { W, M } = P.constantes;
  for (const d of MUESTRAS) {
    const altos = new Set();
    for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
      const g = P.geometria(d, { paso });
      altos.add(g.H);
      for (const c of [...g.objetos, ...g.textos]) assert.ok(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9, `se sale «${c.txt || c.que}»`);
      for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) assert.ok(!solapan(g.textos[i], g.textos[j]), `se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
      for (const t of g.textos) for (const o of g.objetos) assert.ok(!solapan(t, o), `«${t.txt}» pisa ${o.que}`);
      for (let i = 0; i < g.objetos.length; i++) for (let j = i + 1; j < g.objetos.length; j++) assert.ok(!solapan(g.objetos[i], g.objetos[j]), 'se pisan dos bandejas');
    }
    assert.equal(altos.size, 1, 'el alto no salta entre los pasos');
  }
});
