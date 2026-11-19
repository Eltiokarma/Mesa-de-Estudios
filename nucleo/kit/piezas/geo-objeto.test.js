// Pruebas de la pieza «geo-objeto» (17 nov: también la soga y las escenas con ángulos de las ideas 3 a 6, con los rótulos
// revisados contra los lados, los arcos y las marcas): cada objeto se dibuja sin NaN ni colores fijos, es puro, de alto fijo, marcado como
// dibujo de prueba y con su texto alternativo. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo
// con 4 de margen, ningún rótulo pisa a otro ni cruza una línea (la pista, las cotas, los caminos, la regla), los
// tramos y el desvío van a una sola escala, y el color de cada tramo sale de su papel (todo y pide en tinta; los datos,
// naranja el primero y turquesa el segundo). Se revisan las muestras de abajo y todas las figuras de la teoría que usan
// la pieza (juego en toda su grilla, predicción, «Mira» paso a paso, ejemplos, «Así se resuelve» y «Ahora tú»).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./geo-objeto.js');

const pto = (id, km, alto) => (alto ? { id, km, alto } : { id, km });
const MUESTRAS = [
  { objeto: 'carretera', vista: [-3, 13], hitos: 1, combi: 2, puntos: [pto('A', 0), pto('B', 4), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '4 km' }, { de: 'B', a: 'C', texto: '6 km', nivel: 2 }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }] },
  { objeto: 'carretera', vista: [-3, 13], hitos: 1, combi: 2, puntos: [pto('A', 0), pto('B', 0), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '0 km' }, { de: 'B', a: 'C', texto: '10 km', nivel: 2 }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }] },
  { objeto: 'carretera', vista: [-1, 11], puntos: [pto('A', 0), pto('B', 4, 3), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B', texto: '5 km' }, { de: 'B', a: 'C', texto: '≈ 6,7 km' }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }],
    alturas: [{ punto: 'B', texto: '3 km' }], nota: '5 + 6,7 ≈ 11,7 km' },
  { objeto: 'carretera', vista: [-1, 11], puntos: [pto('A', 0), pto('B', 4, 3), pto('C', 10)],
    tramos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C', papel: 'todo', texto: '10 km', nivel: -1 }],
    alturas: [{ punto: 'B', texto: '3 km' }], reglas: [{ de: 'A', a: 'B', texto: '5 km' }, { de: 'B', a: 'C', texto: '≈ 6,7 km' }] },
  { objeto: 'recta', puntos: [pto('A', 0), pto('B', 3), pto('C', 14), pto('D', 20)],
    tramos: [{ de: 'B', a: 'C', papel: 'pide', texto: '?' }, { de: 'A', a: 'C', texto: '14 cm', nivel: 2 }, { de: 'B', a: 'D', texto: '17 cm', nivel: 3 }, { de: 'A', a: 'D', papel: 'todo', texto: '20 cm', nivel: -2 }] },
  { objeto: 'soga', vista: [-9, 9], soga: ['A', 'C'], panuelo: 'M', raya: 'B', puntos: [pto('A', -6.5), pto('B', 0), pto('M', -1.5), pto('C', 3.5)],
    tramos: [{ de: 'A', a: 'B', texto: '6,5 m' }, { de: 'B', a: 'C', texto: '3,5 m' }, { de: 'A', a: 'C', papel: 'todo', texto: '10 m', nivel: 2 },
      { de: 'B', a: 'M', papel: 'otro', texto: '1,5 m', nivel: -1 }, { de: 'A', a: 'M', papel: 'igual', nivel: 0, marcas: 1 }, { de: 'M', a: 'C', papel: 'igual', nivel: 0, marcas: 1 }] },
];
// Escenas con ángulos (Segmentos, ideas 3 a 6; Triángulos): los trazos los pone geo-figura; la pieza, el objeto y los rótulos.
const ESCENAS = [
  { objeto: 'reloj', relojes: [{ hora: 3, tam: 'plaza', O: true, arco: { texto: '90°', color: 'h' } }] },
  { objeto: 'reloj', relojes: [{ hora: 8, tam: 'plaza', arco: { texto: '240°', color: 'h' } }] },
  { objeto: 'reloj', relojes: [{ hora: 1, tam: 'plaza', arco: { texto: '30°', color: 'h' } }, { hora: 2, tam: 'pulsera', arco: { texto: '60°', color: 'h' }, alarga: 1 }] },
  { objeto: 'tranquera', alfa: 30, pista: { texto: '30°', color: 'h' }, poste: { texto: '60°', color: 'i' }, otro: { texto: '150°', color: 'i' } },
  { objeto: 'tranquera', alfa: 50, bisectrices: 0, mitades: { texto1: '25°', texto2: '65°', color1: 'h', color2: 'i' }, entre: { texto: '90°' } },
  { objeto: 'rieles', theta: 40, angulos: ['ad', 'ai', 'bi', 'bd'].flatMap(c => ['P', 'Q'].map(k => ({ cruce: k, cuad: c, texto: c === 'ad' || c === 'bi' ? '40°' : '140°', color: c === 'ad' || c === 'bi' ? 'h' : 'i' }))) },
  { objeto: 'rieles', theta: 60, giro: 8, letras: true, angulos: [{ cruce: 'P', cuad: 'ad', texto: '60°', color: 'h' }, { cruce: 'Q', cuad: 'ad', texto: '52°' }] },
  { objeto: 'pasaje', a: 40, b: 30, aux: 0, angulos: { a: { texto: '40°', color: 'h' }, b: { texto: '30°', color: 'h' }, a2: { texto: '40°', color: 'h' }, b2: { texto: '30°', color: 'h' }, x: { texto: 'x' } } },
  { objeto: 'pasaje', a: 35, b: 45, examen: true, angulos: { afP: { texto: '145°', color: 'h' }, b: { texto: '45°', color: 'h' }, x: { texto: 'x' } } },
  // Triángulos (18 nov): la cartulina en el juego, con los cortes y las esquinas en la regla («Mira»), esquinas sueltas
  // (la predicción) y el tijeral.
  { objeto: 'cartulina', b: 60, c: 50, angulos: { A: { texto: '70°', color: 'h' }, B: { texto: '60°', color: 'h' }, C: { texto: '50°', color: 'h' } }, vista: { x: [-0.9, 6.9], y: [-1.75, 5.95] }, alto: 270, radio: 16 },
  { objeto: 'cartulina', b: 60, c: 50, angulos: { A: { texto: '70°', color: 'h' }, B: { texto: '60°', color: 'h' }, C: { texto: '50°', color: 'h' } }, cortes: 1, recorte: 2, restaura: 3, paralela: 3, copias: 4 },
  { objeto: 'cartulina', triangulo: false, piezas: [{ en: [0.3, 0.3], de: 15, a: 115, texto: '100°', marcas: 1 }, { en: [4.2, 0.1], de: 40, a: 135, texto: '95°', marcas: 2 }] },
  { objeto: 'cartulina', triangulo: false, piezas: [{ en: 'regla', de: 80, a: 180, texto: '100°', marcas: 1 }, { en: 'regla', de: 0, a: 95, texto: '95°', marcas: 2 }] },
  { objeto: 'tijeral', b: 35, c: 35, angulos: { A: { texto: '?' }, B: { texto: '35°', color: 'h', marcas: 2 }, C: { texto: '35°', color: 'h', marcas: 2 } } },
  // Triángulos, fase 3 (18 nov): la plaza con el mototaxi y sus exteriores, el compás, el techo a dos aguas (tijeral con
  // lados), la lámpara con sus extremos, el caserío con las tres líneas y la mediatriz, y el parque con I y E.
  { objeto: 'plaza', b: 70, c: 50, radio: 14, angulos: { A: { texto: '60°', color: 'h' }, B: { texto: '70°', color: 'h' }, C: { texto: '50°', color: 'h' } }, exteriores: { C: { texto: '130°', color: 'i' } }, mototaxi: true, vista: { x: [-1, 9], y: [-1.15, 8.95] }, alto: 270 },
  { objeto: 'plaza', b: 60, c: 70, prolonga: 1.6, alto: 270, angulos: { A: { texto: '50°', color: 'h' }, B: { texto: '60°', color: 'h' }, C: { texto: '70°', color: 'h' } }, exteriores: { A: { texto: '130°', color: 'i' }, B: { texto: '120°', color: 'i' }, C: { texto: '110°', color: 'i' } }, letraE: true, letraF: true },
  { objeto: 'plaza', examen: true, b: 65, c: 65, llaves: [{ de: 'A', a: 'B', marcas: 1 }, { de: 'A', a: 'C', marcas: 1 }], angulos: { A: { texto: '?' }, B: { marcas: 2 }, C: null }, exteriores: { C: { texto: '115°', color: 'h' } } },
  { objeto: 'compas', t: 50, raya: { texto: '≈ 10,1 cm' }, angulos: { A: { texto: '50°', color: 'h' }, B: { texto: '65°', color: 'h', radio: 14, holgura: 3 }, C: { texto: '65°', color: 'h', radio: 14, holgura: 3 } } },
  { objeto: 'tijeral', lados: [3, 4, 6], letras: true, colores: { AB: 'o', AC: 'i' }, medidas: { AB: '3 m', AC: '4 m', BC: '6 m' } },
  { objeto: 'lampara', g: 90, ac: false, angulos: { B: {} }, lados: { CB: { texto: '40 cm', en: 0.78 }, BA: { texto: '25 cm' } }, extremos: 1, textoExtremos: ['15 cm', '65 cm'] },
  { objeto: 'caserio', ax: 1.5, ay: 3.6, lineas: { h: { color: 'o', desde: 1 }, m: { color: 'i', desde: 2 }, b: { color: 'h', desde: 3 }, z: { desde: 4 } } },
  { objeto: 'caserio', ax: 3, ay: 3.6, lineas: { h: { color: 'o' }, m: { color: 'i' }, b: { color: 'h' } } },
  { objeto: 'parque', b: 70, c: 50, I: 1, E: 3, mitades: { B: true, C: true, Ce: true }, angulos: { A: { color: 'h' } }, BIC: { texto: '120°', desde: 2 }, ICE: { desde: 3, arcoRecto: true }, BEC: { color: 'h', desde: 4 } },
  { objeto: 'angulos', figura: { vista: { x: [-3, 3], y: [-0.8, 3] }, puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: -90 }, { id: 'A', x: 2.5, y: 0, rotulo: 'A', lado: 0 }, { id: 'B', x: 2.5 * Math.cos(0.5), y: 2.5 * Math.sin(0.5), rotulo: 'B', lado: 28.6 }],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B' }], angulos: [{ en: 'O', de: 'A', a: 'B', texto: '2x + 10°', color: 'h', mide: 28.65 }] } },
  // Congruencia (19 nov, etapa 5): el armazón. El tijeral que se arma en el piso del taller sobre la silueta del modelo
  // (8 m, 5 m y 100° entre las vigas; cierra con unos 10,1 m) y la cometa de varillas y papel.
  { objeto: 'armazon', tipo: 'taller', manija: 'C', silueta: { puntos: [[0, 0], [8, 0], [2.5, 4.33]] }, vigas: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }], pernos: ['A', 'B', 'C'],
    ladosRot: [{ de: 'A', a: 'B', texto: '8 m', color: 'o', ref: 'C', dist: 9 }, { de: 'A', a: 'C', texto: '5 m', color: 'i', ref: 'B', dist: 9 }, { de: 'B', a: 'C', texto: '≈ 10,1 m', ref: 'A', dist: 9 }],
    figura: { vista: { x: [-3.5, 9.2], y: [-1.6, 5.7] }, alto: 262,
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: 230, sinPunto: true }, { id: 'B', x: 8, y: 0, rotulo: 'B', lado: -20, sinPunto: true }, { id: 'C', x: 5 * Math.cos(100 * Math.PI / 180), y: 5 * Math.sin(100 * Math.PI / 180), rotulo: 'C', lado: 120, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'C', color: 'i', grosor: 'variable' }, { de: 'B', a: 'C' }],
      angulos: [{ en: 'A', de: 'B', a: 'C', texto: '100°', color: 'h', radio: 16, holgura: 11 }] } },
  { objeto: 'armazon', tipo: 'cometa', vigas: [{ de: 'A', a: 'C' }], papel: ['A', 'B', 'C', 'D'], cola: 'C',
    ladosRot: [{ de: 'A', a: 'B', ref: 'D', texto: '30 cm', color: 'o', dist: 6 }, { de: 'C', a: 'D', ref: 'B', texto: '50 cm', color: 'i', dist: 6 }],
    figura: { vista: { x: [-50, 50], y: [-62, 27] }, alto: 262,
      puntos: [{ id: 'A', x: 0, y: 18, rotulo: 'A', lado: 90, sinPunto: true }, { id: 'B', x: -24, y: 0, rotulo: 'B', lado: 180, sinPunto: true }, { id: 'C', x: 0, y: -43.86, rotulo: 'C', lado: 200, sinPunto: true }, { id: 'D', x: 24, y: 0, rotulo: 'D', lado: 0, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'D', color: 'o', grosor: 'variable' }, { de: 'C', a: 'B', color: 'i', grosor: 'variable' }, { de: 'C', a: 'D', color: 'i', grosor: 'variable' }, { de: 'A', a: 'C' }], angulos: [] } },
];
const casos = () => MUESTRAS.map(d => [d, {}]);
const esEscena = d => P.ESCENAS.includes(d.objeto);

// Caja de cada elemento del SVG, con medio grosor de trazo. Los textos, con su ancho estimado (T.ancho) y su alto (de
// y − tam·0,8 a y + tam·0,25, porque y es la línea base). Los trazados, por sus puntos (M, L, Q y Z absolutos).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, sw = tag === 'text' ? 0 : (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, p: [num(a, 'x1'), num(a, 'y1')], q: [num(a, 'x2'), num(a, 'y2')], x0: Math.min(num(a, 'x1'), num(a, 'x2')) - sw, y0: Math.min(num(a, 'y1'), num(a, 'y2')) - sw, x1: Math.max(num(a, 'x1'), num(a, 'x2')) + sw, y1: Math.max(num(a, 'y1'), num(a, 'y2')) + sw, el: m[0] });
    else if (tag === 'rect') out.push({ tag, x0: num(a, 'x') - sw, y0: num(a, 'y') - sw, x1: num(a, 'x') + num(a, 'width') + sw, y1: num(a, 'y') + num(a, 'height') + sw, el: m[0] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, x0: num(a, 'cx') - r - sw, y0: num(a, 'cy') - r - sw, x1: num(a, 'cx') + r + sw, y1: num(a, 'cy') + r + sw, el: m[0] }); }
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      assert.ok(!/[a-z]/.test(d), `trazo relativo en ${m[0].slice(0, 60)}`);
      const pts = trazado(d);
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      if (xs.length) out.push({ tag, pts, cerrado: /Z\s*$/.test(d), relleno: !/fill="none"/.test(a) && /fill=/.test(a), conTrazo: /stroke="(?!none)/.test(a) && !/stroke-opacity="0\.[01]/.test(a),
        x0: Math.min(...xs) - sw, y0: Math.min(...ys) - sw, x1: Math.max(...xs) + sw, y1: Math.max(...ys) + sw, el: m[0] });
    } else if (tag === 'text') {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, t = txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const w = T.ancho(t, tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push({ tag, x0, y0: y - tam * 0.8, x1: x0 + w, y1: y + tam * 0.25, el: m[0], txt: t });
    }
  }
  return out;
}
// Los puntos de un trazado absoluto (M, L, Q y A; los arcos, muestreados cada pocos grados).
function trazado(d) {
  const out = [], toks = d.match(/[MLQAZ]|-?[\d.]+(?:e-?\d+)?/g) || [];
  let i = 0, cmd = '', cur = null, ini = null;
  const num = () => +toks[i++];
  while (i < toks.length) {
    if (/[MLQAZ]/.test(toks[i])) cmd = toks[i++];
    if (cmd === 'Z') { if (ini) out.push(ini); continue; }
    if (cmd === 'M' || cmd === 'L') { cur = [num(), num()]; if (cmd === 'M') ini = cur; out.push(cur); if (cmd === 'M') cmd = 'L'; }
    else if (cmd === 'Q') { num(); num(); cur = [num(), num()]; out.push(cur); }
    else if (cmd === 'A') {
      const r = num(); num(); num(); const grande = num(), giro = num(), q = [num(), num()];
      const dx = (cur[0] - q[0]) / 2, dy = (cur[1] - q[1]) / 2, d2 = dx * dx + dy * dy, rr = Math.max(r, Math.sqrt(d2));
      const k = Math.sqrt(Math.max(0, (rr * rr - d2) / (d2 || 1))) * (grande === giro ? -1 : 1);
      const cx = k * dy + (cur[0] + q[0]) / 2, cy = -k * dx + (cur[1] + q[1]) / 2;
      const t1 = Math.atan2(cur[1] - cy, cur[0] - cx); let dt = Math.atan2(q[1] - cy, q[0] - cx) - t1;
      if (giro && dt < 0) dt += 2 * Math.PI; if (!giro && dt > 0) dt -= 2 * Math.PI;
      const nn = Math.max(4, Math.ceil(Math.abs(dt) / 0.12));
      for (let j = 1; j <= nn; j++) out.push([cx + rr * Math.cos(t1 + dt * j / nn), cy + rr * Math.sin(t1 + dt * j / nn)]);
      cur = q;
    } else i++;
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
const choca = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

// Escenas con ángulos: todo cabe con 4 de margen; ningún rótulo pisa a otro, ni un trazo (lados, rectas, arcos,
// marcas, durmientes), ni un punto; ni queda dentro de una figura cerrada con borde (la barra de la tranquera). Las
// franjas sin borde (la calle, las avenidas) sí pueden quedar debajo de un rótulo; el borde del reloj, también, porque
// los rótulos van adentro o afuera de la esfera y su borde es un trazo que se revisa.
function revisarEscena(d, e, nombre, mal) {
  const s = P.dibujar(d, e), { W, M } = P.constantes;
  const vb = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/), y0v = +vb[1], H = +vb[3];
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  // Las rectas de geo-figura llegan hasta 4 px del borde (con su medio trazo, 3): se acepta 2,5.
  for (const c of cs) { const mm = c.tag === 'path' ? 2.5 : M; if (!(c.x0 >= mm - 1e-9 && c.y0 >= y0v + mm - 1e-9 && c.x1 <= W - mm + 1e-9 && c.y1 <= y0v + H - mm + 1e-9) && !(c.tag === 'path' && !c.conTrazo))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`); }
  const txt = cs.filter(c => c.tag === 'text');
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) if (choca(txt[i], txt[j])) mal.push(`${nombre}: se pisan «${txt[i].txt}» y «${txt[j].txt}»`);
  for (const t of txt) {
    for (const l of cs.filter(c => c.tag === 'line')) if (cruza(l.p, l.q, t, 0.5)) mal.push(`${nombre}: «${t.txt}» cruza una línea (${l.el.slice(0, 70)})`);
    for (const c of cs.filter(x => x.tag === 'circle' && x.x1 - x.x0 < 16)) if (choca(t, c)) mal.push(`${nombre}: «${t.txt}» pisa un punto`);
    for (const c of cs.filter(x => x.tag === 'path' && x.conTrazo)) {
      const ps = c.pts;
      for (let i = 1; i < ps.length; i++) if (cruza(ps[i - 1], ps[i], t, 0.5)) { mal.push(`${nombre}: «${t.txt}» cruza un trazo (${c.el.slice(0, 70)})`); break; }
    }
  }
}

function revisar(d, e, nombre, mal) {
  if (esEscena(d)) { revisarEscena(d, e, nombre, mal); return; }
  const s = P.dibujar(d, e), { W, M, TOP, BOT } = P.constantes;
  const vb = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/), y0v = +vb[1], H = +vb[3];
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  const cs = cajas(s);
  for (const c of cs) if (!(c.x0 >= M - 1e-9 && c.y0 >= y0v + M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= y0v + H - M + 1e-9))
    mal.push(`${nombre}: se sale (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) en ${c.el.slice(0, 80)}`);
  const txt = cs.filter(c => c.tag === 'text');
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) if (choca(txt[i], txt[j])) mal.push(`${nombre}: se pisan «${txt[i].txt}» y «${txt[j].txt}»`);
  // Ningún rótulo dentro de la pista ni encima de una línea (cotas y sus topes, caminos, alturas, reglas, bordes).
  for (const t of txt) {
    if (d.objeto !== 'recta' && t.y1 > TOP && t.y0 < BOT) mal.push(`${nombre}: «${t.txt}» cae dentro de la pista o del patio`);
    for (const l of cs.filter(c => c.tag === 'line')) if (cruza(l.p, l.q, t, 0.5)) mal.push(`${nombre}: «${t.txt}» cruza una línea (${l.el.slice(0, 70)})`);
    for (const c of cs.filter(x => x.tag === 'circle')) if (choca(t, c)) mal.push(`${nombre}: «${t.txt}» pisa un punto`);
    // La combi y la regla son figuras cerradas: el rótulo no cruza su borde ni queda adentro.
    for (const c of cs.filter(x => x.tag === 'path' && x.cerrado)) {
      const ps = c.pts, centro = [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2];
      let dentro = false;
      for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
        if (cruza(ps[j], ps[i], t, 0.5)) { mal.push(`${nombre}: «${t.txt}» cruza la combi o la regla`); break; }
        if ((ps[i][1] > centro[1]) !== (ps[j][1] > centro[1]) && centro[0] < (ps[j][0] - ps[i][0]) * (centro[1] - ps[i][1]) / (ps[j][1] - ps[i][1]) + ps[i][0]) dentro = !dentro;
      }
      if (dentro) mal.push(`${nombre}: «${t.txt}» queda dentro de la combi o la regla`);
    }
  }
}

test('registrada en el kit', () => assert.equal(Kit.piezas['geo-objeto'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, marcado de prueba, con su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), [...new Set([...MUESTRAS, ...ESCENAS].map(d => d.objeto))].sort());
  for (const d of ESCENAS) {
    const s = P.dibujar(d, { corte: 9 });
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, { corte: 9 }), `${d.objeto}: puro`);
    if (d.objeto !== 'angulos' && !d.examen) assert.match(s, new RegExp(`data-objeto="${d.objeto}" data-prueba="si"`));
    const vb = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    assert.equal(+vb[1], 320);
    assert.ok(+vb[2] <= 270, vb[0]);
    assert.equal(s.match(/viewBox="[^"]+"/)[0], P.dibujar(d, { corte: 0 }).match(/viewBox="[^"]+"/)[0], `${d.objeto}: el alto no cambia con el corte`);
    assert.ok(P.alt(d).length > 20 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
  for (const [d, e] of casos()) {
    const s = P.dibujar(d, e);
    assert.ok(!/NaN|undefined|Infinity/.test(s), d.objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${d.objeto}: sin colores fijos`);
    assert.ok(!/\sid="|filter|<image/.test(s), `${d.objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(d, e), `${d.objeto}: puro`);
    if (d.objeto === 'carretera' || d.objeto === 'soga') assert.match(s, new RegExp(`data-objeto="${d.objeto}" data-prueba="si"`));
    if (d.combi !== undefined) assert.match(s, /data-objeto="combi" data-prueba="si"/);
    if (d.reglas) assert.match(s, /data-objeto="regla" data-prueba="si"/);
    const vb = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/);
    assert.equal(+vb[2], 320);
    assert.ok(+vb[1] >= 0 && +vb[1] + +vb[3] <= 240 + 1e-9, vb[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), d.objeto);
  }
  // El alto sale de la forma de los datos, no del estado: el juego no cambia de alto al correr B.
  const alto = bx => P.dibujar(Object.assign({}, MUESTRAS[0], { puntos: [pto('A', 0), pto('B', bx), pto('C', 10)] })).match(/viewBox="[^"]+"/)[0];
  assert.equal(alto(-2), alto(12));
  const mira = Object.assign({}, MUESTRAS[3], { reglas: MUESTRAS[3].reglas.map(r => Object.assign({ paso: 1 }, r)) });
  assert.equal(P.dibujar(mira, { paso: 0 }).match(/viewBox="[^"]+"/)[0], P.dibujar(mira, { final: true }).match(/viewBox="[^"]+"/)[0]);
  assert.ok(!/NaN/.test(P.dibujar({})));
});

test('fiel: una sola escala para lo largo de la carretera y para el desvío', () => {
  const g = P.geometria(MUESTRAS[2]);
  const L = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  assert.ok(Math.abs(L(g.P.A, g.P.B) / g.s - 5) < 1e-9, 'AB mide 5 km a escala');
  assert.ok(Math.abs(L(g.P.B, g.P.C) / g.s - Math.hypot(6, 3)) < 1e-9, 'BC mide √45 km a escala');
  assert.ok(Math.abs((g.BOT - g.P.B[1]) / g.s - 3) < 1e-9, 'B está a 3 km de la carretera');
  // Con vista fija, la escala no cambia al correr B (la manija del juego sigue al dedo), y km() invierte a X().
  const v = bx => P.geometria({ objeto: 'carretera', vista: [-3, 13], puntos: [pto('A', 0), pto('B', bx), pto('C', 10)] });
  assert.equal(v(-2).s, v(12).s);
  for (const bx of [-2, 0, 4.5, 12]) assert.ok(Math.abs(v(bx).km(v(bx).P.B[0]) - bx) < 1e-9);
});

test('colores por papel: todo y pide en tinta; los datos, naranja el primero y turquesa el segundo; nunca violeta', () => {
  assert.deepEqual(P.colores(MUESTRAS[0]), { AB: 'o', BC: 'i', AC: null });
  // B antes de A: AB empieza antes que BC, sigue naranja.
  assert.deepEqual(P.colores({ puntos: [pto('A', 0), pto('B', -2), pto('C', 10)], tramos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }] }), { AB: 'o', BC: 'i' });
  // Un solo dato: naranja, aunque sea el tramo de la derecha.
  assert.deepEqual(P.colores({ puntos: [pto('A', 0), pto('B', 1.5), pto('C', 2.4)], tramos: [{ de: 'A', a: 'B', papel: 'pide', texto: '?' }, { de: 'B', a: 'C' }] }), { AB: null, BC: 'o' });
  assert.equal(P.colorDe(MUESTRAS[0], 'BA'), 'o', 'el nombre al revés es el mismo tramo');
  const s = P.dibujar(MUESTRAS[4]);
  assert.ok(!/var\(--c-f\)/.test(s), 'sin violeta');
  assert.ok(/fill="currentColor"[^>]*>\?</.test(s), 'lo que se pide, en tinta');
});

test('los pasos: un tramo o una regla aparecen en su paso; un texto con pasos muestra el último que llegó', () => {
  const d = Object.assign({}, MUESTRAS[3], { reglas: [{ de: 'A', a: 'B', texto: '5 km', paso: 1 }], tramos: [{ de: 'A', a: 'B', texto: [{ t: null }, { t: '5 km', paso: 2 }] }] });
  assert.ok(!P.dibujar(d, { paso: 0 }).includes('data-objeto="regla"'));
  assert.ok(P.dibujar(d, { paso: 1 }).includes('data-objeto="regla"'));
  assert.equal((P.dibujar(d, { paso: 1 }).match(/>5 km</g) || []).length, 1, 'en el paso 1, solo la lectura de la regla');
  assert.equal((P.dibujar(d, { final: true }).match(/>5 km</g) || []).length, 2);
});

test('muestras: todo cabe con 4 de margen y ningún rótulo pisa a otro ni cruza una línea', () => {
  const mal = [];
  for (const [d, e] of casos()) revisar(d, e, `${d.objeto} ${JSON.stringify(d.puntos.map(p => p.km))}`, mal);
  for (const d of ESCENAS) for (const corte of [0, 9]) revisar(d, { corte }, `${d.objeto} corte ${corte}`, mal);
  assert.deepEqual(mal, []);
});

test('escenas: escena() da la figura de geo-figura que se dibuja; cada ángulo mide lo que dice su rótulo', () => {
  const G = require('./geo-figura.js');
  for (const d of ESCENAS) {
    const fig = P.escena(d).fig, g = G.geometria(fig);
    for (const an of fig.angulos || []) {
      const V = g.P(an.en), A = g.P(an.de), B = g.P(an.a);
      let m = G.util.angulo(V, A, B); if (an.mayor) m = 360 - m;
      const num = /^(\d+(?:,\d+)?)°$/.exec(String(an.texto || ''));
      const esp = num ? +num[1].replace(',', '.') : an.mide;
      if (esp !== undefined && !an.sector) assert.ok(Math.abs(m - esp) < 0.5, `${d.objeto}: ${an.texto} mide ${m.toFixed(2)}° en el dibujo`);
    }
  }
  // El rótulo de un ángulo chico se aleja hasta no tocar sus lados; su arco crece con él.
  const chico = { objeto: 'angulos', figura: { vista: { x: [-0.5, 3], y: [-0.5, 1.5] }, puntos: [{ id: 'O', x: 0, y: 0 }, { id: 'A', x: 3, y: 0 }, { id: 'B', x: 3 * Math.cos(0.35), y: 3 * Math.sin(0.35) }],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B' }], angulos: [{ en: 'O', de: 'A', a: 'B', texto: '20°', color: 'h', radio: 20 }] } };
  const mal = []; revisar(chico, {}, 'ángulo de 20°', mal);
  assert.deepEqual(mal, []);
  assert.ok(+P.dibujar(chico).match(/A(\d+) /)[1] > 40, 'el arco del ángulo chico crece hasta su rótulo');
});

test('todas las figuras de la teoría que usan la pieza: caben y sus rótulos no se pisan', () => {
  const Teoria = require('../../teoria.js');
  const mal = [], figs = [];
  const toma = (nombre, dib, pieza) => { if (dib && pieza === 'geo-objeto') figs.push([nombre, dib.datos, dib.estado || {}]); };
  // Segmentos y ángulos, y Triángulos (18 nov: la idea 1, con la cartulina, el tijeral y las figuras de examen); Congruencia
  // (19 nov: las ideas 1 y 2, con el armazón y las figuras de examen; las ideas 3 a 6 siguen con geo-figura).
  const ideas = ['segmentos-y-angulos', 'triangulos', 'congruencia'].flatMap(u => require(path.join(__dirname, `../../../contenido/teoria/geometria/${u}.js`)).ideas);
  for (const idea of ideas) {
    const pz = idea.pieza;
    if (idea.juega) {
      const j = idea.juega, base = Teoria.inicio(j);
      for (const v of Teoria.grilla(j.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, j.dibujo(Object.assign({}, base, v)), j.pieza || pz);
    }
    for (const t of (idea.lee && idea.lee.tarjetas) || []) toma(`${idea.id} lee`, t.dibujo, t.pieza || pz);
    if (idea.predice) { toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz); toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz); }
    if (idea.mira) idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, ps.estado || {}) }, idea.mira.pieza || pz));
    for (const [k, ej] of (idea.ejemplos || []).entries()) if (ej.figura) toma(`${idea.id} ejemplo ${k + 1}`, ej.figura, ej.figura.pieza);
    for (let s = 0; s < 120; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); c.pasos.forEach((x, k) => toma(`${idea.id} resuelve ${s} paso ${k + 1}`, x.dibujo, idea.resuelve.pieza || pz)); }
      if (idea.ahoraTu) { const c = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, c.dibujo, idea.ahoraTu.pieza || pz); toma(`${idea.id} ahora tú ${s} solución`, c.solucion && c.solucion.dibujo, idea.ahoraTu.pieza || pz); }
    }
  }
  assert.ok(figs.length > 100, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) {
    if (esEscena(d)) { for (const corte of [0, 1, 2, 3, 4, 9]) revisar(d, { corte }, `${nombre} corte ${corte}`, mal); }
    else revisar(d, e, nombre, mal);
  }
  assert.deepEqual([...new Set(mal)].slice(0, 30), []);
});

// Auditoría de la teoría (17 nov): las rayitas no tachan un punto (M6), el rótulo de un ángulo entero va sobre su
// bisectriz y la punteada se corta debajo (M4), y dos consecutivos del mismo color no comparten radio (M5).
test('rayitas en su arco; rótulo «centro» junto a la bisectriz, sin tocarla; consecutivos con radios distintos', () => {
  // Ejemplo 8 de la idea 2 tal como estaba: M en el 9, B en el 13 y C en el 18 (en el medio de MC, la rayita tachaba B).
  const d = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 9), pto('B', 13), pto('C', 18)],
    tramos: [{ de: 'A', a: 'M', papel: 'igual', nivel: 0, marcas: 1 }, { de: 'M', a: 'C', papel: 'igual', nivel: 0, marcas: 1 }] };
  for (const z of P.marcas(d)) assert.ok(z.holgura >= P.HOLGURA_MARCA, `${z.tramo.de}${z.tramo.a}: ${z.holgura}`);
  // Ronda 2 del lector (18 nov): corrida de lado, la rayita de MC caía entre B y C y se leía «AM = BC». Ahora cada marca va
  // sobre el arco de su tramo, que une sus dos puntas por encima de la línea.
  const g = P.geometria(d);
  for (const z of P.marcas(d)) {
    const [a, b] = [g.P[z.tramo.de][0], g.P[z.tramo.a][0]].sort((u, v) => u - v);
    assert.ok(Math.abs(z.arco.a - a) < 1e-9 && Math.abs(z.arco.b - b) < 1e-9, `${z.tramo.de}${z.tramo.a}: el arco no va de punta a punta`);
    assert.ok(z.x > a && z.x < b && z.y <= P.constantes.BOT - P.ALTO_ARCO + 1e-9, `${z.tramo.de}${z.tramo.a}: la rayita no va en la cima de su arco`);
  }
  assert.match(P.dibujar(d), /<path d="M[^"]*Q/, 'sin arco');
  // Un tramo que contiene a otro marcado (AN sobre AM y MB) va más arriba, y su grupo (NC) a la misma altura.
  const d2 = { objeto: 'recta', puntos: [pto('A', 0), pto('M', 4), pto('B', 8), pto('N', 13), pto('C', 26)],
    tramos: [{ de: 'A', a: 'M', papel: 'igual', nivel: 0, marcas: 1 }, { de: 'M', a: 'B', papel: 'igual', nivel: 0, marcas: 1 }, { de: 'A', a: 'N', papel: 'igual', nivel: 0, marcas: 2 }, { de: 'N', a: 'C', papel: 'igual', nivel: 0, marcas: 2 }] };
  const m2 = P.marcas(d2), alto = id => m2.find(z => z.tramo.de + z.tramo.a === id).arco.alto;
  assert.ok(alto('AN') > alto('AM') && alto('NC') === alto('AN') && alto('AM') === alto('MB'), 'alturas de los arcos');
  for (const z of m2) assert.ok(z.holgura >= P.HOLGURA_MARCA, `${z.tramo.de}${z.tramo.a}: ${z.holgura}`);
  // ∠AOB = 76° con su bisectriz OD punteada: el rótulo va sobre OD y OD se corta debajo.
  const pol = (g, r = 2.5) => ({ x: r * Math.cos(g * Math.PI / 180), y: r * Math.sin(g * Math.PI / 180) });
  const fig = { vista: { x: [-0.8, 3.3], y: [-0.8, 3.3] }, puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: 228 }, Object.assign({ id: 'A', rotulo: 'A', lado: 10, sinPunto: true }, pol(10)), Object.assign({ id: 'D', rotulo: 'D', lado: 48, sinPunto: true }, pol(48)), Object.assign({ id: 'B', rotulo: 'B', lado: 86, sinPunto: true }, pol(86))],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'D', discontinua: true }, { de: 'O', a: 'B' }],
    angulos: [{ en: 'O', de: 'A', a: 'B', texto: '76°', color: 'h', mide: 76, radio: 46, centro: true }, { en: 'O', de: 'A', a: 'D', texto: '?', rayita: 1, radio: 26 }, { en: 'O', de: 'D', a: 'B', rayita: 1, radio: 26 }] };
  // Ronda 2 del lector (18 nov): sobre la bisectriz (con la punteada cortada debajo) se seguía leyendo «76°» encima de
  // OD. Ahora va junto a la bisectriz, más afuera que su arco, sin tocar OD ni ningún lado.
  const e = { objeto: 'angulos', figura: fig }, rr = P.rotulos(e), r = rr.rot.find(z => z.an.texto === '76°'), O = rr.vertice('O');
  const t = Math.atan2(-(r.y - O[1]), r.x - O[0]) * 180 / Math.PI;
  assert.ok(t > 10 && t < 86 && Math.abs(t - 48) < 30, `el rótulo de 76° va a ${t.toFixed(1)}°, lejos de la bisectriz (48°)`);
  assert.ok(Math.hypot(r.x - O[0], r.y - O[1]) > r.an.radio, 'el rótulo de 76° queda dentro de su arco');
  const g0 = rr.g, D = g0.S('D');
  const cruzaOD = cruza(O, [O[0] + (D[0] - O[0]) * 9, O[1] + (D[1] - O[1]) * 9], { x0: r.caja.x0, x1: r.caja.x1, y0: r.caja.y0, y1: r.caja.y1 }, 2);
  assert.ok(!cruzaOD, 'el rótulo de 76° toca la bisectriz OD');
  const mal = []; revisar(e, {}, 'bisectriz cortada', mal); assert.deepEqual(mal, []);
  // Dos consecutivos carmín de radio 24: el segundo se aleja.
  const c = { objeto: 'angulos', figura: { vista: { x: [-0.8, 3.3], y: [-0.8, 3.3] }, puntos: [{ id: 'O', x: 0, y: 0 }, Object.assign({ id: 'A', sinPunto: true }, pol(0)), Object.assign({ id: 'B', sinPunto: true }, pol(50)), Object.assign({ id: 'C', sinPunto: true }, pol(120))],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B' }, { de: 'O', a: 'C' }], angulos: [{ en: 'O', de: 'A', a: 'B', texto: '50°', color: 'h', radio: 24 }, { en: 'O', de: 'B', a: 'C', texto: '70°', color: 'h', radio: 24 }] } };
  const [a1, a2] = P.angulosListos(c);
  assert.ok(Math.abs(a1.radio - a2.radio) >= 6, `radios ${a1.radio} y ${a2.radio}`);
});

test('un recto que se pide o que lleva una expresión va con arco, no con el cuadradito (18 nov)', () => {
  // El cuadradito diría la respuesta: ∠BAD = 90° con AC adentro (Isósceles, ej. 13), «9k» de 90° (razón 4 : 9 : 5) o el
  // ángulo A de 90° cuando se pregunta la clase de triángulo (arcoRecto en las escenas). Un recto en grados («90°») o sin
  // rótulo (el que da el enunciado) sí lleva el cuadradito.
  const cuadradito = /<path d="M[\d. -]+L[\d. -]+L[\d. -]+" fill="none" stroke="[^"]+" stroke-width="2" stroke-linejoin="round"\/>/;
  const base = (an, extra = []) => ({ objeto: 'angulos', figura: { vista: { x: [-1, 7], y: [-1, 7] },
    puntos: [{ id: 'A', x: 0, y: 6 }, { id: 'B', x: 0, y: 0 }, { id: 'C', x: 6, y: 0 }, { id: 'D', x: 3, y: 0 }],
    segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, ...extra], angulos: [Object.assign({ en: 'B', de: 'C', a: 'A' }, an)] } });
  assert.ok(!cuadradito.test(P.dibujar(base({ texto: '?' }, [{ de: 'B', a: 'A' }, { de: 'A', a: 'D' }]))), '«?» de 90°');
  assert.ok(!cuadradito.test(P.dibujar(base({ texto: '9k', color: 'h' }))), '«9k» de 90°');
  assert.ok(!cuadradito.test(P.dibujar(base({ arcoRecto: true }))), 'arcoRecto');
  const conRayo = base({ texto: '?' }); conRayo.figura.puntos.push({ id: 'E', x: 3, y: 3 }); conRayo.figura.segmentos.push({ de: 'B', a: 'E' });
  assert.ok(!cuadradito.test(P.dibujar(conRayo)), '«?» de 90° con un rayo adentro');
  assert.ok(cuadradito.test(P.dibujar(base({ texto: '90°', color: 'h' }))), '«90°» lleva el cuadradito');
  assert.ok(cuadradito.test(P.dibujar(base({}))), 'el recto sin rótulo lleva el cuadradito');
  assert.ok(!cuadradito.test(P.dibujar({ objeto: 'parque', b: 45, c: 45, angulos: { A: { arcoRecto: true } } })), 'parque con A recto pedido');
});
