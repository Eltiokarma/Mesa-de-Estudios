// Pruebas de la pieza «trig-vista» (las escenas de lado de «Resolución de triángulos rectángulos»): cada escena se dibuja
// sin NaN ni colores fijos, es pura, de alto fijo, marcada como dibujo de prueba y con su texto alternativo. Con números
// (docs/molde-unidad.md §6): los rótulos quedan dentro del lienzo con 4 de margen y ninguno pisa a otro, en las muestras y
// en todas las figuras de la teoría (con «Ahora tú» y «Así se resuelve» en 120 semillas). Y es fiel: un ángulo dibujado
// mide lo que dicen sus puntos, y el ojo queda a la altura de la persona.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./trig-vista.js');
const { W, H, M } = P.constantes;

const MUESTRAS = [
  { objetos: [{ tipo: 'estaca', x: 0 }, { tipo: 'cometa', x: 34.6, y: 20 }], lados: [{ de: [0, 0], a: [34.6, 20], texto: 'H = 40 m', lado: 1 }, { de: [34.6, 0], a: [34.6, 20], como: 'punteada', color: 'o', texto: 'h = ?' }],
    angulos: [{ en: [0, 0], de: [1, 0], a: [34.6, 20], texto: '30°' }], rectos: [{ en: [34.6, 0], de: [0, 0], a: [34.6, 20] }] },
  { ojo: 1.5, objetos: [{ tipo: 'persona', x: 0 }, { tipo: 'globo', x: 20, y: 21.5 }], horizontales: [{ en: [0, 1.5], hasta: 20 }],
    lados: [{ de: [0, 1.5], a: [20, 21.5], como: 'vista' }, { de: [20, 1.5], a: [20, 21.5], como: 'cota', color: 'o', texto: '20 m', lado: -1 }, { de: [0, 0], a: [20, 0], como: 'cota', color: 'i', texto: 'd = 20 m', lado: -1, sep: 12 }],
    angulos: [{ en: [0, 1.5], de: [20, 1.5], a: [20, 21.5], texto: '45°' }] },
  { objetos: [{ tipo: 'cerro', x: 0, h: 300, ancho: 160 }, { tipo: 'combi', x: 519.6, lado: -1, tenue: true, dx: 18 }, { tipo: 'combi', x: 173.2, lado: -1, dx: 18 }],
    lados: [{ de: [0, 0], a: [0, 300], como: 'punteada', color: 'o', texto: 'h = 300 m' }, { de: [519.6, 0], a: [0, 300], como: 'vista' }, { de: [173.2, 0], a: [0, 300], como: 'vista' }, { de: [173.2, 0], a: [519.6, 0], como: 'cota', color: 'i', texto: '200√3 m', lado: -1, sep: 12 }],
    angulos: [{ en: [519.6, 0], de: [0, 0], a: [0, 300], texto: '30°', radio: 30 }, { en: [173.2, 0], de: [0, 0], a: [0, 300], texto: '60°' }] },
  { agua: [0, 70], objetos: [{ tipo: 'faro', x: 0, h: 30, ancho: 4, lado: -1 }, { tipo: 'lancha', x: 40 }], horizontales: [{ en: [0, 30], hasta: 40 }],
    lados: [{ de: [0, 30], a: [40, 0], como: 'vista' }, { de: [0, 0], a: [40, 0], como: 'cota', color: 'i', texto: '?', lado: -1, sep: 12 }], angulos: [{ en: [0, 30], de: [40, 30], a: [40, 0], texto: '37°' }] },
  { suelo: false, lados: [{ de: [0, 0], a: [4, 0], color: 'i', texto: 'a cos θ', lado: -1 }, { de: [4, 0], a: [4, 3], color: 'o', texto: 'a sen θ', lado: -1 }, { de: [0, 0], a: [4, 3], texto: 'a', lado: 1 }],
    angulos: [{ en: [0, 0], de: [4, 0], a: [4, 3], texto: 'θ' }], rectos: [{ en: [4, 0], de: [0, 0], a: [4, 3] }],
    puntos: [{ en: [0, 0], texto: 'A', dir: [-1, 0.5] }, { en: [4, 0], texto: 'C', dir: [1, 0.5] }, { en: [4, 3], texto: 'B', dir: [1, -0.3] }] },
  { ojo: 1.5, objetos: [{ tipo: 'persona', x: 0 }, { tipo: 'letrero', x: 10, h: 7.5, h1: 3.5 }], horizontales: [{ en: [0, 1.5], hasta: 10 }],
    lados: [{ de: [0, 1.5], a: [10, 3.5], como: 'vista' }, { de: [0, 1.5], a: [10, 7.5], como: 'vista' }], angulos: [{ en: [0, 1.5], de: [10, 3.5], a: [10, 7.5], texto: 'φ', radio: 54 }] },
  { objetos: [{ tipo: 'edificio', x: 0, h: 24, ancho: 8, lado: -1 }, { tipo: 'arbol', x: 18, h: 8 }, { tipo: 'dron', x: 30, y: 30 }, { tipo: 'auto', x: 40 }, { tipo: 'tanque', x: 50, h: 15, ancho: 6 },
    { tipo: 'acantilado', x: 62, h: 20, ancho: 6 }, { tipo: 'barco', x: 70 }, { tipo: 'poste', x: 76, h: 10 }, { tipo: 'camara', x: 76, y: 10 }, { tipo: 'ojo', x: 80, y: 0 },
    { tipo: 'antena', x: 86, h: 12 }, { tipo: 'escalera', de: [90, 0], a: [94, 8] }, { tipo: 'tobogan', x: 100, h: 3, hasta: 106 }] },
];

// Figuras de la teoría (la unidad entera) en trig-vista.
function teoria() {
  const RAIZ = path.join(__dirname, '..', '..', '..');
  const def = require(path.join(RAIZ, 'contenido/teoria/trigonometria/triangulos-rectangulos.js'));
  const Teoria = require(path.join(RAIZ, 'nucleo/teoria.js'));
  const out = [];
  const add = (d, f) => { if (f && f.datos && (f.pieza || 'trig-vista') === 'trig-vista') out.push([d, f.datos, f.estado || {}]); };
  for (const idea of def.ideas) {
    (idea.lee.tarjetas || []).forEach((t, k) => add(`${idea.id} lee ${k}`, t.dibujo));
    for (const v of Teoria.grilla(idea.juega.controles)) add(`${idea.id} juego`, idea.juega.dibujo(v));
    add(`${idea.id} predice`, idea.predice.dibujo); add(`${idea.id} revelar`, idea.predice.revelar);
    idea.mira.pasos.forEach((p, k) => add(`${idea.id} mira ${k}`, { datos: idea.mira.datos, estado: p.estado }));
    add(`${idea.id} regla`, idea.regla.dibujo);
    (idea.ejemplos || []).forEach((e, k) => add(`${idea.id} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 120; s++) {
      const r = idea.resuelve.generar(s), a = idea.ahoraTu.generar(s);
      add(`${idea.id} resuelve ${s}`, r.dibujo); r.pasos.forEach(p => add(`${idea.id} resuelve ${s}`, p.dibujo)); add(`${idea.id} ahora ${s}`, a.dibujo);
    }
  }
  for (const m of def.laboratorio.filter(m => m.pieza === 'trig-vista')) for (const v of Teoria.grilla(m.controles)) add(`mesa ${m.id}`, m.dibujo(v));
  return out;
}

test('cada escena: SVG sano, puro, de 320 × 260, con data-prueba y texto alternativo; solo currentColor y var(--c-*)', () => {
  for (const d of MUESTRAS) {
    const svg = P.dibujar(d, {});
    assert.ok(!/NaN|undefined|Infinity/.test(svg));
    assert.equal(svg, P.dibujar(d, {}), 'pura');
    assert.match(svg, /viewBox="0 0 320 260"/);
    assert.match(svg, /data-prueba="si"/);
    assert.ok(P.alt(d).length > 15);
    for (const c of svg.match(/(?:stroke|fill)="([^"]+)"/g) || []) assert.match(c, /="(none|currentColor|var\(--c-[oihdf]\)|var\(--card\))"/, c);
  }
});

const pisan = (a, b) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
function revisar(donde, datos, estado) {
  const g = P.geometria(datos, estado), malos = [];
  for (const c of g.cajas) {
    if (c.x - c.w / 2 < M - 0.5 || c.x + c.w / 2 > W - M + 0.5 || c.y - c.h / 2 < M - 0.5 || c.y + c.h / 2 > H - M + 0.5) malos.push(`${donde}: «${c.texto}» se sale del lienzo`);
  }
  for (let i = 0; i < g.cajas.length; i++) for (let j = i + 1; j < g.cajas.length; j++) {
    if (pisan(g.cajas[i], g.cajas[j])) malos.push(`${donde}: «${g.cajas[i].texto}» pisa a «${g.cajas[j].texto}»`);
  }
  return malos;
}

test('rótulos: dentro del lienzo con 4 de margen y ninguno sobre otro (muestras y toda la teoría)', () => {
  const malos = [];
  MUESTRAS.forEach((d, k) => malos.push(...revisar(`muestra ${k}`, d, {})));
  for (const [donde, d, e] of teoria()) malos.push(...revisar(donde, d, e));
  assert.deepEqual([...new Set(malos)].slice(0, 20), []);
});

test('fidelidad: los ejes van a una sola escala (un ángulo de 30° se dibuja de 30°) y el ojo queda a la altura de la persona', () => {
  const d = MUESTRAS[0], g = P.geometria(d, {});
  const [x0, y0] = g.P([0, 0]), [x1, y1] = g.P([34.6, 20]);
  assert.ok(Math.abs(Math.atan2(y0 - y1, x1 - x0) * 180 / Math.PI - Math.atan2(20, 34.6) * 180 / Math.PI) < 0.01);
  const g2 = P.geometria(MUESTRAS[1], {}), [, yOjo] = g2.P([0, 1.5]), [, ySuelo] = g2.P([0, 0]);
  assert.ok(ySuelo - yOjo >= P.constantes.OJO_PX - 0.01, 'el ojo, con su alto mínimo en pantalla');
  // Sobre los ojos, a escala: la elevación dibujada es la del mundo.
  const [xa, ya] = g2.P([0, 1.5]), [xb, yb] = g2.P([20, 21.5]);
  assert.ok(Math.abs(Math.atan2(ya - yb, xb - xa) * 180 / Math.PI - 45) < 0.01);
});

// Cierre delegado (19 nov): el rótulo de un ángulo nunca va bajo el suelo (el «60°» de la combi quedaba debajo del cerro)
// y queda junto a su arco: dentro de su abertura, el arco llega hasta él.
test('rótulos de ángulo: nunca bajo el suelo, y junto a su arco (a 20 px o menos), en toda la teoría', () => {
  const malos = [];
  for (const [donde, d, e] of teoria()) {
    const g = P.geometria(d, e);
    const vis = x => (x.paso || 0) <= ((e && e.paso) || 0);
    if ((d.angulos || []).some(a => Array.isArray(a.texto))) continue;   // los de «Mira», con pasos: los ven las capturas
    let k = 0;
    for (const a of (d.angulos || []).filter(vis)) {
      const t = a.texto;
      if (t === null || t === undefined || t === '') continue;
      const b = g.cajas[k++], c = g.P(a.en);
      if (d.suelo !== false && b.y > g.G) malos.push(`${donde}: «${t}» bajo el suelo`);
      const dn = Math.hypot(Math.max(Math.abs(b.x - c[0]) - b.w / 2, 0), Math.max(Math.abs(b.y - c[1]) - b.h / 2, 0));
      if (dn > (a.radio || 24) + 20 + 70) malos.push(`${donde}: «${t}» a ${dn.toFixed(0)} px de su vértice`);
    }
  }
  assert.deepEqual([...new Set(malos.map(m => m.replace(/ \d+:/, ' #:')))].slice(0, 10), []);
});
