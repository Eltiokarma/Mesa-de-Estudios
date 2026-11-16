// Pruebas de la pieza «fis-objeto»: cada objeto se dibuja sin NaN ni colores fijos, es puro, lleva su dato y su
// texto alternativo; un objeto desconocido da un SVG vacío y no rompe.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-objeto.js');

const MUESTRAS = {
  cancha: { largo: '105 m' }, bebe: { pantalla: '3,4 kg' }, reloj: { minutos: 45, texto: '45 min' }, lapiz: { cm: 17.5 },
  camion: { carga: '12 t' }, atleta: { distancia: '100 m', tiempo: '10 s' }, caracol: { texto: '3 mm en cada segundo' },
  corazon: { texto: '72 latidos' }, comparar: { titulo: 'En km/h', barras: [{ nombre: 'A', valor: 2, texto: '2 km/h' }, { nombre: 'B', valor: 1, texto: '1 km/h', color: 'i' }] },
  sol: { texto: '3 × 10⁸ m/s' }, cabello: { texto: '70 μm' },
};

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-objeto'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, con su dato y su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  const altos = new Set();
  for (const [objeto, d] of Object.entries(MUESTRAS)) {
    const datos = Object.assign({ objeto }, d), s = P.dibujar(datos);
    assert.ok(!/NaN|undefined|Infinity/.test(s), objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), objeto);
    assert.equal(s, P.dibujar(datos));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    const t = d.largo || d.pantalla || d.texto || d.carga || d.distancia || (d.barras && d.barras[0].texto) || (d.cm && '17,5 cm');
    assert.ok(s.includes(`>${t}<`), `${objeto}: falta «${t}»`);
    assert.ok(P.alt(datos).length > 10 && !/undefined/.test(P.alt(datos)), objeto);
  }
  assert.equal(altos.size, 1);
  assert.ok(!/NaN/.test(P.dibujar({ objeto: 'nada' })));
});
