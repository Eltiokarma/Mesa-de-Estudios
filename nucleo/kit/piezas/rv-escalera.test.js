// Pruebas de la pieza «rv-escalera»: la escalera queda debajo del soporte, dentro del lienzo, sin rótulos que se pisen;
// el alto no cambia con el estado; el peldaño elegido se marca con su color y su trazo; ancla y peldanoEn se
// corresponden (el arrastre suelta en el mismo peldaño), y sin peldaños solo se dibuja el soporte.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./rv-soporte.js');
const P = require('./rv-escalera.js');
const T = require('../trazo.js');

const soporte = { soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'a', titulo: 'Comunicado de la Dirección', para: 'estudiantes y familias', oraciones: [{ id: 'o1', t: 'Desde el lunes, el comedor servirá el desayuno a las 7:15.' }, { id: 'o2', t: 'Así, quienes vienen de Cabana ya no entrarán sin comer.' }] }] };
const datos = { soporte, titulo: 'Escalera de temas', arriba: 'Más amplio', abajo: 'Más estrecho',
  peldanos: ['La vida escolar', 'La comida en el colegio', 'El nuevo horario del desayuno', 'El desayuno de quienes viajan desde lejos', 'La hora del desayuno: 7:15'] };

test('la escalera va debajo del soporte y todo cabe en el lienzo con 4 de margen, sin rótulos que se pisen', () => {
  const L = P.disponer(datos), W = P.constantes.W;
  assert.ok(L.caja.y >= S.disponer(soporte).alto, 'la escalera empieza debajo del soporte');
  assert.ok(L.caja.x >= 4 && L.caja.x + L.caja.w <= W - 4 && L.caja.y + L.caja.h <= L.alto - 4);
  const cajas = [
    { x: L.titulo.x, y: L.titulo.y - 15, w: T.ancho(L.titulo.texto, 16, 700), h: 19, q: 'título' },
    { x: L.arriba.x - T.ancho(L.arriba.texto, 14, 700), y: L.arriba.y - 13, w: T.ancho(L.arriba.texto, 14, 700), h: 17, q: 'arriba' },
    { x: L.abajo.x, y: L.abajo.y - 13, w: T.ancho(L.abajo.texto, 14, 700), h: 17, q: 'abajo' },
    ...L.peldanos.flatMap(p => p.lineas.map(r => ({ x: r.x, y: r.y - 14, w: r.wb, h: 18, q: r.texto }))),
  ];
  for (const c of cajas) assert.ok(c.x >= 4 && c.x + c.w <= W - 4, `«${c.q}» se sale por el costado`);
  for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], b = cajas[j];
    assert.ok(!(a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h), `«${a.q}» pisa a «${b.q}»`);
  }
  // Los peldaños van en orden, sin encimarse.
  L.peldanos.forEach((p, k) => { if (k) assert.ok(p.top >= L.peldanos[k - 1].top + L.peldanos[k - 1].h); });
});

test('el alto no cambia con el estado; puro, sin NaN ni colores fijos; el elegido lleva su color y su trazo', () => {
  const altos = new Set();
  for (const e of [{}, { n: 1, color: 'o' }, { n: 3, color: 'f', nuevo: ['escalera'], soporte: { marcas: { o1: 'i' }, tenue: ['o2'] } }, { n: 5, color: 'o' }]) {
    const s = P.dibujar(datos, e);
    assert.equal(s, P.dibujar(datos, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
  assert.match(P.dibujar(datos, { n: 2, color: 'o' }), /class="rv-peldano"[^>]*var\(--c-o\)[^>]*stroke-dasharray="7 4"/);
  assert.match(P.dibujar(datos, { n: 3, color: 'f' }), /class="rv-peldano"[^>]*var\(--c-f\)[^>]*stroke-dasharray="0.1 6"/);
  assert.match(P.dibujar(datos, {}), /data-objeto="escalera" data-prueba="si"/);
});

test('el arrastre: soltar en la manija de un peldaño da ese mismo peldaño', () => {
  for (let n = 1; n <= datos.peldanos.length; n++) {
    const a = P.ancla(datos, n);
    assert.equal(P.peldanoEn(datos, a), n);
    assert.equal(P.peldanoEn(datos, { x: a.x, y: a.y + 6 }), n);
  }
});

test('sin peldaños, solo el soporte; el texto alternativo nombra la escalera', () => {
  const s = P.dibujar({ soporte }, {});
  assert.ok(!/data-objeto="escalera"/.test(s));
  assert.equal(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1], String(Math.max(60, S.disponer(soporte).alto + 4)));
  assert.match(P.alt(datos), /Escalera de temas, de más amplio a más estrecho: 1\. La vida escolar/);
});

test('textLength solo en renglones llenos que no cierran su peldaño (rv-soporte, LLENO)', () => {
  const largo = Object.assign({}, datos, { peldanos: [...datos.peldanos, 'Doña Rufina, la vendedora que lleva veinte años en la feria'] });
  const L = P.disponer(largo);
  for (const p of L.peldanos) p.lineas.forEach((r, k) => {
    if (k === p.lineas.length - 1) assert.equal(r.estira, false, `«${r.texto}» cierra el peldaño y se estira`);
    if (r.estira) assert.ok(r.wb >= S.constantes.LLENO * (P.constantes.TW - 8));
  });
  for (const n of [0, 6]) {
    const s = P.dibujar(largo, { n, color: 'o' });
    for (const [, t] of s.matchAll(/<text [^>]*textLength="[^"]+"[^>]*>([^<]*)</g)) assert.ok(t.length >= 12, `«${t}» es corto y lleva textLength`);
  }
  assert.ok(!/textLength="[^"]+"[^>]*>La vida escolar</.test(P.dibujar(datos, { n: 1 })), 'un peldaño de un renglón no se estira');
});
