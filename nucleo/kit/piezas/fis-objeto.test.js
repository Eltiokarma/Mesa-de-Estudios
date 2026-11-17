// Pruebas de la pieza «fis-objeto»: cada objeto se dibuja sin NaN ni colores fijos, es puro, lleva su dato y su
// texto alternativo; un objeto desconocido da un SVG vacío y no rompe. Los objetos nuevos (16 nov) quedan, con trazo,
// puntas y rótulos, dentro del lienzo con 4 unidades de margen.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./fis-objeto.js');

// objeto → [datos de muestra, texto que debe aparecer escrito en el dibujo]
const MUESTRAS = {
  cancha: [{ largo: '105 m' }, '105 m'], bebe: [{ pantalla: '3,4 kg' }, '3,4 kg'], reloj: [{ minutos: 45, texto: '45 min' }, '45 min'],
  lapiz: [{ cm: 17.5 }, '17,5 cm'], camion: [{ carga: '12 t' }, '12 t'], atleta: [{ distancia: '100 m', tiempo: '10 s' }, '100 m'],
  caracol: [{ texto: '3 mm en cada segundo' }, '3 mm en cada segundo'], corazon: [{ texto: '72 latidos' }, '72 latidos'],
  comparar: [{ titulo: 'En km/h', barras: [{ nombre: 'A', valor: 2, texto: '2 km/h' }, { nombre: 'B', valor: 1, texto: '1 km/h', color: 'i' }] }, '2 km/h'],
  sol: [{ texto: '3 × 10⁸ m/s' }, '3 × 10⁸ m/s'], cabello: [{ texto: '70 μm' }, '70 μm'],
  terreno: [{ largo: '250 m', ancho: '100 m', texto: '2,5 ha' }, '2,5 ha'],
  botella: [{ texto: '0,92 g/cm³', nombre: 'aceite' }, '0,92 g/cm³'],
  tanque: [{ texto: '1,1 m³', altura: 'h' }, '1,1 m³'],
  jeringa: [{ ml: 5, max: 5, texto: '5 mL' }, '5 mL'],
  hoja: [{ ancho: '21 cm', alto: '29,7 cm', texto: '624 cm²' }, '29,7 cm'],
  piso: [{ largo: '8 m', ancho: '6 m', loseta: '40 cm', nx: 20, ny: 15 }, '40 cm'],
  piscina: [{ largo: '12 m', ancho: '6 m', hondo: '1,5 m' }, '1,5 m'],
  bloque: [{ material: 'adobe', largo: '40 cm', ancho: '20 cm', alto: '10 cm', texto: '1,7 g/cm³' }, '1,7 g/cm³'],
  cano: [{ texto: '12 L/min', nombre: 'en 1 minuto' }, '12 L/min'],
  plano: [{ ancho: '8 cm', alto: '6 cm', escala: '1 : 50' }, 'Escala 1 : 50'],
  techo: [{ largo: '10 m', ancho: '8 m', lluvia: '120 mm' }, '120 mm'],
  lago: [{ nombre: 'Lago Titicaca', texto: '893 km³' }, '893 km³'],
  pendulo: [{ largo: 'L', g: 'g', texto: 'T: el período, una ida y vuelta' }, 'T: el período, una ida y vuelta'],
  planetas: [{ m1: 'm₁', m2: 'm₂', d: 'd', fuerza: 'F' }, 'm₂'],
  caja: [{ masa: '40 kg', fuerza: 'F', aceleracion: 'a' }, '40 kg'],
  viento: [{ v: 'v', fuerza: 'F', area: 'A: el frente', aire: 'aire, ρ' }, 'A: el frente'],
  presion: [{ fuerza: 'F', area: 'A', texto: 'la presión' }, 'la presión'],
  deposito: [{ altura: 'h', texto: 'P', superficie: 'P₀', colorAltura: 'h' }, 'P₀'],
};
// Variantes que cambian la geometría: también deben caber.
const VARIANTES = [
  { objeto: 'terreno', cuadrado: true, largo: 'lado: ?', texto: '1 ha' }, { objeto: 'bloque', material: 'hielo', texto: '0,92 g/cm³', nombre: 'hielo' },
  { objeto: 'jeringa', ml: 0, max: 5, texto: '0 mL' }, { objeto: 'tanque', texto: 'masa m' },
];
const NUEVOS = ['terreno', 'botella', 'tanque', 'jeringa', 'hoja', 'piso', 'piscina', 'bloque', 'cano', 'plano', 'techo', 'lago', 'pendulo', 'planetas', 'caja', 'viento', 'presion', 'deposito'];

// Caja que ocupa cada elemento del SVG (coordenadas absolutas), con medio grosor de trazo; los textos, con su ancho
// estimado (T.ancho) y su alto (de y − tam·0,8 a y + tam·0,25, porque y es la línea base).
function cajas(svg) {
  const out = [], num = (a, k) => { const m = a.match(new RegExp(`\\s${k}="(-?[\\d.]+)"`)); return m ? +m[1] : null; };
  for (const m of svg.matchAll(/<(line|rect|circle|ellipse|path|text)\b([^>]*)>([^<]*)/g)) {
    const [, tag, a, txt] = m, g = (num(a, 'stroke-width') || 0) / 2;
    if (tag === 'line') out.push([Math.min(num(a, 'x1'), num(a, 'x2')) - g, Math.min(num(a, 'y1'), num(a, 'y2')) - g, Math.max(num(a, 'x1'), num(a, 'x2')) + g, Math.max(num(a, 'y1'), num(a, 'y2')) + g, m[0]]);
    else if (tag === 'rect') out.push([num(a, 'x') - g, num(a, 'y') - g, num(a, 'x') + num(a, 'width') + g, num(a, 'y') + num(a, 'height') + g, m[0]]);
    else if (tag === 'circle') { const r = num(a, 'r'); out.push([num(a, 'cx') - r - g, num(a, 'cy') - r - g, num(a, 'cx') + r + g, num(a, 'cy') + r + g, m[0]]); }
    else if (tag === 'ellipse') out.push([num(a, 'cx') - num(a, 'rx') - g, num(a, 'cy') - num(a, 'ry') - g, num(a, 'cx') + num(a, 'rx') + g, num(a, 'cy') + num(a, 'ry') + g, m[0]]);
    else if (tag === 'path') {
      const d = (a.match(/\sd="([^"]+)"/) || [])[1] || '';
      if (/[a-df-z]/.test(d.replace(/e-?\d/g, ''))) continue;   // trazos relativos (objetos viejos): no se miden
      // Solo comandos absolutos M L Q C Z (y A, cuyo punto final cuenta; el arco del péndulo cae entre sus extremos y su fondo).
      const xs = [], ys = [];
      for (const seg of d.matchAll(/([MLQCA])([^MLQCAZ]*)/g)) {
        const v = seg[2].trim().split(/[\s,]+/).map(Number);
        const ps = seg[1] === 'A' ? [v[5], v[6]] : v;
        for (let i = 0; i + 1 < ps.length; i += 2) { xs.push(ps[i]); ys.push(ps[i + 1]); }
      }
      if (xs.length) out.push([Math.min(...xs) - g, Math.min(...ys) - g, Math.max(...xs) + g, Math.max(...ys) + g, m[0]]);
    } else if (tag === 'text') {
      const tam = num(a, 'font-size') || 16, peso = num(a, 'font-weight') || 400, w = T.ancho(txt.replace(/&amp;/g, '&'), tam, peso), x = num(a, 'x'), y = num(a, 'y');
      const anc = (a.match(/text-anchor="(\w+)"/) || [])[1] || 'start', x0 = anc === 'middle' ? x - w / 2 : anc === 'end' ? x - w : x;
      out.push([x0, y - tam * 0.8, x0 + w, y + tam * 0.25, `${m[0]}`]);
    }
  }
  return out;
}

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-objeto'], P));

test('cada objeto: sin NaN ni colores fijos, puro, alto fijo, con su dato y su texto alternativo', () => {
  assert.deepEqual([...P.OBJETOS].sort(), Object.keys(MUESTRAS).sort());
  const altos = new Set();
  for (const [objeto, [d, t]] of Object.entries(MUESTRAS)) {
    const datos = Object.assign({ objeto }, d), s = P.dibujar(datos);
    assert.ok(!/NaN|undefined|Infinity/.test(s), objeto);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), objeto);
    assert.ok(!/\sid="|filter|<image/.test(s), `${objeto}: sin ids, filtros ni imágenes`);
    assert.equal(s, P.dibujar(datos));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(s.includes(`>${T.esc(t)}<`), `${objeto}: falta «${t}»`);
    assert.ok(P.alt(datos).length > 10 && !/undefined/.test(P.alt(datos)), objeto);
  }
  assert.equal(altos.size, 1);
  assert.ok(!/NaN/.test(P.dibujar({ objeto: 'nada' })));
});

test('los objetos nuevos caben en el lienzo con 4 de margen (trazo, puntas y rótulos incluidos)', () => {
  const { W, H } = P.constantes, M = 4;
  const casos = NUEVOS.map(o => Object.assign({ objeto: o }, MUESTRAS[o][0])).concat(VARIANTES), mal = [];
  for (const datos of casos) {
    const s = P.dibujar(datos);
    assert.ok(!/NaN|undefined/.test(s), datos.objeto);
    for (const [x0, y0, x1, y1, el] of cajas(s)) {
      if (!(x0 >= M - 1e-9 && y0 >= M - 1e-9 && x1 <= W - M + 1e-9 && y1 <= H - M + 1e-9))
        mal.push(`${datos.objeto}: se sale (${x0.toFixed(1)}, ${y0.toFixed(1)}) – (${x1.toFixed(1)}, ${y1.toFixed(1)}) en ${el.slice(0, 70)}`);
    }
  }
  assert.deepEqual(mal, []);
});

test('los rótulos de los objetos nuevos no se pisan entre sí', () => {
  const casos = NUEVOS.map(o => Object.assign({ objeto: o }, MUESTRAS[o][0])).concat(VARIANTES), mal = [];
  for (const datos of casos) {
    const txt = cajas(P.dibujar(datos)).filter(c => c[4].startsWith('<text'));
    for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
      const a = txt[i], b = txt[j], cruza = a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
      if (cruza) mal.push(`${datos.objeto}: se pisan ${a[4].replace(/<[^>]+>/, '')} y ${b[4].replace(/<[^>]+>/, '')}`);
    }
  }
  assert.deepEqual(mal, []);
});

// 17 nov (auditoría y lector en frío de «Magnitudes y unidades»): la figura de un ejemplo muestra el planteamiento.
test('comparar: una barra sin valor es una caja punteada con «?», no una barra medida', () => {
  const s = P.dibujar({ objeto: 'comparar', titulo: 'En dos unidades', barras: [{ nombre: 'Avión', texto: '1800 km en 2 h' }, { nombre: 'Sonido', texto: '340 m/s' }] });
  assert.ok(!/NaN|undefined/.test(s));
  assert.equal((s.match(/stroke-dasharray="5 4"/g) || []).length, 2);
  assert.equal((s.match(/>\?</g) || []).length, 2);
  assert.ok(!/fill-opacity="0.75"/.test(s), 'sin barras llenas');
  assert.match(P.alt({ objeto: 'comparar', barras: [{ nombre: 'A', texto: '1 m/s' }] }), /misma unidad/);
  for (const [x0, , x1] of cajas(s)) assert.ok(x0 >= 0 && x1 <= P.constantes.W, 'cabe a lo ancho');
});

test('tanque: lo que guarda va escrito sobre el tanque, no al costado como una cota', () => {
  const s = P.dibujar({ objeto: 'tanque', texto: '1,1 m³' });
  const t = s.match(/<text[^>]*x="([\d.]+)"[^>]*>1,1 m³</);
  assert.ok(t && Math.abs(+t[1] - 150) < 1, 'centrado en el tanque');
  assert.ok(!/<line x1="200" y1="104"/.test(s), 'sin la rayita del costado');
});

test('planetas: el cráter no tapa el rótulo de m₂', () => {
  const s = P.dibujar({ objeto: 'planetas', m1: 'm₁', m2: 'm₂', d: 'd', fuerza: 'F' });
  const cs = cajas(s), rot = cs.find(c => c[4].includes('m₂')), crater = cs.find(c => /<circle[^>]*r="3.5"/.test(c[4]));
  assert.ok(rot && crater);
  assert.ok(!(rot[0] < crater[2] && crater[0] < rot[2] && rot[1] < crater[3] && crater[1] < rot[3]), 'se pisan');
});

test('color2: la fuerza o la aceleración en el color de su papel; por omisión, turquesa', () => {
  assert.match(P.dibujar({ objeto: 'planetas', m1: 'm₁', m2: 'm₂', fuerza: 'F' }), /fill="var\(--c-i\)"[^>]*>F</);
  assert.match(P.dibujar({ objeto: 'planetas', m1: 'm₁', m2: 'm₂', fuerza: 'F', color2: 'o' }), /fill="var\(--c-o\)"[^>]*>F</);
  assert.match(P.dibujar({ objeto: 'caja', masa: 'm', fuerza: 'F', aceleracion: 'a', color2: 'o' }), /fill="var\(--c-o\)"[^>]*>a</);
  assert.match(P.dibujar({ objeto: 'viento', v: 'v', fuerza: 'F', color2: 'o' }), /fill="var\(--c-o\)"[^>]*>F</);
});
