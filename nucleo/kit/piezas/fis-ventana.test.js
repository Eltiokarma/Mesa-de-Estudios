// Pruebas de la pieza «fis-ventana» (18 nov): las dos combis vistas desde la carretera y desde tu ventana. Abajo, tu
// combi siempre en el centro y la otra en (vB − vA)·t; los postes, quietos arriba y corriendo hacia atrás abajo; lo que se
// pide va con «?» y sin flecha; rótulos que caben con 4 de margen y no se pisan; puro, alto fijo, sin NaN ni colores fijos.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-ventana.js');
const { W, H, CX, PXM, ATRAS_B } = P.constantes;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const MUESTRAS = [];
for (const vB of [-20, -10, -5, 0, 5, 10, 15, 20]) for (const t of [0, 0.5, 1.5, 3, 4]) MUESTRAS.push({ vA: 15, vB, t });
MUESTRAS.push({ vA: 15, vB: 0, t: 1, sinB: true, postes: true }, { vA: 10, vB: 15, t: 0, rotuloRel: '?' }, { vA: 12, vB: -8, t: 0, rotuloRel: '?' }, { vA: 15, vB: 0, t: 1, sinB: true },
  { vA: 15, vB: 20, t: 0, textoA: '54 km/h', textoB: '72 km/h', rotuloRel: '?' }, { vA: 12, vB: 8, t: 0, textoB: '?' }, { vA: 15, vB: -10, t: 0, textoA: '54 km/h', textoB: '36 km/h', rotuloRel: '?' });

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-ventana'], P));

test('desde tu ventana, tu combi está quieta en el centro y la otra se mueve con la diferencia de velocidades', () => {
  for (const d of MUESTRAS.slice(0, 40)) {
    const [arriba, abajo] = P.geometria(d).franjas;
    assert.equal(abajo.xa, CX);
    // B sale ATRAS_B px detrás de A (ronda 2: lado a lado, las dos combis se pisaban).
    assert.ok(Math.abs(abajo.xb - (CX - ATRAS_B + (d.vB - d.vA) * d.t * PXM)) < 1e-9);
    assert.ok(Math.abs(arriba.xa - arriba.xb - ATRAS_B - (d.vA - d.vB) * d.t * PXM) < 1e-9, 'arriba, la misma separación');
  }
  // Los postes: quietos desde la carretera; desde la ventana, corridos hacia atrás lo que avanzó tu combi.
  const p0 = P.geometria({ vA: 15, vB: 5, t: 0 }).franjas, p1 = P.geometria({ vA: 15, vB: 5, t: 0.5 }).franjas;
  assert.deepEqual(p0[0].postes, p1[0].postes);
  assert.ok(Math.abs(p0[1].postes[3] - p1[1].postes[3] - 15 * 0.5 * PXM) < 1e-9);
  assert.equal(P.geometria({ vA: 15, vB: 15, t: 2 }).franjas[1].fb.caja.texto, 'B: parece quieta');
  // Lo que se pide: «?» y sin flecha (su sentido sería la respuesta).
  const q = P.geometria({ vA: 12, vB: -8, t: 0, rotuloRel: '?' }).franjas[1].fb;
  assert.ok(q.quieta && q.caja.texto === 'B: ?');
  assert.match(P.alt({ vA: 12, vB: 8, textoB: '?' }), /velocidad que se pide/);
  assert.ok(!/8 m\/s/.test(P.alt({ vA: 12, vB: 8, textoB: '?' })), 'el texto alternativo tampoco la dice');
  assert.equal((P.dibujar({ vA: 15, vB: 0, t: 1, sinB: true }).match(/data-objeto="combi"/g) || []).length, 2, 'solo tu combi, arriba y abajo');
  // Ronda 2: cada combi lleva su letra, y sin B los postes pueden llevar su flecha hacia atrás.
  const conAB = P.dibujar({ vA: 15, vB: 5, t: 0 });
  assert.equal((conAB.match(/>A<\/text>/g) || []).length, 2, 'la letra A, arriba y abajo');
  assert.equal((conAB.match(/>B<\/text>/g) || []).length, 2, 'la letra B, arriba y abajo');
  const po = P.geometria({ vA: 15, vB: 0, t: 1, sinB: true, postes: true }).franjas[1].fb;
  assert.ok(po && po.x2 < po.x1 && po.caja.texto === 'postes: 15 m/s', 'los postes, hacia atrás');
  assert.ok(!P.geometria({ vA: 15, vB: 0, t: 1, sinB: true }).franjas[1].fb, 'sin postes: true, como antes');
});

test('rótulos que caben con 4 de margen y no se pisan; puro, alto fijo, sin NaN ni colores fijos y con texto alternativo', () => {
  for (const d of MUESTRAS) {
    const g = P.geometria(d), s = P.dibujar(d), donde = JSON.stringify(d);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), donde);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/ id="/.test(s), 'sin ids: varias figuras conviven');
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    assert.match(s, /data-prueba="si"/);
    assert.ok(P.alt(d).length > 60 && !/NaN|undefined/.test(P.alt(d)));
  }
});
