// Pruebas de la pieza «trig-giro»: cada objeto se dibuja sin NaN ni colores fijos, es puro, de alto fijo, marcado como
// dibujo de prueba y con su texto alternativo. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con
// 4 de margen, ningún rótulo pisa a otro, y ninguno cruza un arco, un rayo ni el contorno del objeto. Se revisan las
// muestras de abajo y todas las figuras de la teoría que usan la pieza (el juego en toda su grilla, «Lee», la predicción,
// «Mira» paso a paso, los ejemplos, y «Así se resuelve» y «Ahora tú» en 60 semillas).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./trig-giro.js');

const MUESTRAS = {
  timon: { giros: [{ mide: -270, texto: '−270°' }] },
  llave: { giros: [{ mide: -720, texto: '?', colorTexto: 'tinta' }] },
  tapa: { giros: [{ mide: 270, texto: '?', colorTexto: 'tinta' }] },
  reloj: { horario: 3, giros: [{ mide: -120, texto: '?' }] },
  transportador: { giros: [{ mide: 72, texto: '80ᵍ', colorTexto: 'i' }] },
  rayos: { rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: 140 }, { id: 'Q', ang: 180 }], giros: [{ de: 'M', a: 'N', sentido: 1, texto: 'α', r: 40 }, { de: 'Q', a: 'N', sentido: -1, texto: 'β', r: 62 }] },
};
const VARIANTES = [
  { objeto: 'timon' },
  { objeto: 'timon', giros: [{ mide: 540, texto: '540°' }] },
  { objeto: 'timon', giros: [{ mide: -540, texto: '−540°' }] },
  { objeto: 'timon', giros: [{ mide: 30, texto: '30°' }] },
  { objeto: 'timon', giros: [{ mide: 120 }], rotulos: { inicial: 'lado inicial', final: 'lado final' } },
  { objeto: 'timon', giros: [{ mide: 150, texto: '+150°', r: 116, en: 'medio' }, { mide: -240, texto: '−240°', en: -55 }] },
  { objeto: 'timon', giros: [{ mide: 180, texto: '180°' }] },
  { objeto: 'transportador' },
  { objeto: 'transportador', giros: [{ mide: 135 }] },
  { objeto: 'transportador', giros: [{ mide: -225, texto: '−225°' }] },
  { objeto: 'transportador', giros: [{ mide: 49.5, texto: '55ᵍ', colorTexto: 'i', en: 25 }, { mide: 40.5, de: 49.5, texto: '40,5°', r: 50, en: 70 }], pos: 90 },
  { objeto: 'llave', giros: [{ mide: 1080, texto: '1080°' }] },
  { objeto: 'reloj', horario: 3.17, inicial: 30, giros: [{ mide: -270, texto: '?' }] },
  { objeto: 'rayos', rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: 60 }, { id: 'P', ang: 90 }], rectos: [['M', 'P']], giros: [{ de: 'M', a: 'N', sentido: 1, texto: 'α', r: 44 }, { de: 'P', a: 'N', sentido: -1, texto: 'β', r: 66 }] },
  { objeto: 'rayos', rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: 140 }, { id: 'P', ang: 240 }], giros: [{ de: 'M', a: 'N', sentido: 1, texto: 'α', r: 38 }, { de: 'P', a: 'N', sentido: -1, texto: 'β', r: 50 }, { de: 'P', a: 'M', sentido: 1, texto: 'γ', r: 62 }] },
  { objeto: 'rayos', rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: 225 }], giros: [{ de: 'M', a: 'N', sentido: -1, texto: '?', r: 46 }] },
];
const casos = () => Object.entries(MUESTRAS).map(([o, d]) => Object.assign({ objeto: o }, d)).concat(VARIANTES).map(d => [d, {}]);

// Caja de cada elemento del SVG, con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
// y − tam·0,8 a y + tam·0,25: y es la línea base). Solo comandos absolutos M L Z (los que usa la pieza).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw, el: m[0] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw, el: m[0] }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-zA-KN-Y]/.test(d), `solo M, L y Z absolutos en ${m[0].slice(0, 60)}`);
      const v = d.replace(/[MLZ]/g, ' ').trim().split(/[\s,]+/).map(Number), xs = [], ys = [];
      for (let i = 0; i + 1 < v.length; i += 2) { xs.push(v[i]); ys.push(v[i + 1]); }
      if (xs.length) out.push({ tag, x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw, el: m[0] });
    } else {
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
  const s = P.dibujar(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  for (const c of cs) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`);
  const txt = cs.filter(c => c.tag === 'text');
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
    const a = txt[i], b = txt[j];
    if (a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1) mal.push(`${nombre}: se pisan «${a.txt}» y «${b.txt}»`);
  }
  // Los arcos (con su flecha), los rayos, los lados que se alargan y el contorno del objeto: ningún rótulo los cruza.
  const g = P.geometria(d, e);
  for (const t of txt) for (const [p, q] of g.lineas) if (cruza(p, q, t, 0.5)) { mal.push(`${nombre}: «${t.txt}» cruza una línea`); break; }
}

test('registrada en el kit', () => assert.equal(Kit.piezas['trig-giro'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    if (d.objeto !== 'rayos') assert.match(s, /data-objeto="[a-z]+" data-prueba="si"/);
    assert.match(s, /viewBox="0 0 320 300"/);
    assert.ok(P.alt(d).length > 20 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
  assert.ok(!/NaN/.test(P.dibujar({ objeto: 'nada' })));
});

test('fiel: la marca queda girada lo que dicen los giros, y el arco de más de una vuelta se abre en espiral', () => {
  const { C } = P.constantes, ang = p => Math.atan2(C[1] - p[1], p[0] - C[0]) * 180 / Math.PI;
  for (const g of [-540, -270, -90, 30, 150, 360, 450]) {
    const m = P.geometria({ objeto: 'timon', giros: [{ mide: g }] }).marca;
    assert.ok(Math.abs((((ang(m) - 90 - g) % 360) + 540) % 360 - 180) < 1e-6, `timón girado ${g}°`);
  }
  // Giros seguidos: la marca queda en la suma, con signo.
  assert.equal(P.geometria({ objeto: 'timon', giros: [{ mide: 150 }, { mide: -240 }] }).pos, -90);
  // Un giro «total» resume a los otros: no mueve el objeto por su cuenta.
  assert.equal(P.geometria({ objeto: 'timon', giros: [{ mide: 150 }, { mide: -240 }, { mide: -90, total: true }] }).pos, -90);
  // El reloj: su lado inicial puede ser cualquier minuto (30°: el minutero en el 2).
  const r = P.geometria({ objeto: 'reloj', inicial: 30, giros: [{ mide: -270 }] }).marca;
  assert.ok(Math.abs(ang(r) - 120) < 1e-6, 'de las :10 a las :55, el minutero queda en el 11');
  // Menos de una vuelta: radio fijo. Más de una: crece.
  const a1 = P.geometria({ objeto: 'timon', giros: [{ mide: 300 }] }).arcos[0].A, a2 = P.geometria({ objeto: 'timon', giros: [{ mide: 540 }] }).arcos[0].A;
  assert.equal(a1.rFin, P.constantes.RA);
  assert.ok(a2.rFin > P.constantes.RA + 5);
  // Figura de examen: el giro va del rayo `de` al rayo `a` en el sentido pedido.
  const f = P.geometria({ objeto: 'rayos', rayos: [{ id: 'M', ang: 0 }, { id: 'N', ang: 140 }, { id: 'Q', ang: 180 }], giros: [{ de: 'M', a: 'N', sentido: 1 }, { de: 'Q', a: 'N', sentido: -1 }] });
  assert.deepEqual(f.arcos.map(x => x.mide), [140, -40]);
  // El transportador: su cero está a la derecha, y la aguja en 90° marca también 100ᵍ (las dos escalas, a escala).
  const t = P.geometria({ objeto: 'transportador', giros: [{ mide: 90 }] });
  assert.ok(Math.abs(ang(t.marca) - 90) < 1e-6);
  const st = P.dibujar({ objeto: 'transportador' });
  assert.equal((st.match(/stroke="var\(--c-h\)"/g) || []).length, 36, '36 rayitas sexagesimales, una cada 10°');
  assert.equal((st.match(/stroke="var\(--c-i\)"/g) || []).length, 40, '40 rayitas centesimales, una cada 10ᵍ');
  for (const r of ['0°', '90°', '180°', '270°', '0ᵍ', '100ᵍ', '200ᵍ', '300ᵍ']) assert.ok(st.includes(`>${r}<`), r);
  // El lado inicial punteado cruza el aro: empieza dentro del objeto y pasa del arco.
  const li = P.geometria({ objeto: 'timon', giros: [{ mide: 60 }] }).ladoIni, largo = Math.hypot(li[1][0] - li[0][0], li[1][1] - li[0][1]);
  assert.ok(largo > 40, `el lado inicial mide ${largo.toFixed(0)}`);
});

test('manija: anguloDe invierte la posición de la marca, también pasada la vuelta', () => {
  for (const g of [-540, -450, -270, -30, 0, 60, 330, 360, 510]) {
    const d = { objeto: 'timon', giros: g ? [{ mide: g }] : [] }, m = P.geometria(d).marca;
    assert.ok(Math.abs(P.anguloDe(d, { x: m[0], y: m[1] }, { cerca: g }) - g) < 1e-6, `g = ${g}`);
  }
});

test('pasos: cada giro se ve desde su paso y hasta su paso; el rótulo del que se pide va en tinta', () => {
  const d = { objeto: 'timon', giros: [{ mide: 150, texto: '+150°', r: 116, en: 'medio', desde: 1, hasta: 3 }, { mide: -90, total: true, texto: '−90°', desde: 4 }], pos: [{ v: 0 }, { v: 150, paso: 1 }, { v: -90, paso: 4 }] };
  assert.ok(!P.dibujar(d, { paso: 0 }).includes('var(--c-h)'), 'al inicio no hay arco');
  assert.ok(P.dibujar(d, { paso: 2 }).includes('>+150°<') && !P.dibujar(d, { paso: 2 }).includes('>−90°<'));
  assert.ok(P.dibujar(d, { paso: 4 }).includes('>−90°<') && !P.dibujar(d, { paso: 4 }).includes('>+150°<'));
  const s = P.dibujar({ objeto: 'tapa', giros: [{ mide: 270, texto: '?', colorTexto: 'tinta' }] });
  assert.match(s, /fill="currentColor"[^>]*>\?</, 'el «?» en tinta');
  assert.match(s, /stroke="var\(--c-h\)" stroke-width="3"/, 'el arco, en carmín');
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro ni cruza una línea', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, d.objeto, mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría y del laboratorio que usan la pieza: caben y sus rótulos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/trigonometria/angulo-trigonometrico.js'));
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && (dib.pieza || pieza) === 'trig-giro') figs.push([nombre, dib.datos, dib.estado || {}]); };
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
    for (let s = 0; s < 60; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); for (const [i, p] of c.pasos.entries()) toma(`${idea.id} resuelve ${s} paso ${i + 1}`, p.dibujo, idea.resuelve.pieza || pz); }
      if (idea.ahoraTu) { const c = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, c.dibujo, idea.ahoraTu.pieza || pz); }
    }
  }
  // Las mesas del laboratorio que usan la pieza, en toda su grilla.
  for (const m of U.laboratorio || []) for (const v of Teoria.grilla(m.controles || [])) toma(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  assert.ok(figs.length > 300, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal, []);
});
