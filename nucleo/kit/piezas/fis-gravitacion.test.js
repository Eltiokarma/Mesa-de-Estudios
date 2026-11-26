// Oráculo geométrico propio: transformaciones, extremos de cotas, focos,
// proporciones de flechas y cajas de texto. No reutiliza el trazado de la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-gravitacion.js');
const cerca = (a, b, mensaje) => assert.ok(Math.abs(a - b) < 1e-8, `${mensaje}: ${a} / ${b}`);
const cajaToca = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
// Intersección independiente por orientación y bordes, sin el recorte paramétrico del dibujo.
function cortaCaja(a, b, r) {
  const interior = p => p[0] > r.x0 + 1e-7 && p[0] < r.x1 - 1e-7 && p[1] > r.y0 + 1e-7 && p[1] < r.y1 - 1e-7;
  if (interior(a) || interior(b)) return true;
  const cruz = (p, q, z) => (q[0] - p[0]) * (z[1] - p[1]) - (q[1] - p[1]) * (z[0] - p[0]);
  const cruzan = (c, d) => cruz(a, b, c) * cruz(a, b, d) < -1e-7 && cruz(c, d, a) * cruz(c, d, b) < -1e-7;
  const vs = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
  return vs.some((v, i) => cruzan(v, vs[(i + 1) % 4]));
}
function verificar(g, nombre) {
  const punto = p => assert.ok(p[0] >= 4 - 1e-8 && p[0] <= 316 + 1e-8 && p[1] >= 4 - 1e-8 && p[1] <= g.H - 4 + 1e-8,
    `${nombre}: fuera del margen (${p}) en 320 × ${g.H}`);
  for (const b of [...g.rotulos, ...g.objetos]) { punto([b.x0, b.y0]); punto([b.x1, b.y1]); }
  for (const l of g.segmentos) { punto(l.de); punto(l.a); }
  for (const f of g.flechas) { punto([f.x1, f.y1]); punto([f.x2, f.y2]); f.punta.forEach(punto); }
  for (const q of g.sectores) q.puntos.forEach(punto);
  g.rotulos.forEach((r, i) => {
    for (const otro of g.rotulos.slice(i + 1)) assert.ok(!cajaToca(r, otro), `${nombre}: rótulos «${r.texto}» / «${otro.texto}»`);
    for (const o of g.objetos) assert.ok(!cajaToca(r, o), `${nombre}: «${r.texto}» sobre ${o.tipo}`);
    for (const l of g.segmentos) assert.ok(!cortaCaja(l.de, l.a, r), `${nombre}: «${r.texto}» sobre ${l.tipo}`);
    for (const f of g.flechas) {
      assert.ok(!cortaCaja([f.x1, f.y1], [f.x2, f.y2], r), `${nombre}: «${r.texto}» sobre flecha`);
      for (let j = 0; j < 3; j++) assert.ok(!cortaCaja(f.punta[j], f.punta[(j + 1) % 3], r), `${nombre}: «${r.texto}» sobre punta`);
    }
  });
}
function radial(k = 0) {
  const r = 2 + (k % 41) / 10;
  return { vista: { x0: -1.5, x1: 7, y0: -1.5, y1: 1.5 }, altoGrafico: 144, escalas: { F: 2.5 },
    alt: 'Dos posiciones de una sonda junto a un planeta; las cotas parten del centro.',
    paneles: [2, r].map((distancia, i) => ({ titulo: i ? 'Ensayo' : 'Referencia', modo: 'radial',
      planeta: { c: [0, 0], R: 1, rotulo: 'M', colorRotulo: 'f' }, satelite: { c: [distancia, 0], rotulo: 'm', colorRotulo: 'f' },
      cotas: [{ de: [0, 0], a: [distancia, 0], texto: `r = ${distancia.toFixed(1)} R`, color: 'i' },
        { de: [0, 0], a: [1, 0], texto: 'R', color: 'i' }, { de: [1, 0], a: [distancia, 0], texto: 'h', color: 'i' }],
      flechas: [{ de: [distancia, 0], d: [-(i + 1) * 8, 0], familia: 'F', rotulo: 'F⃗_A', color: 'h' }],
      notas: [{ texto: 'M = 6 × 10²⁴ kg', color: 'f' }, { texto: 'm = 500 kg', color: 'f' }] })) };
}
function orbital(k) {
  const elipse = k % 2, a = 3, b = elipse ? 2 : 3, c = Math.sqrt(a * a - b * b), t = k * 0.37;
  const x = a * Math.cos(t), y = b * Math.sin(t);
  return { vista: { x0: -5, x1: 5, y0: -5, y1: 5 }, altoGrafico: 220, escalas: { F: 3, v: 3 },
    alt: 'Trayectoria y posición indicadas por el problema.', paneles: [{ titulo: elipse ? 'Órbita elíptica' : 'Órbita circular', modo: elipse ? 'elipse' : 'circular',
      planeta: { c: [-c, 0], R: 0.45, rotulo: 'M', colorRotulo: 'f' }, satelite: { c: [x, y], tam: 8, rotulo: 'm', colorRotulo: 'f' },
      orbita: elipse ? { a, b } : { r: a },
      flechas: [{ de: [x, y], d: [-3 * Math.cos(t), -3 * Math.sin(t)], familia: 'F', color: 'h', rotulo: 'F⃗' },
        { de: [x, y], d: [-5 * Math.sin(t), 5 * Math.cos(t)], familia: 'v', color: 'o', rotulo: 'v⃗' }],
      sectores: [{ puntos: [[-c, 0], [a, 0], [a * Math.cos(0.2), b * Math.sin(0.2)]], color: 'i' }],
      notas: [{ texto: 't = 2 h', color: 'd' }] }] };
}

test('se registra como pieza pura con alt manual y notación real', () => {
  assert.equal(Kit.piezas['fis-gravitacion'], P);
  const d = radial(), antes = JSON.stringify(d), s = P.dibujar(d);
  assert.equal(s, P.dibujar(d)); assert.equal(JSON.stringify(d), antes);
  assert.equal(P.alt(d), d.alt); assert.equal(P.alt({}), '');
  assert.match(s, /data-prueba="planeta-gravitacion"/); assert.match(s, /data-prueba="satelite-gravitacion"/);
  assert.match(s, /font-size="10\.08"/); assert.ok(!s.includes('>_</tspan>')); assert.ok(!s.includes('>⃗</tspan>'));
  assert.ok(!/NaN|undefined|Infinity|#[0-9a-f]{3,8}\b|<script|\son[a-z]+\s*=|\sid=/i.test(s));
  for (const [, valor] of s.matchAll(/(?:fill|stroke)="([^"]+)"/g)) assert.match(valor, /^(none|currentColor|var\(--c-[oihdf]\))$/);
  for (const [, valor] of s.matchAll(/<text[^>]*font-size="([\d.]+)"/g)) assert.ok(+valor >= 14);
});

test('400 escenas: margen de 4 px y ningún rótulo sobre objetos, líneas o flechas', () => {
  for (let k = 0; k < 400; k++) {
    const d = k % 2 ? radial(k) : orbital(k / 2);
    verificar(P.geometria(d), `semilla ${k}`);
  }
});

test('escala única e inversas en ambos paneles; las flechas conservan proporción', () => {
  const g = P.geometria(radial());
  for (const p of g.paneles) {
    cerca(p.X(1) - p.X(0), p.Y(0) - p.Y(1), 'escala x/y'); cerca(p.s, g.s, 'escala entre paneles');
    for (const x of [-1, 0, 0.25, 3, 6]) { cerca(p.Xi(p.X(x)), x, 'inversa x'); cerca(p.Yi(p.Y(x)), x, 'inversa y'); }
  }
  cerca(g.flechas[1].largo, 2 * g.flechas[0].largo, 'doble magnitud, doble longitud');
  for (const f of g.flechas) cerca(Math.hypot(f.x2 - f.x1, f.y2 - f.y1), Math.hypot(...f.vector) * f.escala, 'escala sin recorte');
});

test('r, R y h conservan extremos y longitudes; las guías llegan al centro y superficie', () => {
  const d = radial(15), g = P.geometria(d);
  g.cotas.forEach((c, i) => {
    const entrada = d.paneles[Math.floor(i / 3)].cotas[i % 3], p = g.paneles[c.panel];
    assert.deepEqual(c.originalDe, [p.X(entrada.de[0]), p.Y(entrada.de[1])]);
    assert.deepEqual(c.originalA, [p.X(entrada.a[0]), p.Y(entrada.a[1])]);
    cerca(Math.hypot(c.a[0] - c.de[0], c.a[1] - c.de[1]), c.largoFisico * p.s, 'longitud de cota');
  });
  for (let i = 0; i < 2; i++) cerca(g.cotas[i * 3].largo, g.cotas[i * 3 + 1].largo + g.cotas[i * 3 + 2].largo, 'r = R + h');
});

test('cotas inclinadas: el rótulo queda fuera de la medida en ambos lados, sin deformar longitud', () => {
  for (let k = 0; k < 400; k++) {
    const t = 2 * Math.PI * (k + 0.25) / 400, extremo = [3.5 * Math.cos(t), 3.5 * Math.sin(t)];
    const d = { vista: { x0: -7, x1: 7, y0: -7, y1: 7 }, altoGrafico: 220, paneles: [{
      planeta: { c: [0, 0], R: 0.5, rotulo: 'M' }, satelite: { c: extremo, tam: 8, rotulo: 'm' },
      cotas: [{ de: [0, 0], a: extremo, texto: 'r = 12 000 km', lado: k % 2 ? -1 : 1 }] }] };
    const g = P.geometria(d), c = g.cotas[0];
    verificar(g, `cota inclinada ${k}`);
    cerca(Math.hypot(c.a[0] - c.de[0], c.a[1] - c.de[1]), 3.5 * g.s, 'cota inclinada conserva longitud');
  }
});

test('astro en foco: los puntos de elipse suman 2a y el círculo mantiene radio', () => {
  for (const k of [0, 1]) {
    const g = P.geometria(orbital(k)), o = g.orbitas[0];
    cerca(o.rx / o.ry, o.a / o.b, 'ejes no deformados');
    for (let i = 0; i < 40; i++) {
      const t = i * Math.PI / 20, x = o.a * Math.cos(t), y = o.b * Math.sin(t), c = Math.sqrt(o.a * o.a - o.b * o.b);
      cerca(Math.hypot(x - c, y) + Math.hypot(x + c, y), 2 * o.a, 'suma de distancias focales');
    }
    if (o.foco) { cerca(g.objetos[0].c[0], o.foco[0], 'astro en foco'); cerca(o.centro[0] - o.foco[0], Math.sqrt(o.a * o.a - o.b * o.b), 'posición del centro'); }
  }
});

test('sectores, múltiples astros, rastros y escape se dibujan según sus datos', () => {
  const d = { vista: { x0: -2, x1: 8, y0: -2, y1: 2 }, altoGrafico: 144, escalas: { v: 3 }, alt: 'Sonda en salida radial.',
    paneles: [{ titulo: 'Salida radial', modo: 'escape', planetas: [{ c: [0, 0], R: 1, rotulo: 'M', colorRotulo: 'f' }, { c: [6, 1], R: 0.35 }],
      satelites: [{ c: [3, 0], tam: 8, hasta: 0 }, { c: [5.5, 0], tam: 8, paso: 1, rotulo: 'm', colorRotulo: 'f' }],
      trayectoria: [[1, 0], [3, 0], [5.5, 0], [7, 0]], flechas: [{ de: [5.5, 0], d: [4, 0], familia: 'v', color: 'o', rotulo: 'v⃗', paso: 1 }],
      sectores: [{ puntos: [[0, 0], [2, 0], [2, 1]], color: 'd' }], notas: ['Trayectoria radial'] }] };
  const inicial = P.geometria(d), final = P.geometria(d, { paso: 1 });
  verificar(inicial, 'escape inicial'); verificar(final, 'escape final');
  assert.equal(inicial.H, final.H); assert.equal(final.objetos.length, 3); assert.equal(final.flechas.length, 1);
  const p = final.paneles[0];
  assert.deepEqual(final.sectores[0].puntos, d.paneles[0].sectores[0].puntos.map(([x, y]) => [p.X(x), p.Y(y)]));
  assert.equal(final.segmentos.filter(s => s.tipo === 'trayectoria').length, 3);
});

test('omite incógnitas, escapa texto y rechaza datos que deformarían el dibujo', () => {
  const d = { paneles: [{ planeta: { c: [0, 0], R: 1 }, satelite: { c: [3, 0] } }] };
  assert.ok(!P.dibujar(d).includes('<text'));
  const malicioso = P.dibujar({ paneles: [{ notas: ['<a> & "b"'] }] });
  assert.ok(!malicioso.includes('<a>')); assert.ok(malicioso.includes('&lt;'));
  assert.throws(() => P.geometria({ paneles: [{ notas: ['M'.repeat(100)] }] }), /ancho/);
  assert.throws(() => P.geometria({ vista: { x0: 0, x1: 0, y0: -1, y1: 1 } }), /vista/);
  assert.throws(() => P.geometria({ paneles: [{ orbita: { a: 1, b: 2 } }] }), /elipse/);
  assert.throws(() => P.geometria({ paneles: [{ flechas: [{ de: [0, 0], d: [1, 0], familia: 'F' }] }] }), /escala/);
});

test('cortes y flechas nulas respetan los datos sin cambiar su altura', () => {
  const d = { ...radial(1), cortes: [{ paneles: radial(1).paneles }, { paneles: radial(2).paneles }] };
  const a = P.geometria(d, { corte: 0 }), b = P.geometria(d, { corte: 1 });
  assert.equal(a.H, b.H); assert.notEqual(a.objetos[3].x, b.objetos[3].x);
  d.cortes[1].paneles[0].flechas[0].d = [0, 0];
  const nula = P.geometria(d, { corte: 1 });
  assert.equal(nula.flechas.length, 1); assert.ok(!nula.rotulos.some(r => r.panel === 0 && r.clase === 'rotulo-flecha'));
});

// Auditoría (26 nov): cada letra iba en su propio tspan con x estimado y el navegador
// dejaba huecos dentro de las palabras («Ref er encia»). Una palabra va en un solo tspan.
test('el texto corre seguido: una palabra no se parte en tspans con x propio', () => {
  const s = P.dibujar({ paneles: [{ titulo: 'Referencia', notas: [{ texto: 'F_ref = 160 N', color: 'h' }, 'Separaciones a escala.'] }] });
  assert.match(s, />Referencia<\/tspan>/); assert.match(s, />Separaciones a escala\.<\/tspan>/);
  assert.match(s, /<tspan[^>]*font-size="[\d.]+"[^>]*>ref<\/tspan>/);
  for (const [, t] of s.matchAll(/<text[^>]*>(.*?)<\/text>/g)) assert.ok((t.match(/<tspan[^>]*\sx="/g) || []).length <= 1, t);
});
