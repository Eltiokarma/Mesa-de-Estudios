// Pruebas de la pieza «quim-tira» (las tarjetas de los elementos, idea 1 de Tabla periódica): sana, pura, marcada de
// prueba, fiel (las tarjetas en orden de Z, el corte en filas, la tabla con cada elemento en su periodo y su grupo) y, con
// números (docs/molde-unidad.md §6), todo dentro del lienzo con 4 de margen y ningún rótulo que pise a otro ni a una
// marca, en las muestras y en todas las figuras de la idea 1.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./quim-tira.js');

const SIM = { 1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca',
  21: 'Sc', 30: 'Zn', 31: 'Ga', 35: 'Br', 36: 'Kr', 37: 'Rb', 38: 'Sr', 39: 'Y', 48: 'Cd', 53: 'I', 54: 'Xe', 55: 'Cs', 56: 'Ba', 57: 'La', 80: 'Hg', 85: 'At', 86: 'Rn', 87: 'Fr', 88: 'Ra', 89: 'Ac', 112: 'Cn', 118: 'Og' };
const MAR = { 2: 'inerte', 10: 'inerte', 18: 'inerte', 36: 'inerte', 3: 'blando', 11: 'blando', 19: 'blando', 37: 'blando', 9: 'sal', 17: 'sal', 35: 'sal' };
const base = o => Object.assign({ simbolos: SIM, marcas: MAR }, o);

// Todas las figuras de la idea 1 de «Tabla periódica» que usan la pieza.
function figurasUnidad() {
  const def = require('../../../contenido/teoria/quimica/tabla-periodica.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [];
  for (const i of def.ideas) {
    const con = (donde, f, pz) => { const p = f && (f.pieza || pz); if (f && f.datos && p === 'quim-tira') out.push({ donde: `${i.id} ${donde}`, datos: f.datos, estado: f.estado || {} }); };
    for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza || i.pieza);
    i.lee.tarjetas.forEach((t, k) => con(`lee ${k + 1}`, t.dibujo, t.pieza));
    con('predice', i.predice.dibujo, i.predice.pieza || i.pieza); con('revelar', i.predice.revelar, i.predice.pieza || i.pieza);
    for (let c = 0; c <= 7; c++) con(`mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza || i.pieza);
    con('regla', i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza || i.pieza);
    i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 40; s++) {
      const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
      con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza || i.pieza); r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza || i.pieza));
      con(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza || i.pieza); con(`solución ${s}`, a.solucion.dibujo, i.ahoraTu.pieza || i.pieza);
    }
  }
  return out;
}
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
// Encuadre (todo dentro con 4 de margen) y rótulos que no se pisan entre sí ni pisan una marca o un objeto.
function revisar(g, nombre, mal) {
  const { W, H, M } = g;
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) de ${W} × ${H}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 0.5)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (!o.marco && solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
  // Cada texto de una tarjeta cabe en su tarjeta (con 1 de aire a cada lado).
  const cartas = g.objetos.filter(o => o.Z);
  for (const x of t.filter(y => y.que === 'Z' || y.que === 'simbolo')) {
    const c = cartas.find(o => x.x0 >= o.x0 - 0.01 && x.x1 <= o.x1 + 0.01 && x.y0 >= o.y0 && x.y1 <= o.y1);
    if (!c) mal.push(`${nombre}: «${x.txt}» no cabe en su tarjeta`);
  }
}
function sana(s, nombre) {
  assert.ok(!/NaN|undefined|Infinity|null/.test(s), nombre);
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${nombre}: sin colores fijos`);
  assert.ok(!/var\(--c-d\)|var\(--c-f\)|var\(--el-/.test(s), `${nombre}: sin verde, violeta ni paleta de elementos`);
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), nombre);
  for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${nombre}: texto de ${t}`);
}
const MUESTRAS = [
  base({ vista: 'objetos', objetos: [{ que: 'globo', Z: 2, nombre: 'helio' }, { que: 'letrero', Z: 10, nombre: 'neón' }, { que: 'foco', Z: 18, nombre: 'argón' }] }),
  base({ vista: 'tira', desde: 3, hasta: 20, porFila: 8, cabeza: true }),
  base({ vista: 'tira', desde: 3, hasta: 20, porFila: 10, cabeza: true, resaltar: [{ Z: 3 }, { Z: 13 }], rotulo: 'Filas de 10' }),
  base({ vista: 'tira', desde: 3, hasta: 20, porFila: 5, cabeza: true, ocultos: [19] }),
  base({ vista: 'tabla', periodos: 7, fila: { periodo: 4 }, columna: { grupo: 17 }, resaltar: [{ Z: 53, color: 'o' }], rotulo: 'grupo 17 (VIIA)', rotuloColor: 'h' }),
  base({ vista: 'tabla', periodos: 5, hasta: 38, ocultos: [37], columna: { grupo: '3–12' } }),
  // Fase 3: los grupos 3 a 12 abiertos, la escalera y los objetos de las ideas 2 a 4 (y de Propiedades periódicas).
  base({ vista: 'transicion', resaltar: [{ Z: 28, color: 'h' }], rotulo: 'Ni: [Ar] 4s² 3d⁸' }),
  base({ vista: 'tabla', periodos: 6, escalera: true, incognitas: [14], probador: { prende: 2 }, rotulo: 'Sn: el foquito prende' }),
  base({ vista: 'objetos', objetos: [{ que: 'sal', Z: 53, nombre: 'yodo' }], rotulo: '[Kr] 5s² 4d¹⁰ 5p⁵' }),
  base({ vista: 'objetos', objetos: [{ que: 'clavo', Z: 26, nombre: 'hierro' }, { que: 'cable', Z: 29, nombre: 'cobre' }, { que: 'anillo', Z: 47, nombre: 'plata' }] }),
  base({ vista: 'objetos', objetos: [{ que: 'probador', prende: 0, nombre: 'apagado' }, { que: 'probador', prende: 2, nombre: 'prendido' }] }),
  base({ vista: 'objetos', objetos: [{ que: 'cristal', nombre: 'sal' }, { que: 'salero' }, { que: 'romana', nombre: 'romana' }] }),
  base({ vista: 'objetos', objetos: [{ que: 'soga', nombre: 'dos que jalan' }] }),
  base({ vista: 'barras', color: 'h', max: 2200, barras: [['Li', 520], ['Be', 900], ['B', 801], ['C', 1086], ['N', 1402], ['O', 1314], ['F', 1681], ['Ne', 2081]].map(([s, v], k) => ({ s, v, marca: k === 4, oculto: k === 5 })), rotulo: 'EI en kJ/mol' }),
  base({ vista: 'esferas', max: 250, esferas: [{ s: 'K', r: 243, p: 19 }, { s: 'Na', r: 190, p: 11 }, { s: 'Li', r: 167, p: 3 }, { s: 'H', r: 53, p: 1 }], rotulo: 'Grupo 1 (IA)' }),
];

test('registrada en el kit', () => assert.equal(Kit.piezas['quim-tira'], P));
test('sana, pura, con su texto alternativo, y los objetos marcados de prueba', () => {
  for (const [k, d] of MUESTRAS.entries()) {
    const s = P.dibujar(d);
    sana(s, `muestra ${k}`); assert.equal(s, P.dibujar(d));
    assert.ok(P.alt(d).length > 40);
  }
  const s = P.dibujar(MUESTRAS[0]);
  for (const o of ['globo', 'letrero', 'foco']) assert.ok(s.includes(`data-objeto="${o}" data-prueba="si"`));
  assert.match(P.alt(MUESTRAS[0]), /un globo, helio \(Z = 2\); un letrero luminoso, neón \(Z = 10\); un foco, argón \(Z = 18\)/);
  assert.match(P.alt(MUESTRAS[1]), /Quedan en una misma columna/);
  assert.match(P.alt(MUESTRAS[3]), /Z = 19, «\?»/);
});
test('fiel, la tira: las tarjetas van en orden de Z, de izquierda a derecha y de arriba abajo, con el corte pedido', () => {
  for (const k of [5, 6, 7, 8, 9, 10]) {
    const g = P.geometria(base({ vista: 'tira', desde: 3, hasta: 20, porFila: k, cabeza: true })), c = Object.fromEntries(g.objetos.filter(o => o.Z).map(o => [o.Z, o]));
    assert.equal(Object.keys(c).length, 20);
    for (let Z = 3; Z <= 20; Z++) { assert.equal(c[Z].col, (Z - 3) % k, `Z = ${Z}, k = ${k}`); assert.equal(c[Z].fila, 1 + Math.floor((Z - 3) / k)); }
    for (let Z = 4; Z <= 20; Z++) assert.ok(c[Z].fila > c[Z - 1].fila ? c[Z].x0 < c[Z - 1].x0 && c[Z].y0 > c[Z - 1].y0 : c[Z].x0 > c[Z - 1].x0 && c[Z].y0 === c[Z - 1].y0);
    // El hidrógeno y el helio, en las puntas de la primera fila.
    assert.equal(c[1].col, 0); assert.equal(c[2].col, k - 1); assert.equal(c[1].fila, 0);
    // Solo con filas de 8 quedan en columna las tres familias; el marco de cada columna es carmín (el color del grupo).
    assert.deepEqual(g.columnas.slice().sort(), k === 8 ? ['blando', 'inerte', 'sal'] : []);
    const s = P.dibujar(base({ vista: 'tira', desde: 3, hasta: 20, porFila: k, cabeza: true }));
    assert.equal((s.match(/class="kit-columna"[^>]*var\(--c-h\)/g) || []).length, k === 8 ? 3 : 0);
    // Una marca por tarjeta marcada, y el número de cada tarjeta en naranja (Z).
    assert.equal((s.match(/class="kit-marca"/g) || []).length, 8);
    assert.equal((s.match(/<text[^>]*fill="var\(--c-o\)"/g) || []).length, 20);
  }
  // Una tarjeta oculta dice «?» y no lleva su marca.
  const s = P.dibujar(MUESTRAS[3]);
  assert.ok(s.includes('>?<') && !s.includes('>K<'));
  assert.equal((s.match(/class="kit-marca"/g) || []).length, 7);
});
test('fiel, la tabla: cada elemento en su periodo y su grupo (contra una tabla escrita aparte)', () => {
  // [Z, periodo, grupo]
  const LUGARES = [[1, 1, '1'], [2, 1, '18'], [3, 2, '1'], [4, 2, '2'], [5, 2, '13'], [9, 2, '17'], [10, 2, '18'], [11, 3, '1'], [13, 3, '13'], [17, 3, '17'], [18, 3, '18'], [19, 4, '1'], [20, 4, '2'],
    [31, 4, '13'], [35, 4, '17'], [36, 4, '18'], [37, 5, '1'], [38, 5, '2'], [53, 5, '17'], [54, 5, '18'], [55, 6, '1'], [56, 6, '2'], [85, 6, '17'], [86, 6, '18'], [87, 7, '1'], [88, 7, '2'], [118, 7, '18']];
  const g = P.geometria(MUESTRAS[4]), c = Object.fromEntries(g.objetos.filter(o => o.Z).map(o => [o.Z, o]));
  for (const [Z, per, grupo] of LUGARES) { assert.equal(c[Z].per, per, `periodo de Z = ${Z}`); assert.equal(P.constantes.GRUPOS[c[Z].col], grupo, `grupo de Z = ${Z}`); }
  // 2 + 8 + 8 + 8 + 8 + 8 + 8 tarjetas: los grupos 3 a 12 van resumidos (cuatro casillas, del periodo 4 al 7).
  assert.equal(Object.keys(c).length, 50);
  assert.equal(g.objetos.filter(o => o.que === 'resumen').length, 4);
  for (const Z of [21, 30, 39, 48, 57, 80, 89, 112]) assert.equal(P.lugarTabla(Z), null, `Z = ${Z} es de los grupos 3 a 12`);
  const s = P.dibujar(MUESTRAS[4]);
  for (const t of ['Sc a', 'Zn', 'Y a', 'Cd', 'La a', 'Hg', 'Ac a', 'Cn']) assert.ok(s.includes(`>${t}<`), t);
  // La fila marcada va en turquesa (periodo) y la columna, en carmín (grupo).
  assert.match(s, /class="kit-fila"[^>]*var\(--c-i\)/); assert.match(s, /class="kit-columna"[^>]*var\(--c-h\)/);
  // Con «hasta», la tabla se corta ahí: del periodo 5 solo se ven el 37 (oculto) y el 38.
  const h = P.geometria(MUESTRAS[5]).objetos.filter(o => o.Z).map(o => o.Z);
  assert.equal(Math.max(...h), 38);
  assert.equal(h.filter(Z => Z > 36).length, 2);
});
test('escenas: se dibuja la última con desde ≤ corte, y el alto no cambia entre escenas', () => {
  const d = base({ escenas: [{ desde: 0, vista: 'tira', desde2: 0, hasta: 20, porFila: 8, cabeza: true, resaltar: [{ Z: 2, desde: 1 }] }, { desde: 3, vista: 'tabla', periodos: 5 }] });
  d.escenas[0] = Object.assign({}, d.escenas[0], { desde: 0 });
  const alto = s => +s.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
  assert.equal(P.geometria(d, { corte: 2 }).vista, 'tira');
  assert.equal(P.geometria(d, { corte: 3 }).vista, 'tabla');
  assert.equal(alto(P.dibujar(d, { corte: 0 })), alto(P.dibujar(d, { corte: 4 })));
  assert.ok(!P.dibujar(d, { corte: 0 }).includes('kit-resalta') && P.dibujar(d, { corte: 1 }).includes('kit-resalta'));
});
test('fiel, fase 3: los grupos 3 a 12 abiertos con su romano, la escalera y los objetos', () => {
  const g = P.geometria(MUESTRAS[6]), c = Object.fromEntries(g.objetos.filter(o => o.Z).map(o => [o.Z, o]));
  // Del escandio (21) al cinc (30) en el periodo 4 y del itrio (39) al cadmio (48) en el 5: la columna es el grupo menos 3.
  for (let k = 0; k < 10; k++) { assert.equal(c[21 + k].col, k); assert.equal(c[21 + k].per, 4); assert.equal(c[39 + k].col, k); assert.equal(c[39 + k].per, 5); }
  const s = P.dibujar(MUESTRAS[6]);
  for (const t of ['3', '12', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIIIB', 'IB', 'IIB']) assert.ok(s.includes(`>${t}<`), t);
  assert.equal((s.match(/>VIIIB</g) || []).length, 1, 'VIIIB va una sola vez, sobre sus tres columnas');
  // La escalera: una sola línea gruesa; a su izquierda quedan Al, Ga, Sn y Pb; a su derecha, B, Si, Ge, Sb y Po.
  const e = P.dibujar(MUESTRAS[7]), d = e.match(/class="kit-escalera" d="M([^"]+)"/)[1].split('L').map(p => p.split(' ').map(Number));
  const ge = P.geometria(MUESTRAS[7]), ca = Object.fromEntries(ge.objetos.filter(o => o.Z).map(o => [o.Z, o]));
  const xEscalera = per => { const y = ca[[0, 1, 3, 11, 19, 37, 55][per]].y0 + 10; for (let k = 0; k + 1 < d.length; k++) if (d[k][0] === d[k + 1][0] && Math.min(d[k][1], d[k + 1][1]) <= y && y <= Math.max(d[k][1], d[k + 1][1])) return d[k][0]; return null; };
  for (const [izq, der, per] of [[4, 5, 2], [13, 14, 3], [31, 32, 4], [50, 51, 5], [83, 84, 6]]) {
    const x = xEscalera(per);
    assert.ok(x !== null && ca[izq].x1 <= x + 0.01 && ca[der].x0 >= x - 0.01, `periodo ${per}: la escalera pasa entre Z = ${izq} y Z = ${der}`);
  }
  assert.ok(ge.escalera && !P.geometria(MUESTRAS[4]).escalera);
  // El probador chico de la tabla va en el hueco de la fila 1: no toca ninguna tarjeta ni los números de los grupos.
  const pr = ge.objetos.find(o => o.que === 'objeto probador');
  assert.ok(pr && ge.objetos.filter(o => o.Z).every(c => pr.x1 <= c.x0 || pr.x0 >= c.x1 || pr.y1 <= c.y0 || pr.y0 >= c.y1), 'el probador pisa una tarjeta');
  assert.ok(ge.textos.filter(t => t.que === 'grupo').every(t => t.y1 <= pr.y0), 'el probador pisa los números de los grupos');
  assert.ok(P.dibujar(MUESTRAS[7]).includes('data-objeto="probador"') && /foquito prende fuerte/.test(P.alt(MUESTRAS[7])));
  // Cada objeto, con su marca de prueba; el probador prende según el dato.
  for (const [k, os] of [[8, ['sal']], [9, ['clavo', 'cable', 'anillo']], [10, ['probador']], [11, ['cristal', 'salero', 'romana']], [12, ['soga']]]) for (const o of os) assert.ok(P.dibujar(MUESTRAS[k]).includes(`data-objeto="${o}" data-prueba="si"`), o);
  const rayos = p => (P.dibujar(base({ vista: 'objetos', objetos: [{ que: 'probador', prende: p }] })).match(/class="kit-rayo"/g) || []).length;
  assert.deepEqual([rayos(0), rayos(1), rayos(2)], [0, 3, 5]);
  // Un objeto sin Z va sin tarjeta; una tarjeta con incógnita no escribe su número.
  assert.equal(P.geometria(MUESTRAS[10]).objetos.filter(o => o.Z).length, 0);
  assert.ok(!/fill="var\(--c-o\)"[^>]*>14</.test(e) && e.includes('>?<'));
});
test('encuadre y rótulos, con números, en las muestras y en toda la unidad', () => {
  const mal = [];
  MUESTRAS.forEach((d, k) => revisar(P.geometria(d), `muestra ${k}`, mal));
  const figs = figurasUnidad();
  assert.ok(figs.length > 300, `${figs.length} figuras`);
  for (const f of figs) { sana(P.dibujar(f.datos, f.estado), f.donde); revisar(P.geometria(f.datos, f.estado), f.donde, mal); }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});
