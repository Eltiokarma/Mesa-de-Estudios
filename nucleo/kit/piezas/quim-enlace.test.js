// Pruebas de la pieza «quim-enlace» (objetos de la primera pantalla y símbolos de Lewis en fila): pura, sin NaN ni
// verde, marcada como dibujo de prueba, con texto alternativo. Con números (docs/molde-unidad.md §6): todo cabe con 4 de
// margen, ningún rótulo pisa a otro ni al objeto, y ningún punto (electrón) cae sobre un símbolo.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./quim-enlace.js');

const OBJS = P.OBJETOS.flatMap(objeto => (objeto === 'probador'
  ? ['cobre', 'sal', 'agua-sal', 'agua-azucar', 'agua'].map(c => ({ vista: 'objeto', objeto, contenido: c, prende: c === 'cobre' || c === 'agua-sal' ? 2 : 0, nombre: 'Agua con azúcar' }))
  : [{ vista: 'objeto', objeto, n: 4, nombre: 'Un nombre de dos o tres palabras' }, { vista: 'objeto', objeto, n: 2, titulo: 'Un título', nombre: 'Otro nombre' }]));
const SIMB = [
  { vista: 'simbolos', filas: [[{ s: 'Na', puntos: 1 }, '+', { s: 'Cl', puntos: 7 }, '→', { s: 'Na', corchetes: true, carga: '⁺' }, { s: 'Cl', corchetes: true, carga: '⁻', puntos: 8 }]], transfiere: [[0, 0, 2]] },
  { vista: 'simbolos', filas: [['2', { s: 'Al', puntos: 3 }, '+', '3', { s: 'O', puntos: 6 }], ['→', '2', { s: 'Al', corchetes: true, carga: '³⁺' }, '3', { s: 'O', corchetes: true, carga: '²⁻', puntos: 8 }]] },
  { vista: 'simbolos', filas: [[{ s: 'Cl', corchetes: true, carga: '⁻', oculto: true }]] },
  { vista: 'simbolos', titulo: 'Con título', filas: [{ fichas: [{ s: 'Mg', puntos: 2 }, '+', '2', { s: 'Cl', puntos: 7 }, '→', 'MgCl₂'], desde: 2 }] },
];
const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;

test('pura, sin NaN ni verde, con texto alternativo y marcada como dibujo de prueba', () => {
  for (const d of [...OBJS, ...SIMB]) for (const estado of [{}, { corte: 2 }]) {
    const svg = P.dibujar(d, estado);
    assert.equal(svg, P.dibujar(d, estado));
    assert.ok(!/NaN|undefined|Infinity/.test(svg), JSON.stringify(d));
    assert.ok(!/--c-d\b/.test(svg), 'sin verde');
    assert.ok(P.alt(d).length > 15);
    if (d.vista === 'objeto') assert.ok(svg.includes(`data-objeto="${d.objeto}" data-prueba="si"`));
  }
  // El foquito encendido se distingue del apagado: halo y rayos solo si prende.
  const on = P.dibujar(OBJS.find(d => d.contenido === 'cobre')), off = P.dibujar(OBJS.find(d => d.contenido === 'agua'));
  assert.ok(/kit-halo/.test(on) && /kit-rayo/.test(on)); assert.ok(!/kit-halo|kit-rayo/.test(off));
  // Los puntos de Lewis son los electrones del dato, ni uno más.
  assert.equal((P.dibujar(SIMB[0]).match(/kit-punto/g) || []).length, 1 + 7 + 8);
  // Una fila con «desde» no se dibuja antes de su paso.
  assert.ok(!/>MgCl₂</.test(P.dibujar(SIMB[3], { corte: 1 }))); assert.ok(/>MgCl₂</.test(P.dibujar(SIMB[3], { corte: 2 })));
});

test('todo cabe con 4 de margen y nada se pisa', () => {
  for (const d of [...OBJS, ...SIMB]) {
    const g = P.geometria(d), { W, H, M } = g, nombre = JSON.stringify(d).slice(0, 80);
    for (const c of [...g.textos, ...g.objetos]) assert.ok(c.x0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y0 >= M - 1e-9 && c.y1 <= H - M + 1e-9, `${nombre}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) assert.ok(!solapan(g.textos[a], g.textos[b]), `${nombre}: «${g.textos[a].txt}» y «${g.textos[b].txt}»`);
    for (const t of g.textos) for (const o of g.objetos.filter(x => x.que !== 'corchetes')) assert.ok(!solapan(t, o), `${nombre}: «${t.txt}» pisa ${o.que}`);
    for (const [x, y] of g.puntos || []) for (const t of g.textos) assert.ok(!(x > t.x0 + 1 && x < t.x1 - 1 && y > t.y0 + 1 && y < t.y1 - 1), `${nombre}: punto sobre «${t.txt}»`);
  }
});

// Cierre de Enlace químico (19 nov): falla con la versión anterior. Cambios solo en los objetos y la vista de símbolos de
// esa unidad (globos, soplete, chorro y olla, de Geometría molecular, no se tocaron).
test('enlace químico: N₂ y O₂ distintos en la ventana, la tiza se ve, sin rayos horizontales y la flecha nace sobre el punto', () => {
  const ventana = P.dibujar({ vista: 'objeto', objeto: 'ventana' });
  assert.equal((ventana.match(/kit-o2/g) || []).length, 2); assert.equal((ventana.match(/kit-n2/g) || []).length, 6);
  assert.ok(/kit-tiza/.test(P.dibujar({ vista: 'objeto', objeto: 'tiza' })));
  const on = P.dibujar(OBJS.find(d => d.contenido === 'cobre'));
  for (const m of on.matchAll(/class="kit-rayo" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)) assert.ok(Math.abs(+m[2] - +m[4]) > 1, `rayo horizontal: ${m[0]}`);
  const svg = P.dibujar(SIMB[0]), punto = [...svg.matchAll(/kit-punto" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]])[0];
  const ini = svg.match(/kit-transfiere" d="M([\d.]+) ([\d.]+)/);
  assert.ok(+ini[2] < punto[1] - 6, `la flecha (y = ${ini[2]}) nace encima del punto del Na (y = ${punto[1]})`);
});
