// Pruebas de la pieza «fis-mruv» (18 nov, MRUV y caída libre): cada vista dibuja lo que dicen sus números, con números
// (no a ojo): todo cabe con 4 de margen, ningún rótulo pisa a otro, las líneas quedan dentro de su gráfica, es pura, de
// prueba, sin verde ni colores fijos y con texto alternativo. La unidad corre además estas pruebas sobre todas sus figuras
// (contenido/teoria/fisica/mruv-y-caida-libre.test.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-mruv.js');
const W = 320;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const ejT = (max, paso = 1) => ({ min: 0, max, paso, nombre: 't', unidad: 's', color: 'i' });
const ejV = (min, max, paso = 2) => ({ min, max, paso, nombre: 'v', unidad: 'm/s', color: 'o' });

const CASOS = [
  ['grafica v–t con áreas de los dos lados', { vista: 'grafica', x: ejT(8), y: ejV(-2, 5, 1), curvas: [{ puntos: [[0, 4], [3, 4], null, [3, -1.5], [7, -1.5]], color: 'o' }],
    areas: [{ puntos: [[0, 4], [3, 4]], color: 'f', rotulo: '+12 m' }, { puntos: [[3, -1.5], [7, -1.5]], color: 'f', rotulo: '−6 m' }] }],
  ['grafica con escalón, tangente, punto y texto', { vista: 'grafica', x: ejT(6), y: ejV(-4, 8), curvas: [{ puntos: [[0, 6], [6, -3]], color: 'o' }],
    escalones: [{ t: 0.5, dt: 1, v: 5.25, a: -1.5, rotulo: 'a' }], tangentes: [{ t: 3, y: 1.5, m: -1.5, ancho: 1 }], puntos: [{ x: 4, y: 0, color: 'o', rotulo: 'para', guias: true }],
    textos: [{ en: [5, 6], texto: '?' }] }],
  ['tres gráficas', { vista: 'tres', x: ejT(12, 1), graficas: [
    { y: { min: 0, max: 150, paso: 50, nombre: 'x', unidad: 'm', color: 'f' }, curvas: [{ puntos: [[0, 0], [12, 120]], color: 'f', discontinua: true }] },
    { y: ejV(0, 24, 8), curvas: [{ puntos: [[0, 0], [12, 24]], color: 'o' }] },
    { y: { min: -1, max: 3, paso: 1, nombre: 'a', unidad: 'm/s²', color: 'h' }, curvas: [{ puntos: [[0, 2], [12, 2]], color: 'h' }], areas: [{ puntos: [[0, 2], [10, 2]], color: 'o', rotulo: 'Δv' }] }] }],
  ['pista con el atleta', { vista: 'pista', largo: 100, x: 40, marcas: [1, 4, 9, 16, 25, 34], grafica: { x: ejT(14), y: ejV(0, 12), alto: 120, curvas: [{ puntos: [[0, 0], [5, 10], [7, 10]], color: 'o' }] } }],
  ['atleta en la meta', { vista: 'pista', largo: 100, x: 100, marcas: [], grafica: { x: ejT(14), y: ejV(0, 12), curvas: [] } }],
  ['alcance con gráfica', { vista: 'alcance', regla: { min: 0, max: 200, paso: 25, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: 0 }, mototaxi: { x: 200 },
    grafica: { x: ejT(12), y: { min: 0, max: 200, paso: 50, nombre: 'x', unidad: 'm', color: 'f' }, curvas: [] } }],
  ['alcance sin gráfica', { vista: 'alcance', regla: { min: 0, max: 60, paso: 10, numero: 20 }, lugares: [{ en: 0, texto: 'Paradero' }, { en: 20, texto: 'Grifo' }], combi: { x: 0 }, mototaxi: { x: 20 } }],
  ['combi sin regla', { vista: 'combi', lugar: 'Grifo', v: { texto: '14 m/s' }, a: { texto: '1,5 m/s²' } }],
  ['combi hacia la izquierda', { vista: 'combi', v: { texto: '10 m/s', sentido: -1 }, a: { texto: '2 m/s²', sentido: 1 } }],
  ['regla en reposo', { vista: 'regla', cae: 0 }],
  ['regla atrapada', { vista: 'regla', cae: 20, soltada: true, cerrada: true, atrapa: '20 cm', marcas: [0, 1.25, 5, 11.25, 20].map((cm, k) => ({ cm, texto: `${String(Math.round(k * 5) / 100).replace(".", ",")} s` })) }],
  ['regla que se escapa', { vista: 'regla', cae: 45, soltada: true, cerrada: true, escapo: true }],
  ['pabellón con la pelota', { vista: 'pabellon', alto: 20, edificio: { techo: 5, pisos: 2 }, pelotas: [{ y: 0, v: 20, marcas: [] }] }],
  ['pabellón con g en la cima', { vista: 'pabellon', alto: 20, edificio: { techo: 5, pisos: 2 }, g: { texto: 'g' }, pelotas: [{ y: 20, v: 0, marcas: [0, 8.75, 15, 18.75] }] }],
  ['dos pelotas con pasos', { vista: 'pabellon', alto: 6, paso: 0.5, numero: 1, edificio: { techo: 6, pisos: 2, ventana: 5 },
    pelotas: [{ chica: true, rotulo: 'canica', pasos: [5, 4.8, 4.2, 3.2, 1.8, 0], pasosV: [0, -2, -4, -6, -8, 0] }, { grande: true, rotulo: 'piedra', pasos: [5, 4.8, 4.2, 3.2, 1.8, 0], texto: '' }] }, { corte: 3 }],
];

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-mruv'], P));

for (const [nombre, d, e] of CASOS) test(`${nombre}: cabe, no se pisa, es pura y de prueba`, () => {
  const s = P.dibujar(d, e || {}), g = P.geometria(d, e || {});
  assert.equal(s, P.dibujar(d, e || {}));
  assert.ok(!/NaN|undefined|Infinity/.test(s));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'solo currentColor y var(--c-*)');
  assert.ok(!/var\(--c-d\)/.test(s), 'sin verde');
  assert.match(s, /data-prueba="si"/);
  assert.match(s, new RegExp(`viewBox="0 0 ${W} ${g.H}"`));
  assert.ok(P.alt(d).length > 20 && !/undefined|NaN/.test(P.alt(d)));
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= g.H - 4, `«${r.texto}» se sale`);
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `«${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  for (const p of g.planos || []) for (const [x, y] of p.lineas) assert.ok(x >= p.R.x0 - 1 && x <= p.R.x1 + 1 && y >= p.R.y0 - 1 && y <= p.R.y1 + 1, 'línea fuera de su gráfica');
  for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= W - 4 && o.y0 >= 2 && o.y1 <= g.H - 2, `${o.nombre} se sale`);
});

test('la gráfica pone cada punto donde dicen sus números', () => {
  const d = CASOS[0][1], p = P.geometria(d).planos[0];
  assert.equal(p.X(0), 48); assert.equal(p.X(8), 300);
  assert.ok(Math.abs(p.Y(0) - (184 - 150 * 2 / 7)) < 1e-9, 'el eje t pasa por v = 0');
  // el área bajo el eje se ve distinta: más tenue y discontinua
  const s = P.dibujar(d);
  assert.equal((s.match(/fill-opacity="0.13"[^>]*stroke-dasharray="4 3"/g) || []).length, 1);
  assert.equal((s.match(/fill-opacity="0.26"/g) || []).length, 1);
});

test('el corte de «Mira»: lo que tiene desde aparece en su paso', () => {
  const d = { vista: 'grafica', x: ejT(4), y: ejV(-20, 20, 10), curvas: [{ puntos: [[0, 20], [4, -20]], color: 'o', desde: 1 }], areas: [{ puntos: [[0, 20], [2, 0]], color: 'f', rotulo: '+20 m', desde: 2 }] };
  assert.ok(!/stroke="var\(--c-o\)" stroke-width="3"/.test(P.dibujar(d, { corte: 0 })));
  assert.match(P.dibujar(d, { corte: 1 }), /stroke="var\(--c-o\)" stroke-width="3"/);
  assert.ok(!/\+20 m/.test(P.dibujar(d, { corte: 1 })));
  assert.match(P.dibujar(d, { corte: 2 }), /\+20 m/);
});

test('la regla: cae 4 px por cm, los dedos se cierran y el atleta va donde dice x', () => {
  const r0 = P.dibujar({ vista: 'regla', cae: 0 }), r20 = P.dibujar({ vista: 'regla', cae: 20, cerrada: true });
  const alto = s => +s.match(/data-objeto="regla" data-prueba="si"><rect x="[\d.]+" y="([\d.]+)"/)[1];
  assert.equal(alto(r20) - alto(r0), 20 * P.constantes.RK);
  assert.match(r0, /data-objeto="dedos"/);
  const pista = x => P.geometria({ vista: 'pista', largo: 100, x, grafica: { x: ejT(14), y: ejV(0, 12), curvas: [] } }).objetos[0];
  assert.ok(Math.abs((pista(100).x0 + 13) - (26 + 268)) < 1e-9 && Math.abs((pista(0).x0 + 13) - 26) < 1e-9);
});

test('el pabellón: la pelota en su altura, la flecha de v según su sentido y la de g solo si se pide', () => {
  const g = y => P.geometria({ vista: 'pabellon', alto: 20, pelotas: [{ y, v: 10 }] }).objetos.find(o => o.nombre === 'pelota');
  const { SUELO, TECHO } = P.constantes;
  assert.ok(Math.abs(g(0).y1 - SUELO) < 1e-9);
  assert.ok(Math.abs(g(20).y1 - TECHO) < 1e-9);
  assert.ok(!/fis-aceleracion/.test(P.dibujar({ vista: 'pabellon', pelotas: [{ y: 5, v: 0 }] })));
  assert.match(P.dibujar({ vista: 'pabellon', g: { texto: 'g' }, pelotas: [{ y: 5, v: 0 }] }), /fis-aceleracion/);
  assert.match(P.dibujar({ vista: 'pabellon', pelotas: [{ y: 5, v: -12 }] }), />12 m\/s</);
});

// Correcciones del 18 nov (lector en frío y auditoría de MRUV y caída libre).
test('alcance: cada vehículo con su nombre en su carril, también juntos y en el borde', () => {
  for (const [xc, xm] of [[0, 0], [200, 200], [100, 0], [0, 200]]) {
    const d = { vista: 'alcance', regla: { min: 0, max: 200, paso: 25, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: xc }, mototaxi: { x: xm } };
    const g = P.geometria(d), nom = t => g.rotulos.find(r => r.texto === t);
    assert.ok(nom('combi') && nom('mototaxi'), `${xc}, ${xm}`);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9, `«${r.texto}» se sale`);
    for (const o of g.objetos) for (const t of ['combi', 'mototaxi']) assert.ok(!pisa(o, nom(t)), `«${t}» pisa ${o.nombre}`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `«${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  }
  assert.ok(!P.geometria({ vista: 'alcance', combi: { x: 0 }, nombres: false }).rotulos.some(r => r.texto === 'combi'));
});

test('pabellón: la ventana dibujada se apoya en su rayita y la cota de h baja con su flecha', () => {
  const d = { vista: 'pabellon', alto: 6, paso: 0.5, numero: 1, edificio: { techo: 5, pisos: 2, ventana: 3.2 }, pelotas: [{ y: 0 }],
    cota: { de: 3.2, a: 0, texto: 'h', x: 190, flecha: true } };
  const s = P.dibujar(d), g = P.geometria(d), { SUELO, TECHO } = P.constantes, Y = m => SUELO - (SUELO - TECHO) * m / 6;
  const bases = [...s.matchAll(/<rect x="\d+" y="([\d.]+)" width="20" height="([\d.]+)"/g)].map(m => +m[1] + +m[2]);
  assert.ok(bases.some(b => Math.abs(b - Y(3.2)) < 0.01), `alféizares en ${bases}`);
  assert.ok(bases.some(b => Math.abs(b - Y(0.7)) < 0.01), 'el primer piso, a la misma altura sobre su piso');
  assert.match(s, /stroke="var\(--c-f\)"/);
  const h = g.rotulos.find(r => r.texto === 'h');
  assert.ok(h && h.x1 <= 190 && h.y1 > Y(3.2) && h.y0 < Y(0), 'la h a la izquierda de la flecha, a media altura');
  for (const o of g.objetos) assert.ok(!pisa(o, h), `la h pisa ${o.nombre}`);
});
