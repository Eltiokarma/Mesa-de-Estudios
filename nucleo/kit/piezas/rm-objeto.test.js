// Pruebas de la pieza «rm-objeto»: las comunes de las piezas de la unidad (rm-pruebas.js: limpia, pura, de alto fijo,
// marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un trazo,
// con números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de la teoría que usan
// la pieza. Además: los papeles de color (✓ violeta, ✗ y repartos tachados en gris) los fija la pieza, las zonas tocables
// caen sobre su casilla y el cuadro en L pone cada clave en su bloque.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../trazo.js');
const P = require('./rm-objeto.js');
const R = require('./rm-pruebas.js');

const P3 = ['Ana', 'Beto', 'Ciro'], D3 = ['fútbol', 'vóley', 'ajedrez'], I3 = ['futbol', 'voley', 'ajedrez'];
const PERM = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const INS = { nombre: 'instrumento', items: ['quena', 'charango', 'bombo'] }, CIU = { nombre: 'ciudad', items: ['Puno', 'Juliaca', 'Ilave'] };
const MUESTRAS = [
  { escena: 'campeonato', cuadro: false, filas: P3, columnas: D3, iconos: I3 },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, repartos: PERM.map(a => ({ a })), pistas: [], lineas: 3 },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, marcas: { '0,0': { m: 'si', desde: 3 }, '0,1': { m: 'no', desde: 1 }, '0,2': { m: 'no', nueva: true, desde: 1 }, '1,0': 'no', '2,0': 'no' },
    manos: [{ f: 0, c: 0, desde: 3 }], repartos: PERM.map(a => (a[0] === 0 ? { a } : { a, fuera: 2 })),
    pistas: [{ t: 'Ana no juega vóley.' }, { t: 'Ana no juega ajedrez.', nueva: true }], lineas: 3, nota: [{ t: 'Quedan 2 repartos', desde: 2 }] },
  { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, toques: { '0,0': 'm00', '2,2': 'm22' }, marcas: { '1,1': 'si' }, manos: [{ f: 1, c: 1 }] },
  { filas: ['Carla', 'Delia', 'Elsa', 'Flor'], columnas: ['médica', 'obstetra', 'dentista', 'técnica'], marcas: { '0,0': 'no', '3,2': 'si' } },
  { filas: ['Lucho', 'Maru', 'Teo'], columnas: ['picarones', 'emoliente', 'choclo'] },
  { filas: ['Raúl', 'Saúl', 'Tito', 'Uriel'], columnas: ['Gaby', 'Hilda', 'Inés', 'Julia'], pistas: [{ t: 'Una pista larga que tiene que partirse en dos renglones para caber en el ancho del cuadro.' }], lineas: 2 },
  { escena: 'comparsa', cuadro: false, personas: P3, listas: [INS, CIU] },
  { escena: 'comparsa', personas: P3, listas: [INS, CIU], marcas: { 'p:1|1:2': 'si', '1:1|0:1': { m: 'si', desde: 2 }, 'p:1|0:1': { m: 'no', nueva: true } },
    manos: [{ f: 1, c: 2, desde: 3 }], pistas: [{ t: 'Beto vive en Ilave.' }, { t: 'Quien toca charango vive en Juliaca.', nueva: true }], lineas: 4, nota: 'Quedan 4 de 36 repartos' },
  { personas: ['Ana', 'Beto', 'Ciro', 'Dina'], listas: [{ nombre: 'deporte', items: ['fútbol', 'vóley', 'ajedrez', 'básquet'] }, { nombre: 'número', items: ['5', '7', '9', '10'] }] },
  { personas: P3, listas: [INS, CIU, { nombre: 'edad', items: ['15 años', '16 años', '17 años'] }], marcas: { '2:0|1:1': 'si', '2:1|0:0': 'no' } },
];
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(R.deLaTeoria('rm-objeto'));

R.comunes(P, TODAS, { minTeoria: 800, cortes: [0, 1, 2, 3, 4, 5, 6] });

test('papeles de color fijos: ✓ violeta, ✗ y repartos tachados en gris (tinta al 55 %); el violeta solo marca lo seguro', () => {
  assert.deepEqual(P.PAPELES, { seguro: 'f', descartado: 'tenue', amarra: 'tinta', nueva: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 6]) {
    const s = P.dibujar(datos, { corte: c });
    assert.ok(!/var\(--c-[oidh]\)/.test(s), `${donde}: un color que no es de la paleta del cuadro`);
    for (const [m] of s.matchAll(/<path data-marca="si"[^>]*>/g)) assert.match(m, /stroke="var\(--c-f\)"/, donde);
    for (const [m] of s.matchAll(/<g data-marca="no"[^>]*>(?:<line[^>]*>){2}/g)) { assert.match(m, /opacity="0.55"/, donde); assert.ok(!/var\(--c-/.test(m), `${donde}: ✗ con color`); }
    for (const [m] of s.matchAll(/<g data-reparto="fuera"[^>]*>/g)) assert.match(m, /opacity="0.55"/, donde);
    const violetas = (s.match(/var\(--c-f\)/g) || []).length, marcas = (s.match(/data-marca="(si|fila-segura)"/g) || []).length;
    assert.equal(violetas, marcas, `${donde}: violeta fuera de lo seguro`);
  }
});

test('las zonas tocables caen sobre su casilla y nombran su control', () => {
  const d = MUESTRAS[3], g = P.geometria(d), s = P.dibujar(d);
  for (const [k, ctl] of Object.entries(d.toques)) {
    const [f, c] = k.split(',').map(Number), p = g.centro(f, c);
    const m = s.match(new RegExp(`data-toque="${ctl}" x="([\\d.]+)" y="([\\d.]+)" width="([\\d.]+)" height="([\\d.]+)"`));
    assert.ok(m, ctl);
    assert.ok(p.x > +m[1] && p.x < +m[1] + +m[3] && p.y > +m[2] && p.y < +m[2] + +m[4], `${ctl} no cae en su casilla`);
  }
});

test('los textos de la cabecera caben en su columna en 14 px (cuadros de 4 columnas)', () => {
  for (const { donde, datos } of TODAS) {
    if (datos.iconos || !datos.columnas) continue;
    const g = P.geometria(datos);
    for (const t of datos.columnas) assert.ok(T.ancho(t, 14, 700) <= g.cw + 4, `${donde}: «${t}» no cabe en ${g.cw.toFixed(1)}`);
  }
});

test('cuadro en L: cada clave cae en su bloque; las de dos listas, solo en el cuadro de esas dos (y en orden)', () => {
  assert.equal(P.clave('0:2', 'p:1'), 'p:1|0:2');
  assert.equal(P.clave('0:1', '1:2'), '1:2|0:1');
  for (const d of [MUESTRAS[8], MUESTRAS[10]]) {
    const g = P.geometriaL(d), m = d.listas.length, k = d.personas.length;
    // Cada par de grupos (personas o listas) tiene exactamente un bloque.
    const grupos = ['p', ...d.listas.map((_, i) => String(i))];
    for (let a = 0; a < grupos.length; a++) for (let b = a + 1; b < grupos.length; b++) {
      const L = g.lugar(P.clave(`${grupos[a]}:0`, `${grupos[b]}:${k - 1}`));
      assert.ok(L, `${grupos[a]} y ${grupos[b]}`);
    }
    assert.equal(g.lugar('1:0|1:1'), null);
    assert.ok(m * k * g.cw + g.cab <= 320, 'el cuadro cabe en el ancho');
  }
  // La marca de una clave se dibuja en el centro de su casilla.
  const d = MUESTRAS[8], g = P.geometriaL(d), s = P.dibujar(d, { corte: 6 });
  const L = g.lugar('1:1|0:1'), m = s.match(/<path data-marca="si" d="M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)L/g);
  assert.ok(m && m.some(x => { const v = x.match(/M([\d.]+) ([\d.]+)/); return Math.abs(+v[1] + 8 - (L.x + g.cw / 2)) < 0.01; }));
});
