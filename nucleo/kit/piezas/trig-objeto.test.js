// Pruebas de la pieza «trig-objeto»: cada objeto se dibuja sin NaN ni colores fijos, es puro, de alto fijo, marcado como
// dibujo de prueba y con su texto alternativo. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo
// con 4 de margen, ningún rótulo pisa a otro, ninguno cruza un lado del triángulo ni el suelo. Se revisan las muestras de
// abajo y también todas las figuras de la teoría que usan la pieza (juego en toda su grilla, predicción, «Mira» paso a
// paso, ejemplos, «Así se resuelve» y «Ahora tú» en varias semillas).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./trig-objeto.js');

const lado = (texto, color, texto2) => Object.assign({ texto }, color ? { color } : {}, texto2 ? { texto2 } : {});
const MUESTRAS = {
  escalera: { medidas: { piso: 3, pared: 4 }, lados: { escalera: lado('5 m', 'o', 'H'), pared: lado('4 m', 'i', 'adyacente a α'), piso: lado('3 m', 'f', 'opuesto a α') }, angulos: { pie: { texto: 'θ' }, arriba: { texto: 'α' } } },
  rampa: { medidas: { base: 1.2, alto: 0.5 }, lados: { rampa: lado('1,3 m'), base: lado('1,2 m'), alto: lado('0,5 m') }, angulos: { abajo: { texto: 'θ' }, arriba: { texto: 'α' } } },
  poste: { medidas: { suelo: 6, poste: 8 }, lados: { cable: lado('10 m', 'o'), suelo: lado('6 m'), poste: lado('8 m', 'i') }, angulos: { suelo: { texto: 'θ' }, arriba: { texto: 'α' } } },
  repisa: { medidas: { pared: 40, brazo: 30 }, lados: { tirante: lado('50 cm'), pared: lado('40 cm'), brazo: lado('30 cm') }, angulos: { abajo: { texto: 'θ' }, punta: { texto: 'α' } } },
  chacra: { medidas: { ra: 90, rb: 120 }, lados: { ra: lado('90 m'), rb: lado('120 m'), h: lado('150 m') } },
  triangulo: { medidas: { ra: 20, rb: 21 }, giro: 25, vertices: { r: 'Q', a: 'P', b: 'R' }, lados: { ra: lado('20'), rb: lado('21'), h: lado('29') }, angulos: { b: { texto: 'R' } } },
  // Objetos de las ideas 2 a 5 (17 nov).
  sombras: { marco: [10, 6], medidas: { sombra: 10, poste: 6 }, lados: { poste: lado('6 m', 'o'), sombra: lado('10 m', 'i'), rayo: lado('≈ 11,66 m'), primo: lado('1,5 m', 'o'), sombra2: lado('2,5 m', 'i') }, angulos: { suelo: { texto: 'θ' }, suelo2: {}, arriba: { texto: 'α' } }, nota: '6 ÷ 10 = 1,5 ÷ 2,5 = 0,6' },
  senal: { medidas: { lado: 80 }, lados: { media: lado('40 cm', 'o'), lado: lado('80 cm', 'i'), altura: lado('40√3 cm') }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } },
  loseta: { medidas: { lado: 30 }, lados: { costado: lado('30 cm', 'o'), diagonal: lado('30√2 cm', 'i'), base: lado('30 cm') }, angulos: { izquierda: { texto: '45°' }, arriba: { texto: '45°' } } },
  escuadras: { lados: { corto: lado('1', 'o'), largo: lado('√3'), hip: lado('2', 'i'), c1: lado('1'), c2: lado('1', 'o'), d: lado('√2', 'i') }, angulos: { a30: { texto: '30°' }, a60: { texto: '60°' }, e1: { texto: '45°' }, e2: { texto: '45°' } }, nota: 'sen 45° = 1/√2 = √2/2' },
  cuerda: { marco: [4, 6], medidas: { base: 4, estaca: 3 }, lados: { base: lado('4 m', 'o'), estaca: lado('3 m', 'i'), cuerda: lado('5 m', 'f') }, angulos: { transportador: { texto: '37°' } } },
  techo: { marco: [3, 3], medidas: { viga: 3, poste: 3 * Math.tan(20 * Math.PI / 180) }, lados: { viga: lado('viga'), poste: lado('poste', 'o'), calamina: lado('calamina', 'i') }, angulos: { alero: { texto: 'θ' }, cumbre: { texto: 'α' } } },
  figura: { forma: 'trapecio', menor: 10, medidas: { ra: 16, rb: 12 }, lados: { CH: lado('12 m', 'o'), CD: lado('10 m', 'i'), BC: lado('?') }, angulos: { B: { texto: '37°' } } },
};
const VARIANTES = [
  Object.assign({ objeto: 'poste', sombra: true }, { medidas: { sombra: 8, poste: 6 }, lados: { rayo: lado('10 m'), sombra: lado('8 m'), poste: lado('6 m') }, angulos: { suelo: { texto: 'θ' }, arriba: { texto: 'α' } } }),
  { objeto: 'escalera', medidas: { piso: 0.7, pared: 2.4 }, lados: { escalera: lado('2,5 m'), piso: lado('0,7 m'), pared: lado('2,4 m') }, angulos: { pie: { texto: 'θ' }, arriba: { texto: 'α' } } },
  { objeto: 'escalera', medidas: { piso: 4.5, pared: Math.sqrt(4.75) }, marco: [4.5, 5], lados: { escalera: lado('5 m', 'o'), piso: lado('4,5 m', 'f'), pared: lado('≈ 2,18 m', 'i') }, angulos: { pie: { texto: 'θ' } } },
  { objeto: 'escalera', medidas: { piso: 1, pared: Math.sqrt(24) }, marco: [4.5, 5], lados: { escalera: lado('5 m', 'o'), piso: lado('1 m', 'f'), pared: lado('≈ 4,9 m', 'i') }, angulos: { pie: { texto: 'θ' } } },
  { objeto: 'triangulo', medidas: { ra: 5, rb: 12 }, giro: 200, vertices: { r: 'N', a: 'M', b: 'L' }, angulos: { a: { texto: 'M' } } },
  { objeto: 'repisa', medidas: { pared: 36, brazo: 15 }, lados: { tirante: lado('39 cm', 'o'), pared: lado('36 cm', 'i') }, angulos: { abajo: { texto: 'θ' }, punta: { texto: 'α' } } },
  { objeto: 'sombras', marco: [10, 6], medidas: { sombra: 4, poste: 6 }, lados: { poste: lado('6 m', 'o'), sombra: lado('4 m', 'i'), primo: lado('1,5 m', 'o'), sombra2: lado('?') }, angulos: { suelo: { texto: 'θ' }, suelo2: {} } },
  { objeto: 'senal', medidas: { lado: 20 }, lados: { media: lado('10 cm', 'o'), lado: lado('20 cm', 'i'), altura: lado('10√3 cm') }, angulos: { esquina: { texto: '60°' }, punta: { texto: '30°' } } },
  { objeto: 'cuerda', marco: [4, 6], medidas: { base: 4, estaca: 1 }, lados: { base: lado('4 m', 'o'), estaca: lado('1 m', 'i'), cuerda: lado('≈ 4,12 m', 'f') }, angulos: { transportador: { texto: '14°' } } },
  { objeto: 'cuerda', marco: [4, 6], medidas: { base: 4, estaca: 6 }, lados: { base: lado('4 m', 'o'), estaca: lado('6 m', 'i'), cuerda: lado('≈ 7,21 m', 'f') }, angulos: { transportador: { texto: '56°' } } },
  { objeto: 'techo', marco: [3, 3], medidas: { viga: 3, poste: 3 }, lados: { viga: lado('viga'), poste: lado('poste', 'o'), calamina: lado('calamina', 'i') }, angulos: { alero: { texto: 'θ' }, cumbre: { texto: 'α' } } },
  { objeto: 'techo', marco: [3, 3], medidas: { viga: 3, poste: 3 * Math.tan(25 * Math.PI / 180) }, lados: { viga: lado('viga'), poste: lado('poste', 'o'), calamina: lado('calamina', 'i') }, angulos: { alero: { texto: 'θ' }, cumbre: { texto: 'α' } } },
  { objeto: 'figura', forma: 'diagonal', medidas: { ra: 8, rb: 6 }, lados: { AB: lado('8 cm', 'o'), BC: lado('6 cm', 'i'), AC: lado('?') }, angulos: { A: { texto: 'θ' } } },
  { objeto: 'figura', forma: 'medio', medidas: { ra: 4, rb: 2 }, lados: { DA: lado('4', 'i'), AB: lado('4') }, angulos: { A: { texto: 'θ' } } },
];
const casos = () => Object.entries(MUESTRAS).map(([o, d]) => Object.assign({ objeto: o }, d)).concat(VARIANTES).map(d => [d, {}]);

// Caja de cada elemento del SVG, con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
// y − tam·0,8 a y + tam·0,25, porque y es la línea base). Solo comandos absolutos M L A Z (los que usa la pieza).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = /^text$/.test(tag) ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw, el: m[0] });
    else if (tag === 'rect') out.push({ tag, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw, el: m[0] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw, el: m[0] }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-z]/.test(d), `trazo relativo en ${m[0].slice(0, 60)}`);
      const xs = [], ys = [];
      for (const seg of d.matchAll(/([MLA])([^MLAZ]*)/g)) {
        const v = seg[2].trim().split(/[\s,]+/).map(Number), ps = seg[1] === 'A' ? [v[5], v[6]] : v;
        for (let i = 0; i + 1 < ps.length; i += 2) { xs.push(ps[i]); ys.push(ps[i + 1]); }
      }
      if (xs.length) out.push({ tag, x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw, el: m[0] });
    } else if (tag === 'text') {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, el: m[0], txt: t });
    }
  }
  return out;
}
// ¿El segmento p–q cruza la caja c (agrandada en e)? Recorte de Liang-Barsky.
function cruza(p, q, c, e = 1) {
  const x0 = c.x0 - e, x1 = c.x1 + e, y0 = c.y0 - e, y1 = c.y1 + e;
  let t0 = 0, t1 = 1;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  for (const [pp, qq] of [[-dx, p[0] - x0], [dx, x1 - p[0]], [-dy, p[1] - y0], [dy, y1 - p[1]]]) {
    if (pp === 0) { if (qq < 0) return false; continue; }
    const r = qq / pp;
    if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return true;
}

function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), { W, H, M, SUELO } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  for (const c of cs) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`);
  const txt = cs.filter(c => c.tag === 'text');
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
    const a = txt[i], b = txt[j];
    if (a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1) mal.push(`${nombre}: se pisan «${a.txt}» y «${b.txt}»`);
  }
  // Los lados del triángulo, los extras (el primo, la otra escuadra, los demás lados de una figura), lo que la pieza dice
  // que hay que evitar (el hueco de las escuadras) y el suelo.
  const g = P.geometria(d), lados = [[g.r, g.a], [g.r, g.b], [g.a, g.b]].concat(Object.values(g.extras || {}), g.evitar || []);
  if (['escalera', 'rampa', 'poste', 'sombras'].includes(d.objeto)) lados.push([[8, SUELO], [W - M, SUELO]]);
  if (g.suelo) lados.push([[8, g.suelo], [W - M, g.suelo]]);
  for (const t of txt) for (const [p, q] of lados) if (cruza(p, q, t)) mal.push(`${nombre}: «${t.txt}» cruza un lado o el suelo`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['trig-objeto'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  const altos = new Set();
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    assert.match(s, /data-objeto="[a-z-]+" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 20 && !/undefined/.test(P.alt(d)), d.objeto);
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 256"']);
  assert.ok(!/NaN/.test(P.dibujar({ objeto: 'nada' })));
});

test('la escalera es fiel: lados a escala y el ángulo θ del dibujo es el de sus medidas', () => {
  const g = P.geometria({ objeto: 'escalera', medidas: { piso: 3, pared: 4 } });
  const L = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  assert.ok(Math.abs(L(g.r, g.a) / L(g.r, g.b) - 3 / 4) < 1e-9);
  assert.ok(Math.abs(L(g.a, g.b) / L(g.r, g.a) - 5 / 3) < 1e-9);
  // Con marco, la escala no cambia al correr el pie (la manija del juego sigue al dedo).
  const s1 = P.geometria({ objeto: 'escalera', medidas: { piso: 1, pared: 4.9 }, marco: [4.5, 5] }).s;
  const s2 = P.geometria({ objeto: 'escalera', medidas: { piso: 4.5, pared: 2.18 }, marco: [4.5, 5] }).s;
  assert.equal(s1, s2);
});

test('los rótulos con pasos: se ve el último texto cuyo paso ya llegó', () => {
  const d = { objeto: 'escalera', medidas: { piso: 3, pared: 4 }, lados: { piso: { color: 'f', texto: [{ t: '3 m' }, { t: 'CA = 3 m', paso: 2 }] } } };
  assert.ok(P.dibujar(d, { paso: 1 }).includes('>3 m<'));
  assert.ok(P.dibujar(d, { paso: 2 }).includes('>CA = 3 m<'));
  assert.ok(P.dibujar(d, { final: true }).includes('>CA = 3 m<'));
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro, a un lado ni al suelo', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, d.objeto, mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría que usan la pieza: caben y sus rótulos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/trigonometria/razones-trigonometricas-agudas.js'));
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && pieza === 'trig-objeto') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza;
    if (idea.juega) {
      const j = idea.juega, base = Teoria.inicio(j);
      for (const v of Teoria.grilla(j.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, j.dibujo(Object.assign({}, base, v)), j.pieza || pz);
    }
    for (const t of (idea.lee && idea.lee.tarjetas) || []) toma(`${idea.id} lee`, t.dibujo, t.pieza || pz);
    if (idea.predice) { toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz); toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz); }
    if (idea.mira) idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, ps.estado || {}) }, idea.mira.pieza || pz));
    for (const [k, ej] of (idea.ejemplos || []).entries()) if (ej.figura) toma(`${idea.id} ejemplo ${k + 1}`, ej.figura, ej.figura.pieza);
    for (let s = 0; s < 40; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); }
      if (idea.ahoraTu) { const c = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, c.dibujo, idea.ahoraTu.pieza || pz); }
    }
  }
  assert.ok(figs.length > 40, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal, []);
});
