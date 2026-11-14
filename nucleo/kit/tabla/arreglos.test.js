// Pruebas de los arreglos de la tabla viva (nucleo/kit/tabla/arreglos.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('./arreglos.js');
const { ELEMENTOS } = require('./datos.js');
const Motor = require('../../../plantillas/atomo-y-tabla/motor.js');

const sim = z => ELEMENTOS[z - 1].simbolo;
const zDe = s => ELEMENTOS.find(e => e.simbolo === s).Z;

test('ubicación: periodo y grupo de la tabla de la IUPAC en casos conocidos', () => {
  const casos = { H: [1, 1], He: [1, 18], Li: [2, 1], B: [2, 13], Ne: [2, 18], Na: [3, 1], Ar: [3, 18], K: [4, 1],
    Sc: [4, 3], Fe: [4, 8], Zn: [4, 12], Ga: [4, 13], Kr: [4, 18], Y: [5, 3], Ag: [5, 11], Xe: [5, 18], Cs: [6, 1],
    Ba: [6, 2], Hf: [6, 4], Au: [6, 11], Rn: [6, 18], Fr: [7, 1], Ra: [7, 2], Rf: [7, 4], Cn: [7, 12], Og: [7, 18] };
  for (const [s, [p, g]] of Object.entries(casos)) {
    const u = A.ubicacion(zDe(s));
    assert.equal(u.periodo, p, `periodo de ${s}`);
    assert.equal(u.grupo, g, `grupo de ${s}`);
  }
});

test('ubicación: las dos series son de 15 y no tienen grupo ni bloque aquí', () => {
  for (let z = 57; z <= 71; z++) assert.deepEqual([A.ubicacion(z).serie, A.ubicacion(z).grupo], ['lantánidos', null]);
  for (let z = 89; z <= 103; z++) assert.deepEqual([A.ubicacion(z).serie, A.ubicacion(z).grupo], ['actínidos', null]);
  assert.equal(A.ubicacion(57).indiceSerie, 0);
  assert.equal(A.ubicacion(103).indiceSerie, 14);
  assert.equal(A.ubicacion(56).serie, null);
  assert.equal(A.ubicacion(72).serie, null);
  for (const z of [57, 71, 89, 103]) assert.equal(A.ubicacion(z).bloque, null);
});

test('ubicación: coincide con el motor de atomo-y-tabla fuera de las series (Z = 1 a 86)', () => {
  for (let z = 1; z <= 86; z++) {
    if (z >= 57 && z <= 71) continue;
    const m = Motor.ubicacion(z), u = A.ubicacion(z);
    assert.equal(u.periodo, m.periodo, `periodo de ${sim(z)}`);
    assert.equal(u.grupo, m.grupo, `grupo de ${sim(z)}`);
    assert.equal(u.bloque, m.bloque, `bloque de ${sim(z)}`);
  }
});

test('ubicación: rechaza Z fuera de 1 a 118', () => {
  for (const z of [0, 119, 1.5, NaN]) assert.throws(() => A.ubicacion(z));
});

// Ninguna carta visible se encima con otra, y todas quedan dentro del arreglo.
function sinChoques(r, nombre) {
  const vistas = [];
  for (let z = 1; z <= 118; z++) {
    const p = r.pos[z];
    assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `${nombre}: falta ${sim(z)}`);
    if (!p.visible) continue;
    assert.ok(p.x >= 0 && p.y >= 0 && p.x + 1 <= r.ancho + 1e-9 && p.y + 1 <= r.alto + 1e-9, `${nombre}: ${sim(z)} se sale`);
    vistas.push([z, p]);
  }
  for (let i = 0; i < vistas.length; i++) for (let j = i + 1; j < vistas.length; j++) {
    const [za, a] = vistas[i], [zb, b] = vistas[j];
    assert.ok(Math.abs(a.x - b.x) >= 1 - 1e-9 || Math.abs(a.y - b.y) >= 1 - 1e-9, `${nombre}: ${sim(za)} y ${sim(zb)} se enciman`);
  }
  for (const h of r.huecos) for (const [z, p] of vistas)
    assert.ok(Math.abs(h.x - p.x) >= 1 || Math.abs(h.y - p.y) >= 1, `${nombre}: el hueco ${h.texto} pisa a ${sim(z)}`);
  return vistas.length;
}

test('tabla abierta: las 118 a la vista, sin choques, 18 columnas y las series aparte', () => {
  const r = A.tabla({ abierta: true });
  assert.equal(sinChoques(r, 'abierta'), 118);
  assert.equal(r.ancho, 18);
  assert.equal(r.columnas.length, 18);
  assert.equal(r.pliegue, null);
  assert.deepEqual(r.huecos.map(h => h.texto), ['57–71', '89–103']);
  assert.equal(r.pos[zDe('Fe')].x, 7);
  assert.equal(r.pos[zDe('La')].x, 2);
  assert.ok(r.pos[zDe('La')].y > 7 && r.pos[zDe('Ac')].y === r.pos[zDe('La')].y + 1);
});

test('tabla plegada: solo los grupos 1, 2 y 13 a 18; lo demás, en el pliegue', () => {
  const r = A.tabla();
  const visibles = sinChoques(r, 'plegada');
  assert.equal(visibles, 2 + 6 * 8);   // periodo 1: 2; periodos 2 a 7: 8 cada uno
  assert.equal(r.columnas.length, 8);
  assert.ok(r.pliegue && r.pliegue.ancho === A.ANCHO_PLIEGUE);
  assert.ok(Math.abs(r.ancho - (8 + A.ANCHO_PLIEGUE)) < 1e-9);
  assert.equal(r.alto, 7);
  for (const s of ['Fe', 'Sc', 'Zn', 'La', 'U', 'Lr']) assert.equal(r.pos[zDe(s)].visible, false, s);
  for (const s of ['H', 'Mg', 'Al', 'Og', 'Ra', 'Rn']) assert.equal(r.pos[zDe(s)].visible, true, s);
  // Las guardadas quedan centradas en la franja, en la fila de su periodo.
  assert.equal(r.pos[zDe('Fe')].y, 3);
  const centro = r.pliegue.x + r.pliegue.ancho / 2;
  assert.ok(Math.abs(r.pos[zDe('Fe')].x + 0.5 - centro) < 1e-9);
  // Grupo 2 y grupo 13 quedan separados justo por la franja.
  assert.ok(Math.abs(r.pos[zDe('B')].x - r.pos[zDe('Be')].x - (1 + A.ANCHO_PLIEGUE)) < 1e-9);
});

test('fila por Z: renglones del ancho pedido, en orden', () => {
  for (const c of [8, 10, 18]) {
    const r = A.filaZ({ columnas: c });
    assert.equal(sinChoques(r, `filaZ ${c}`), 118);
    assert.equal(r.alto, Math.ceil(118 / c));
    assert.deepEqual(r.pos[1], { x: 0, y: 0, visible: true });
    assert.deepEqual(r.pos[c + 1], { x: 0, y: 1, visible: true });
  }
  assert.throws(() => A.filaZ({ columnas: 1 }));
});

test('fila por masa: los 84 con peso en orden, y los 34 sin peso en una pila aparte con su rótulo', () => {
  const r = A.filaMasa({ columnas: 8 });
  assert.equal(sinChoques(r, 'filaMasa'), 118);
  const orden = A.ordenPorMasa();
  assert.equal(orden.length, 84);
  for (let i = 1; i < orden.length; i++) assert.ok(ELEMENTOS[orden[i] - 1].peso >= ELEMENTOS[orden[i - 1] - 1].peso);
  const finMasa = Math.ceil(84 / 8);
  assert.equal(r.rotulos.length, 1);
  assert.match(r.rotulos[0].texto, /Sin peso atómico estándar \(34\)/);
  for (const e of ELEMENTOS) {
    const y = r.pos[e.Z].y;
    if (e.peso === undefined) assert.ok(y >= finMasa + 1, `${e.simbolo} debería ir en la pila`);
    else assert.ok(y < finMasa, `${e.simbolo} debería ir en la fila`);
  }
  // El rótulo no pisa ninguna carta.
  const yr = r.rotulos[0].y;
  for (let z = 1; z <= 118; z++) assert.ok(r.pos[z].y + 1 <= yr || r.pos[z].y >= yr + 0.7);
});

test('fila por masa: las inversiones son Ar–K, Co–Ni, Te–I y Th–Pa', () => {
  const pares = A.inversiones().map(([a, b]) => [sim(a), sim(b)]);
  assert.deepEqual(pares, [['K', 'Ar'], ['Ni', 'Co'], ['I', 'Te'], ['Pa', 'Th']]);
});

test('arreglo(id) despacha y rechaza lo desconocido; la salida no depende del estado anterior', () => {
  assert.deepEqual(A.arreglo('tabla', { abierta: true }), A.tabla({ abierta: true }));
  assert.deepEqual(A.arreglo('filaMasa', { columnas: 8 }), A.arreglo('filaMasa', { columnas: 8 }));
  assert.throws(() => A.arreglo('triadas'));
});
