// Pruebas de la pieza «quim-vasos»: dibujo puro y sano, de partículas (paleta de elementos, ningún color de variable),
// con todo dentro del lienzo con 4 de margen, los rótulos sin pisarse, cada átomo dentro de su lupa, tantas
// partículas como piden los datos, el alto fijo aunque una lupa todavía no se vea y la lupa sin mirar con su «?».
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const E = require('../../elementos.js');
const V = require('./quim-vasos.js');

const atomos = { H: { el: 'H', estilo: 'hueco', r: 3.6 }, O: { el: 'O', r: 5 }, C: { el: 'C', r: 4.2 }, Na: { el: 'Na', estilo: 'punto', r: 4.6 },
  Cl: { el: 'Cl', r: 5.4 }, Si: { el: 'Si', estilo: 'punto', r: 5 }, Cu: { el: 'Cu', r: 6 }, Sn: { el: 'Sn', estilo: 'punto', r: 6 } };
const especies = { H2O: [['O', 0, -1.5], ['H', -5.5, 3.5], ['H', 5.5, 3.5]], NaCl: [['Na', -4.6, 0], ['Cl', 5, 0]],
  aceite: [['C', -6.5, 1.5], ['C', 0, -2], ['C', 6.5, 1.5]], SiO2: [['O', -6, 0], ['Si', 0, 0], ['O', 6, 0]], Cu: [['Cu', 0, 0]], Sn: [['Sn', 0, 0]] };
const base = { atomos, especies, clave: true };
const MUESTRAS = {
  tres: Object.assign({}, base, { recipientes: [
    { tipo: 'vaso', titulo: 'Agua destilada', lupa: { foco: 0.4, capas: [{ particulas: [{ e: 'H2O', n: 8 }] }] } },
    { tipo: 'vaso', titulo: 'Agua con sal', fondo: { tipo: 'sal', cantidad: 0.5 }, lupa: { foco: 0.1, desde: 1, capas: [{ alto: 0.6, particulas: [{ e: 'H2O', n: 4 }, { e: 'NaCl', n: 1 }] }, { alto: 0.4, particulas: [{ e: 'NaCl', n: 2 }], orden: 'filas' }] } },
    { tipo: 'vaso', titulo: 'Agua con arena', capa: { alto: 0.22 }, fondo: { tipo: 'arena' }, cubitos: 3, lupa: { foco: 0.1, desde: 2, capas: [{ alto: 0.55, particulas: [{ e: 'H2O', n: 3 }] }, { alto: 0.45, particulas: [{ e: 'SiO2', n: 3 }], orden: 'filas' }] } },
  ] }),
  dos: Object.assign({}, base, { recipientes: [
    { tipo: 'frasco', titulo: 'Un frasco con un nombre largo', lupa: { capas: [{ particulas: [{ e: 'H2O', n: 6 }] }] } },
    { tipo: 'trozo', titulo: 'Bronce', material: 'metal', lupa: { foco: 0.5, capas: [{ particulas: [{ e: 'Cu', n: 12 }, { e: 'Sn', n: 4 }] }] } },
  ], separacion: 16 }),
  uno: Object.assign({}, base, { recipientes: [{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 2, lupa: { vacia: true, foco: 0.74 } }] }),
  sinLupa: Object.assign({}, base, { clave: false, recipientes: [{ tipo: 'vaso', titulo: 'El vaso', capa: { alto: 0.2 }, fondo: { tipo: 'arena' } }, { tipo: 'trozo', titulo: 'Sal', material: 'cristal' }] }),
};

// Cajas de los elementos del SVG (como en fis-objeto.test.js): medio grosor de trazo incluido; textos con su ancho
// estimado (T.ancho) y su alto (de y − tam·0,8 a y + tam·0,25).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, g = (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, b: [Math.min(num(a, 'x1'), num(a, 'x2')) - g, Math.min(num(a, 'y1'), num(a, 'y2')) - g, Math.max(num(a, 'x1'), num(a, 'x2')) + g, Math.max(num(a, 'y1'), num(a, 'y2')) + g] });
    else if (tag === 'rect') out.push({ tag, b: [num(a, 'x') - g, num(a, 'y') - g, num(a, 'x') + num(a, 'width') + g, num(a, 'y') + num(a, 'height') + g] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, cx: num(a, 'cx'), cy: num(a, 'cy'), r: r + g, b: [num(a, 'cx') - r - g, num(a, 'cy') - r - g, num(a, 'cx') + r + g, num(a, 'cy') + r + g] }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '', xs = [], ys = [];
      for (const seg of d.matchAll(/([MLQC])([^MLQCZ]*)/g)) { const v = seg[2].trim().split(/[\s,]+/).map(Number); for (let i = 0; i + 1 < v.length; i += 2) { xs.push(v[i]); ys.push(v[i + 1]); } }
      if (xs.length) out.push({ tag, b: [Math.min(...xs) - g, Math.min(...ys) - g, Math.max(...xs) + g, Math.max(...ys) + g] });
    } else {
      const tam = num(a, 'font-size'), peso = num(a, 'font-weight') || 400, w = T.ancho(txt, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, txt, b: [x0, y - tam * 0.8, x0 + w, y + tam * 0.25] });
    }
  }
  return out;
}
const altoDe = svg => +svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
const pisan = (p, q) => p[0] < q[2] - 0.5 && q[0] < p[2] - 0.5 && p[1] < q[3] - 0.5 && q[1] < p[3] - 0.5;

test('se registra en el kit', () => assert.equal(Kit.piezas['quim-vasos'], V));

test('sano y puro: sin NaN, hex, ids ni scripts; texto de 14 o más; solo paleta de elementos, nunca colores de variable', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) for (const corte of [0, 1, 2]) {
    const s = V.dibujar(d, { corte });
    assert.ok(!/NaN|undefined|null|Infinity/.test(s), k);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${k}: sin colores fijos`);
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), k);
    assert.ok(!/var\(--c-/.test(s), `${k}: un dibujo de partículas no usa colores de variable`);
    for (const [, e] of s.matchAll(/var\(--el-([A-Za-z]+)\)/g)) assert.ok(E.COLORES[e], `${e} en la paleta`);
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${k}: texto de ${t}`);
    assert.equal(s, V.dibujar(d, { corte }), `${k}: pura`);
    assert.ok(/data-prueba="si"/.test(s), `${k}: objeto de prueba`);
    assert.match(V.alt(d), /modelo, no a escala/);
  }
});

test('alto fijo: una lupa que aparece en un paso posterior ya tiene su lugar reservado', () => {
  const d = MUESTRAS.tres, a = V.dibujar(d, { corte: 0 }), b = V.dibujar(d, { corte: 2 });
  assert.equal(altoDe(a), altoDe(b));
  assert.equal((a.match(/class="kit-lupa/g) || []).length, 1);
  assert.equal((b.match(/class="kit-lupa/g) || []).length, 3);
});

test('encuadre: todo cabe en el lienzo con 4 de margen', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const s = V.dibujar(d, { corte: 9 }), H = altoDe(s);
    for (const c of cajas(s)) {
      const [x0, y0, x1, y1] = c.b;
      assert.ok(x0 >= 4 - 1e-6 && y0 >= 4 - 1e-6 && x1 <= 316 + 1e-6 && y1 <= H - 4 + 1e-6, `${k}: ${c.tag} ${c.txt || ''} fuera: ${c.b.map(x => x.toFixed(1))} (alto ${H})`);
    }
  }
});

test('rótulos: ningún texto pisa a otro; los títulos no pisan los vasos ni las lupas; la clave queda bajo las lupas', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const s = V.dibujar(d, { corte: 9 }), cs = cajas(s), textos = cs.filter(c => c.tag === 'text');
    for (let i = 0; i < textos.length; i++) for (let j = i + 1; j < textos.length; j++) assert.ok(!pisan(textos[i].b, textos[j].b), `${k}: «${textos[i].txt}» pisa «${textos[j].txt}»`);
    const g = V.geometria(d);
    for (const t of textos) {
      if (t.txt === '?') continue;
      // Un título va encima de los objetos; un símbolo de la clave, debajo de todas las lupas.
      if (t.b[3] <= g.v0 + 1) continue;
      assert.ok(t.b[1] >= g.lupa.cy + g.lupa.R, `${k}: «${t.txt}» se mete entre los objetos`);
    }
  }
});

test('cada átomo cae dentro de su lupa, y la lupa tiene tantas partículas como dicen los datos', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const s = V.dibujar(d, { corte: 9 }), g = V.geometria(d);
    const lupas = (d.recipientes || []).map((r, i) => (r.lupa && !r.lupa.vacia ? i : null)).filter(i => i !== null);
    for (const i of lupas) {
      const cap = V.capacidad(d, i), pedidas = d.recipientes[i].lupa.capas.map(c => c.particulas.reduce((a, p) => a + p.n, 0));
      pedidas.forEach((n, ci) => assert.ok(n <= cap[ci], `${k} lupa ${i} capa ${ci}: ${n} partículas y caben ${cap[ci]}`));
    }
    const total = (d.recipientes || []).filter(r => r.lupa && !r.lupa.vacia).reduce((a, r) => a + r.lupa.capas.reduce((b, c) => b + c.particulas.reduce((x, p) => x + p.n, 0), 0), 0);
    assert.equal((s.match(/class="kit-particula"/g) || []).length, total, k);
    // Los átomos (círculos dentro de las partículas) quedan dentro del círculo de su lupa.
    for (const m of s.matchAll(/<g class="kit-particula">(.*?)<\/g>/g)) for (const c of cajas(m[1])) {
      if (c.tag !== 'circle') continue;
      const k2 = Math.max(0, Math.min(g.n - 1, Math.floor(c.cx / g.sw))), dc = Math.hypot(c.cx - g.cx(k2), c.cy - g.lupa.cy);
      assert.ok(dc + c.r <= g.lupa.R - 1, `${k}: átomo en (${c.cx}, ${c.cy}) se sale de la lupa ${k2}`);
    }
  }
});

test('la lupa sin mirar muestra un «?» y no dibuja partículas ni clave', () => {
  const s = V.dibujar(MUESTRAS.uno, {});
  assert.ok(/>\?<\/text>/.test(s));
  assert.ok(!/kit-particula|kit-clave/.test(s));
  assert.deepEqual(V.elementosDe(MUESTRAS.uno), []);
});

test('la clave dice los elementos de las lupas que se ven, en el orden en que aparecen', () => {
  assert.deepEqual(V.elementosDe(MUESTRAS.tres, 0), ['O', 'H']);
  assert.deepEqual(V.elementosDe(MUESTRAS.tres, 2), ['O', 'H', 'Na', 'Cl', 'Si']);
  const s = V.dibujar(MUESTRAS.tres, { corte: 2 });
  assert.equal((s.match(/class="kit-clave"/g) || []).length, 5);
});

test('fidelidad del aspecto: la sal que se disuelve deja menos granitos; el aceite es una capa; los cubitos, los pedidos', () => {
  const vaso = (extra) => Object.assign({}, base, { clave: false, recipientes: [Object.assign({ tipo: 'vaso', titulo: 'V' }, extra)] });
  const granos = c => (V.dibujar(vaso({ fondo: { tipo: 'sal', cantidad: c } })).match(/width="4" height="4"/g) || []).length;
  assert.equal(granos(1), 9); assert.equal(granos(0), 0); assert.ok(granos(0.5) > 0 && granos(0.5) < 9);
  assert.equal((V.dibujar(vaso({ cubitos: 2 })).match(/width="14" height="13"/g) || []).length, 2);
  assert.notEqual(V.dibujar(vaso({ capa: { alto: 0.2 } })), V.dibujar(vaso({})));
});
