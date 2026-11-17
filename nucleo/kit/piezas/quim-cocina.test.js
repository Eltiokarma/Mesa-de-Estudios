// Pruebas de la pieza «quim-cocina»: dibujo puro y sano, de variables (colores por papel, nunca la paleta de elementos),
// con todo dentro del lienzo con 4 de margen y los rótulos sin pisarse entre sí (comprobado con números, como en
// quim-vasos.test.js), el alto fijo aunque algo aparezca en un paso posterior y un texto alternativo que dice lo que hay.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const C = require('./quim-cocina.js');

const MUESTRAS = {
  balanzaProbeta: { objetos: [
    { tipo: 'balanza', titulo: 'Lingote chico', carga: 'lingote', pantalla: '96,5 g', color: 'o', rotulos: [{ texto: 'm = 96,5 g', color: 'o' }] },
    { tipo: 'probeta', titulo: 'En la probeta', antes: 50, despues: 55, carga: 'lingote', rotulos: [{ texto: 'V = 5 cm³', color: 'i' }] }] },
  tresCargas: { objetos: ['medalla', 'corona', 'lingote-grande'].map(c => ({ tipo: 'balanza', titulo: c.replace('-', ' '), carga: c, pantalla: '170 g', color: 'o' })) },
  otrasCargas: { objetos: [{ tipo: 'probeta', titulo: 'Piedra', antes: 50, despues: 90, carga: 'piedra', rotulos: [{ texto: 'V = ?' }] },
    { tipo: 'balanza', titulo: 'Cubo', carga: 'cubo', pantalla: '2,7 kg' }, { tipo: 'balanza', titulo: 'Anillo', carga: 'anillo', pantalla: '4,2 g' }] },
  ollas: { objetos: [
    { tipo: 'olla', titulo: '1 L de agua', tam: 0.75, nivel: 0.55, fuego: true, hierve: true, vapor: 1, termometro: '87 °C', colorT: 'f', rotulos: [{ texto: 'm = 1000 g', color: 'o', desde: 2 }] },
    { tipo: 'olla', titulo: '3 L de agua', tam: 1.1, nivel: 0.75, fuego: true, hierve: true, vapor: 1, termometro: '?', rotulos: [{ texto: 'm = 3000 g', color: 'o', desde: 2 }] }] },
  ollaCurva: { objetos: [
    { tipo: 'olla', titulo: '1 L de agua en Juliaca', fuego: true, termometro: '50 °C', colorT: 'f', rotulos: [{ texto: 'Q = 40 kcal', color: 'o' }] },
    { tipo: 'curva', fila: 1, puntos: [[0, 10], [77, 87], [617, 87]], hasta: 200, xmax: 650, ymin: 0, ymax: 100, xMarcas: [0, 200, 400], yMarcas: [10, 87], x: 'Q (kcal)', y: 'T (°C)', punto: '87 °C' }] },
  vasos: { objetos: [{ tipo: 'vaso', titulo: 'Agua con hielo', cubitos: 3, termometro: '?' }, { tipo: 'vaso', titulo: 'Aceite y arena', capa: { alto: 0.2 }, fondo: 'arena' },
    { tipo: 'vaso', titulo: 'Hierro y azufre', nivel: 0, polvo: true }] },
  balones: { objetos: [{ tipo: 'balanza', titulo: 'Lo que desaparece', carga: 'granito', pantalla: '5,2 mg', color: 'o' },
    { tipo: 'balon', titulo: 'Un balón de gas', rotulos: [{ texto: 'unos 4,6 × 10⁸ J', color: 'd' }] },
    { tipo: 'balones', fila: 1, valor: 1017, meta: 1000, rotulos: [{ texto: '≈ 1017 balones', color: 'f' }] }] },
  balanza2: { objetos: [{ tipo: 'balanza2', titulo: 'En el Sol', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'izq',
    rotulos: [{ texto: '4,0312 u contra 4,0026 u', color: 'o', desde: 1 }] }] },
  duda: { objetos: [{ tipo: 'balanza2', izq: { nucleos: ['H', 'H', 'H', 'H'] }, der: { nucleos: ['He'] }, inclina: 'duda' }] },
  // 17 nov (lector en frío): la moneda echada, la pizca sin círculo y la probeta con «antes» y «después», también cuando
  // el agua sube muy poco (los dos rótulos casi en la misma raya) o llega arriba (junto a «100 mL»).
  marcas: { objetos: [
    { tipo: 'balanza', titulo: 'Moneda', carga: 'moneda', pantalla: '31,5 g', color: 'o' },
    { tipo: 'probeta', titulo: 'En la probeta', antes: 50, despues: 51.25, carga: 'moneda', marcas: true, rotulos: [{ texto: 'V = ?' }] }] },
  marcasArriba: { objetos: [
    { tipo: 'balanza', titulo: 'Polvo', carga: 'pizca', pantalla: '1 g', color: 'o' },
    { tipo: 'probeta', titulo: 'Corona', antes: 50, despues: 90, carga: 'corona', marcas: true }] },
};

function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|ellipse|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, g = (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push({ tag, b: [Math.min(num(a, 'x1'), num(a, 'x2')) - g, Math.min(num(a, 'y1'), num(a, 'y2')) - g, Math.max(num(a, 'x1'), num(a, 'x2')) + g, Math.max(num(a, 'y1'), num(a, 'y2')) + g] });
    else if (tag === 'rect') out.push({ tag, b: [num(a, 'x') - g, num(a, 'y') - g, num(a, 'x') + num(a, 'width') + g, num(a, 'y') + num(a, 'height') + g] });
    else if (tag === 'circle') { const r = num(a, 'r'); out.push({ tag, b: [num(a, 'cx') - r - g, num(a, 'cy') - r - g, num(a, 'cx') + r + g, num(a, 'cy') + r + g] }); }
    else if (tag === 'ellipse') { const rx = num(a, 'rx'), ry = num(a, 'ry'); out.push({ tag, b: [num(a, 'cx') - rx - g, num(a, 'cy') - ry - g, num(a, 'cx') + rx + g, num(a, 'cy') + ry + g] }); }
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

test('se registra en el kit', () => assert.equal(Kit.piezas['quim-cocina'], C));

test('sano y puro: sin NaN ni colores fijos, ids ni scripts; texto de 14 o más; colores de variable, nunca de elemento', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) for (const corte of [0, 1, 2]) {
    const s = C.dibujar(d, { corte });
    assert.ok(!/NaN|undefined|null|Infinity/.test(s), k);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), `${k}: sin colores fijos`);
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s), k);
    assert.ok(!/var\(--el-/.test(s), `${k}: un dibujo de variables no usa la paleta de elementos`);
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `${k}: texto de ${t}`);
    assert.equal(s, C.dibujar(d, { corte }), `${k}: pura`);
    assert.ok(/data-prueba="si"/.test(s), `${k}: objeto de prueba`);
    assert.ok(C.alt(d).length > 20);
  }
});

test('alto fijo: un rótulo que aparece en un paso posterior ya tiene su lugar', () => {
  for (const d of [MUESTRAS.ollas, MUESTRAS.balanza2]) assert.equal(altoDe(C.dibujar(d, { corte: 0 })), altoDe(C.dibujar(d, { corte: 9 })));
});

test('encuadre: todo cabe en el lienzo con 4 de margen', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const s = C.dibujar(d, { corte: 9 }), H = altoDe(s);
    for (const c of cajas(s)) {
      const [x0, y0, x1, y1] = c.b;
      assert.ok(x0 >= 4 - 0.01 && y0 >= 4 - 0.01 && x1 <= 316.01 && y1 <= H - 4 + 0.01, `${k}: ${c.tag} ${c.txt || ''} fuera: ${c.b.map(Math.round)}`);
    }
  }
});

test('los rótulos no se pisan entre sí', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const ts = cajas(C.dibujar(d, { corte: 9 })).filter(c => c.tag === 'text');
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) assert.ok(!pisan(ts[i].b, ts[j].b), `${k}: «${ts[i].txt}» pisa «${ts[j].txt}»`);
  }
});

test('lo que dice el dibujo: la balanza muestra la masa, la balanza de dos platillos baja el lado más pesado', () => {
  assert.match(C.dibujar(MUESTRAS.balanzaProbeta), />96,5 g</);
  const geo = svg => { const m = [...svg.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="currentColor" stroke-width="3"/g)]; return m.map(x => x.slice(1).map(Number)); };
  const viga = d => geo(C.dibujar(d)).find(([x1, , x2]) => x2 - x1 > 100);
  const [, ya, , yb] = viga(MUESTRAS.balanza2);
  assert.ok(ya > yb, 'baja el platillo de la izquierda');
  const [, za, , zb] = viga(MUESTRAS.duda);
  assert.equal(za, zb, 'quieta mientras se predice');
  assert.match(C.alt(MUESTRAS.duda), /pregunta/);
});

test('la probeta con marcas dice cuál raya es «antes» y cuál «después», y lleva «100 mL» arriba', () => {
  for (const k of ['marcas', 'marcasArriba']) {
    const svg = C.dibujar(MUESTRAS[k]), ts = cajas(svg).filter(c => c.tag === 'text').map(c => c.txt);
    assert.ok(ts.includes('antes') && ts.includes('después') && ts.includes('100 mL') && !ts.includes('mL'), `${k}: ${ts.join(' | ')}`);
  }
  // Sin marcas, la probeta se ve como antes (otras figuras no cambian).
  const ts = cajas(C.dibujar(MUESTRAS.balanzaProbeta)).filter(c => c.tag === 'text').map(c => c.txt);
  assert.ok(ts.includes('mL') && !ts.includes('antes'));
});
